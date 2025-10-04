import { flexQLResultInterface, treeInterface } from "@/structures";

export class SQLAdapter {
  execute(): flexQLResultInterface {
    let values: any = [];
    let current: any = this.ast;

     return {type: 'raw-sql', payload: null}
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
      values.push(`${comparison.value}`);
      this.whConditions.push(`?`);

      current = current.next;
    }

    return {
      type: "raw-sql",
      payload: { conditions: this.whConditions.join(" "), values: values },
    };
  }

  private readonly ast: treeInterface;
  private whConditions: string[] = [];
  constructor(ast: treeInterface) {
    this.ast = ast;
  }
}
