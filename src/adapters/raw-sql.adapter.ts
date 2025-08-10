import { LinkedListInterface } from "@/structures";

export class SQLAdapter {
  //   export interface LinkedListInterface {
  //   logic: string | null; // AND = ; - OR = ,
  //   comparison: any; // { column: username, op: ==, value: Joe }
  //   next: LinkedListInterface | null;
  // }

  public main(): string {
    const whConditions = this.generateRawSQL();
    console.log("Generated wh conditions => ", whConditions);
    return "";
  }

  generateRawSQL() {
    let current: any = this.ast;

    while (current != null) {
      const comparison = current.comparison;

      if (current.logic) {
        this.whConditions.push(current.logic);
      }

      this.whConditions.push(comparison.column);
      this.whConditions.push(comparison.op);
      this.whConditions.push(comparison.value);
      current = current.next;
    }

    return this.whConditions.join(" ");
  }

  private readonly ast: LinkedListInterface;
  private whConditions: string[] = [];
  constructor(ast: LinkedListInterface) {
    this.ast = ast;
  }
}
