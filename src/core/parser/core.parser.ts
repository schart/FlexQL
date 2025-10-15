import { Tree } from "@/ast";
import { TokenType, tokenInterface, separatorRecord } from "@/structures";

export type TypeCondition = "AND" | "OR";

export interface InterfaceConditions {
  column: string;
  op: string;
  value: string | number;
}

export interface InterfaceLogicalConditions {
  logic?: TypeCondition;
  conditions: (InterfaceConditions | InterfaceLogicalConditions)[];
}

export class Parser {
  public main(): InterfaceLogicalConditions | null {
    this.parser();
    return this.tree.peek();
  }

  private peek(): tokenInterface {
    return this.tokens[this.pos];
  }

  private consume(): tokenInterface {
    let current: number = 0;
    if (this.pos < this.tokens.length) {
      current = this.pos;
      this.pos++;
    }
    return this.tokens[current];
  }

  private parser() {
    let andConditions: (InterfaceLogicalConditions | InterfaceConditions)[] =
      [];
    let orConditions: (InterfaceLogicalConditions | InterfaceConditions)[] = [];

    while (this.peek() && this.peek().type !== TokenType.EOF) {
      let column: tokenInterface = this.consume();
      let op: tokenInterface = this.consume();
      let value: tokenInterface = this.consume();

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

  constructor(tokens: tokenInterface[]) {
    this.tokens = tokens;
    this.pos = 0;
  }
}
