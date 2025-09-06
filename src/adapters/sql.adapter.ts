import { LinkedListInterface } from "@/structures";

export class SQLAdapter {
  public main(): string {
    const whConditions = this.generateRawSQL();
    return whConditions;
  }

  generateRawSQL() {
    let current: any = this.ast;
    this.whConditions.push("WHERE");

    while (current != null) {
      const comparison = current.comparison;

      if (current.logic) {
        this.whConditions.push(current.logic);
      }

      this.whConditions.push(comparison.column);
      this.whConditions.push(comparison.op == "==" ? "=" : comparison.op);

      // Note: Numeric comparisons should avoid quoting numbers (e.g., use age > 10 instead of age > '10')
      // to ensure proper type handling and better performance. Will update parser to handle this.
      this.whConditions.push(`'${comparison.value}'`);

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
