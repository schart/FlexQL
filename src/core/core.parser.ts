import { LEXER_ERROR, PARSER_ERROR, separatorRecord } from "@/shared/constants";
import { TokenType } from "@/shared/enums/enum.lexer";
import { tokenInterface } from "@/shared/interfaces/interface.lexer";
import {
  InterfaceConditions,
  InterfaceLogicalConditions,
} from "@/shared/interfaces/interface.parser";
import { Tree } from "./core.tree";
import { runQuerySettingsInterface } from "@/shared/interfaces/interface.adapter";

type Condition = InterfaceConditions | InterfaceLogicalConditions;

export class Parser {
  public parse(): InterfaceLogicalConditions | null {
    if (this.peek().type === TokenType.EOF) return null;

    const result = this.parseExpression(0);
    if (this.peek().type !== TokenType.EOF) {
      throw new Error(PARSER_ERROR.UNEXPECTED_PARENTHESIS);
    }

    // Adapters always expect a logical group at the root, so a single
    // condition is wrapped in an AND group instead of becoming the root.
    const root: InterfaceLogicalConditions =
      "conditions" in result ? result : { logic: "AND", conditions: [result] };

    this.tree.insert(root);
    return this.tree.peek();
  }

  private parseExpression(depth: number): Condition {
    if (depth > this.maxDepth) {
      throw new Error(PARSER_ERROR.MAX_DEPTH(this.maxDepth));
    }

    const andConditions: Condition[] = [this.parseOr(depth)];
    while (this.isSeparator(separatorRecord.separators?.and)) {
      this.consume();
      andConditions.push(this.parseOr(depth));
    }

    return this.group("AND", andConditions);
  }

  private parseOr(depth: number): Condition {
    const orConditions: Condition[] = [this.parseTerm(depth)];
    while (this.isSeparator(separatorRecord.separators?.or)) {
      this.consume();
      orConditions.push(this.parseTerm(depth));
    }

    return this.group("OR", orConditions);
  }

  private parseTerm(depth: number): Condition {
    if (this.peek().type === TokenType.OPEN_PAREN) {
      this.consume();
      const result = this.parseExpression(depth + 1);
      if (this.peek().type !== TokenType.CLOSE_PAREN) {
        throw new Error(PARSER_ERROR.UNMATCHED_PARENTHESIS);
      }
      this.consume();
      return result;
    }

    const column = this.consume();
    const op = this.consume();
    const value = this.consume();

    if (column.type !== TokenType.COLUMN) {
      throw new Error(PARSER_ERROR.UNEXPECTED_COLUMN(column.type));
    }
    const columnName = String(column.value);
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(columnName)) {
      throw new Error(`Invalid column name: ${columnName}`);
    }
    if (
      this.settings?.allowedColumns &&
      !this.settings.allowedColumns.includes(columnName)
    ) {
      throw new Error(`Column is not allowed: ${columnName}`);
    }
    if (op.type !== TokenType.OPERATOR) {
      throw new Error(PARSER_ERROR.UNEXPECTED_OPERATOR(op.type));
    }
    if (![TokenType.STRING, TokenType.NUMBER, TokenType.BOOLEAN].includes(value.type)) {
      throw new Error(PARSER_ERROR.UNEXPECTED_VALUE(value.type));
    }

    // Only own entries are valid rules: inherited Object.prototype members
    // (e.g. "constructor", "toString") must not be treated as operator rules.
    const rules = this.settings?.columnProtect?.rules;
    const allowedOps =
      rules && Object.prototype.hasOwnProperty.call(rules, columnName)
        ? rules[columnName]
        : undefined;

    if (allowedOps !== undefined && !Array.isArray(allowedOps)) {
      throw new Error(PARSER_ERROR.INVALID_COLUMN_RULE(columnName));
    }

    if (allowedOps && !allowedOps.includes(String(op.value))) {
      throw new Error(
        LEXER_ERROR.RULE_VIOLATION(columnName, String(op.value), allowedOps),
      );
    }

    return { column: columnName, op: String(op.value), value: value.value };
  }

  private group(logic: "AND" | "OR", conditions: Condition[]): Condition {
    return conditions.length === 1 ? conditions[0] : { logic, conditions };
  }

  private isSeparator(value: string | undefined): boolean {
    return this.peek().type === TokenType.SEPARATOR && this.peek().value === value;
  }

  private consume(): tokenInterface {
    return this.tokens[this.pos++];
  }

  private peek(): tokenInterface {
    return this.tokens[this.pos] ?? { type: TokenType.EOF, value: "EOF" };
  }

  private readonly maxDepth: number;
  private pos = 0;
  public tree = new Tree();

  constructor(
    private readonly tokens: tokenInterface[],
    private readonly settings?: runQuerySettingsInterface,
  ) {
    this.maxDepth = settings?.maxDepth ?? 3;
  }
}
