import { separatorRecord } from "@/shared/constants";
import { TokenType } from "@/shared/enums/enum.lexer";
import { tokenInterface } from "@/shared/interfaces/interface.lexer";
import { InterfaceLogicalConditions, InterfaceConditions } from "@/shared/interfaces/interface.parser";
import { Tree } from "./core.tree";

 
export class Parser {
  private pos: number;
  public tree = new Tree();
  private readonly tokens: tokenInterface[];

  constructor(tokens: tokenInterface[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

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
        throw new Error("Unexpected column token: " + column.type);
      }

      if (!Object.values(TokenType).includes(op.type)) {
        throw new Error("Unexpected operator token: " + op.type);
      }

      if (!Object.values(TokenType).includes(value.type)) {
        throw new Error("Unexpected value token: " + value.type);
      }

      console.log(column, op, value)
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
}
