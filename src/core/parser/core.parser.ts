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

  private peek(): typeof this.tokens[0]{
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

 

  /**
   * @step1 -> Keep possible and
   * @step2 -> Continue since you hit a OR (, ... or custom)
   * @step3 -> When you see a OR, check length of possible arrays 
   * @step4 -> If length of possible and arrays is equal to 1 this get mean that's a OR not AND flush in OR as a OR
   * @step5 -> If longest than 1 then flush in Or with AND logic
   * 
   * 
   */

  private parser() {
   let andConditions: (any)[] = []
   let orConditions: (any)[] = []

 
    while (this.peek() && this.peek().type !== TokenType.EOF) {
      let column: tokenInterface | undefined = this.consume();
      let op: tokenInterface | undefined = this.consume();
      let value: tokenInterface | undefined = this.consume();

      andConditions.push({ column: column.value, op: op.value, value: value.value })

      let current = this.peek().value
       if (current == separatorRecord.separators?.and) {
        this.consume()
        continue
      };

      if (current === separatorRecord.separators?.or) {
        if (andConditions.length === 1) {
          orConditions.push(andConditions[0])
        } else { 
          orConditions.push({ logic: "AND", conditions: [...andConditions] })
        };
       
        andConditions = [];
      }

      this.consume();
    };


    if (orConditions.length === 0) {
      this.tree.insert({ logic: "AND", conditions: [...andConditions] });
      return; 
    };

    if (andConditions.length === 1) {
      orConditions.push(andConditions[0])
    } else {
      orConditions.push({ logic: "AND", conditions:  [...andConditions] })
    }


    this.tree.insert({ logic: "OR", conditions: [...orConditions] })    
    // this.tree.traversal()
  }

 
  private pos: number;
  public tree = new Tree();
  private readonly tokens: tokenInterface[];

  constructor(tokens: tokenInterface[]) {
    this.tokens = tokens;
    this.pos = 0;
  }
}
