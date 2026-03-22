import { LEXER_ERROR, PARSER_ERROR, separatorRecord } from "@/shared/constants";
import { TokenType } from "@/shared/enums/enum.lexer";
import { tokenInterface } from "@/shared/interfaces/interface.lexer";
import {
  InterfaceLogicalConditions,
  InterfaceConditions,
} from "@/shared/interfaces/interface.parser";
import { Tree } from "./core.tree";
import {
  flexQLResultInterface,
  runQuerySettingsInterface,
} from "@/shared/interfaces/interface.adapter";

export class Parser {
  public parse(): InterfaceLogicalConditions | null {
    this.core();
    return this.tree.peek();
  }

  private peek(): tokenInterface {
    return this.tokens[this.pos];
  }

  private consume(): tokenInterface {
    let currentPos: number = 0;
    if (this.pos < this.tokens.length) {
      currentPos = this.pos;
      this.pos++;
    }
    return this.tokens[currentPos];
  }

  // Core/key stage of parser
  private core() {
    let andConditions: (InterfaceLogicalConditions | InterfaceConditions)[] =
      [];
    let orConditions: (InterfaceLogicalConditions | InterfaceConditions)[] = [];

    while (this.peek() && this.peek().type !== TokenType.EOF) {
      let column: tokenInterface = this.consume();
      let op: tokenInterface = this.consume();
      let value: tokenInterface = this.consume();

      if (!Object.values(TokenType).includes(column.type)) {
        throw new Error(PARSER_ERROR.UNEXPECTED_COLUMN(column.type));
      }
      if (!Object.values(TokenType).includes(op.type)) {
        throw new Error(PARSER_ERROR.UNEXPECTED_OPERATOR(op.type));
      }
      if (!Object.values(TokenType).includes(value.type)) {
        throw new Error(PARSER_ERROR.UNEXPECTED_VALUE(value.type));
      }

      // RULE MAP
      const ruleMap = this.settings?.columnProtect?.rules;
      if (ruleMap) {
        const allowedOps = ruleMap[column.value];
        if (allowedOps && !allowedOps.includes(String(op.value))) {
          throw new Error(
            LEXER_ERROR.RULE_VIOLATION(
              String(column.value),
              String(op.value),
              allowedOps,
            ),
          );
        }
      }
      // RULE MAP

      orConditions.push({
        column: column.value,
        op: op.value,
        value: value.value,
      });

      let next: tokenInterface["value"] = this.peek()?.value;
      if (next == separatorRecord.separators?.and) {
        this.consume();

        if (orConditions.length === 1) {
          andConditions.push(orConditions[0]);
        } else {
          andConditions.push({ logic: "OR", conditions: [...orConditions] });
        }

        orConditions = [];
        continue;
      }

      if (next === separatorRecord.separators?.or) {
        this.consume();
        continue;
      }

      this.consume();
    }

    if (orConditions.length === 1) {
      andConditions.push(orConditions[0]);
    } else {
      andConditions.push({ logic: "OR", conditions: [...orConditions] });
    }

    // Build tree
    if (andConditions.length === 1) {
      this.tree.insert(andConditions[0] as any);
    } else {
      this.tree.insert({ logic: "AND", conditions: andConditions });
    }
  }

  private pos: number;
  public tree = new Tree();
  private readonly tokens: tokenInterface[];
  private readonly settings?: runQuerySettingsInterface;

  constructor(tokens: tokenInterface[], settings?: runQuerySettingsInterface) {
    this.settings = settings;
    this.tokens = tokens;
    this.pos = 0;
  }
}
