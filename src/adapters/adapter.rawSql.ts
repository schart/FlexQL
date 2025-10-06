import { flexQLResultInterface, treeInterface } from "@/structures";

export class SQLAdapter {
  execute(): flexQLResultInterface {
    let values: any = [];
    const ast: treeInterface = this.ast;

    const rootLogic = ast.logic;
    const conditions = ast.conditions;

    this.whConditions.push("WHERE");

    for (let i = 0; i < conditions.length; i++) {
      // Inner conditions
      if (conditions[i].conditions) {
        this.whConditions.push("(");
        for (let j = 0; j < conditions[i].conditions.length; j++) {
          let innerCondition = conditions[i].conditions;

          this.whConditions.push(
            ...[
              innerCondition[j]["column"],
              conditions[j]["op"] == "==" ? "=" : conditions[j]["op"],
              "?",
            ]
          );
          values.push(innerCondition[j]["value"]);

          if (j >= 0 && j < innerCondition.length - 1) {
            this.whConditions.push(conditions[i].logic);
          }
        }
        this.whConditions.push(")");

        // Don't create A logic mark at end of the conditions
        if (i !== conditions.length - 1) {
          this.whConditions.push(rootLogic);
        }
      } else {
        // Straight conditions
        this.whConditions.push(
          ...[
            conditions[i]["column"],
            conditions[i]["op"] == "==" ? "=" : conditions[i]["op"],
            "?",
          ]
        );
        values.push(conditions[i]["value"]);

        // Don't create A logic mark at end of the conditions
        if (i !== conditions.length - 1) {
          this.whConditions.push(rootLogic);
        }
      }
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
