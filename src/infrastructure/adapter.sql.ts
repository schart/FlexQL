import { BaseAstAdapter } from "./base.adapter";
import { treeInterface } from "@/shared/interfaces/interface.tree";
import { flexQLResultInterface } from "@/shared/interfaces/interface.adapter";

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
}
