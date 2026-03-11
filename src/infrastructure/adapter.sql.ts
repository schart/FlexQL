import { treeInterface } from "@/shared/interfaces/interface.tree";
import { flexQLResultInterface } from "@/shared/interfaces/interface.adapter";
import { BaseAstAdapter } from "./base.adapter";

export class SQLAdapter extends BaseAstAdapter {
  protected readonly ast: treeInterface | any;

  constructor(ast: any) {
    super({});
    this.ast = ast;
  }

  generate(): flexQLResultInterface {
    let logic: string[] = [];
    let result: string[] = [];
    let values: any[] = [];

    this.ast.forEach((element: any, index: number = 0) => {
      index++;

      if (element.startGroup === true) {
        logic.push(element.parentLogic || "AND");
        result.push("(");
      }

      if (element.type == "leaf") {
        result.push(
          element.column,
          element.op === "==" ? "=" : element.op,
          "?",
        );

        values.push(element.value);

        // If not endgroup both current (index-1) and next (index)
        if (!this.ast[index].endGroup) {
          result.push(logic[logic.length - 1]);
        }
      }

      if (element.endGroup === true) {
        //  If end then delete logic from stack
        logic.pop();
        result.push(")");

        // If next leaf or a new group then bind them with root logic
        if (this.ast[index]?.type === "leaf" || this.ast[index]?.startGroup) {
          result.push(logic[logic.length - 1]);
        }
      }
    });

    return {
      type: "sql",
      payload: {
        conditions: result.length === 1 ? "" : result.join(" "),
        values,
      },
    };
  }

  // execute(): flexQLResultInterface {
  //   const values: string[] = [];
  //   const ast: any = this.ast;
  //   const rootLogic = ast.logic;
  //   const conditions = ast.conditions;

  //   if (Array.isArray(conditions) && conditions.length > 0) {
  //     for (let i = 0; i < conditions.length; i++) {
  //       const condition = conditions[i];

  //       if (condition.conditions) {
  //         this.whConditions.push("(");

  //         const innerConditions = condition.conditions;
  //         for (let j = 0; j < innerConditions.length; j++) {
  //           const inner = innerConditions[j];

  //           this.whConditions.push(
  //             inner["column"],
  //             inner["op"] === "==" ? "=" : inner["op"],
  //             "?",
  //           );

  //           values.push(inner["value"]);

  //           if (j < innerConditions.length - 1) {
  //             this.whConditions.push(condition.logic);
  //           }
  //         }

  //         this.whConditions.push(")");

  //         if (i < conditions.length - 1) {
  //           this.whConditions.push(rootLogic);
  //         }
  //       } else {
  //         this.whConditions.push(
  //           condition["column"],
  //           condition["op"] === "==" ? "=" : condition["op"],
  //           "?",
  //         );
  //         values.push(condition["value"]);

  //         if (i < conditions.length - 1) {
  //           this.whConditions.push(rootLogic);
  //         }
  //       }
  //     }
  //   } else {
  //     // Process just one simple query
  //     this.whConditions.push(ast.column, ast.op === "==" ? "=" : ast.op, "?");
  //     values.push(ast.value);
  //   }

  //   return {
  //     type: "sql",
  //     payload: {
  //       conditions:
  //         this.whConditions.length === 1 ? "" : this.whConditions.join(" "),
  //       values,
  //     },
  //   };
  // }
}
