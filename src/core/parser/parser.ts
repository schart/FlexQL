import { LinkedList } from "@/ast";
import {
  LinkedListInterface,
  SeparatorRecord,
  Token,
  TokenType,
} from "@/structures";
import { GENERAL_ERROR } from "@/structures/constants/error.constant";

export class Parser {
  public main(): LinkedListInterface | null {
    this.parser();
    return this.linkedList.peek();
  }

  private peek() {
    return this.tokens[this.pos];
  }

  private consume() {
    let current: number = 0;
    if (this.pos < this.tokens.length) {
      current = this.pos;
      this.pos++;
    }
    return this.tokens[current];
  }

  private parser() {
    this.parseCondition();
    let separator: any = "";

    while (this.pos < this.tokens.length) {
      if (this.peek().type == TokenType.EOF) return;
      if (this.peek().type == TokenType.SEPARATOR) {
        separator = this.peek().value;
        this.consume();
      }

      let column: Token | undefined = this.consume();
      let op: Token | undefined = this.consume();
      let value: Token | undefined = this.consume();

      if (column.type != TokenType.COLUMN) {
        throw new Error(GENERAL_ERROR.UNEXCEPTED_TOKEN + " " + column.value);
      }

      if (op.type != TokenType.OPERATOR) {
        throw new Error(GENERAL_ERROR.UNEXCEPTED_TOKEN + " " + op.value);
      }

      if (value.type != TokenType.VALUE) {
        throw new Error(GENERAL_ERROR.UNEXCEPTED_TOKEN + " " + value.value);
      }

      this.linkedList.insert({
        logic: separator == SeparatorRecord?.separators?.and ? "AND" : "OR",
        comparison: {
          column: column.value,
          op: op.value,
          value: value.value,
        },
        next: null,
      });
    }

    this.pos++;
  }

  private parseCondition() {
    let column: Token | undefined = this.consume();
    let op: Token | undefined = this.consume();
    let value: Token | undefined = this.consume();

    if (column.type != TokenType.COLUMN) {
      throw new Error(GENERAL_ERROR.UNEXCEPTED_TOKEN + " " + column.value);
    }

    if (op.type != TokenType.OPERATOR) {
      throw new Error(GENERAL_ERROR.UNEXCEPTED_TOKEN + " " + op.value);
    }

    if (value.type != TokenType.VALUE) {
      throw new Error(GENERAL_ERROR.UNEXCEPTED_TOKEN + " " + value.value);
    }

    this.linkedList.insert({
      logic: null,
      comparison: { column: column.value, op: op.value, value: value.value },
      next: null,
    });
  }

  private pos: number;
  private readonly tokens: Token[];
  public linkedList = new LinkedList();

  constructor(tokens: Token[]) {
    this.pos = 0;
    this.tokens = tokens;
  }
}
