import { flexQLResultInterface } from "@/structures";
import { treeInterface } from "@/structures/interfaces/interface.tree";

export class SQLAdapter {
  private readonly ast: treeInterface | any;
  private whConditions: string[] = ["WHERE"];

  constructor(ast: treeInterface) {
    this.ast = ast;
  }

  execute(): flexQLResultInterface {
    const values: string[] = [];
    const ast: any = this.ast;
    const rootLogic = ast.logic;
    const conditions = ast.conditions;

    // ✅ Fix: check for conditions array instead of [ast].length === 1
    if (Array.isArray(conditions) && conditions.length > 0) {
      // Process multiple query conditions
      for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i];

        if (condition.conditions) {
          // Nested group
          this.whConditions.push("(");

          const innerConditions = condition.conditions;
          for (let j = 0; j < innerConditions.length; j++) {
            const inner = innerConditions[j];

            this.whConditions.push(
              inner["column"],
              inner["op"] === "==" ? "=" : inner["op"],
              "?"
            );
            values.push(inner["value"]);

            if (j < innerConditions.length - 1) {
              this.whConditions.push(condition.logic);
            }
          }

          this.whConditions.push(")");

          if (i < conditions.length - 1) {
            this.whConditions.push(rootLogic);
          }
        } else {
          // Single condition
          this.whConditions.push(
            condition["column"],
            condition["op"] === "==" ? "=" : condition["op"],
            "?"
          );
          values.push(condition["value"]);

          if (i < conditions.length - 1) {
            this.whConditions.push(rootLogic);
          }
        }
      }
    } else {
      // Process just one simple query
      this.whConditions.push(ast.column, ast.op === "==" ? "=" : ast.op, "?");
      values.push(ast.value);
    }

    return {
      type: "raw-sql",
      payload: {
        conditions:
          this.whConditions.length === 1 ? "" : this.whConditions.join(" "),
        values,
      },
    };
  }
}
