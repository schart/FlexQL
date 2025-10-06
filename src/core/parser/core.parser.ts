import { Tree } from "@/ast";
import {
  TokenType,
  tokenInterface,
  separatorRecord,
  treeInterface,
} from "@/structures";

export class Parser {
  public main(): treeInterface | null {
    this.parser();
    return this.tree.peek();
  }

  private peek(): (typeof this.tokens)[0] {
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
    let andConditions: any[] = [];
    let orConditions: any[] = [];

    while (this.peek() && this.peek().type !== TokenType.EOF) {
      let column: tokenInterface | undefined = this.consume();
      let op: tokenInterface | undefined = this.consume();
      let value: tokenInterface | undefined = this.consume();

      orConditions.push({
        column: column.value,
        op: op.value,
        value: value.value,
      });

      let next;
      next = this.peek()?.value;

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
        // if (andConditions.length === 1) {
        //   orConditions.push(andConditions[0]);
        // } else {
        //   orConditions.push({ logic: "AND", conditions: [...andConditions] });
        // }
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
      this.tree.insert(andConditions[0]);
    } else {
      this.tree.insert({ logic: "AND", conditions: andConditions });
    }

    // this.tree.traversal();
  }

  private pos: number;
  public tree = new Tree();
  private readonly tokens: tokenInterface[];

  constructor(tokens: tokenInterface[]) {
    this.tokens = tokens;
    this.pos = 0;
  }
}
