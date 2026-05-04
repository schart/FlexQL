import { flattedAst } from "@/core/core.flatter";
import { BaseAstAdapter } from "./base.adapter";
import { MONGO_OPERATORS } from "@/shared/constants/constant.mongo";

export class MongoAdapter extends BaseAstAdapter {
  generate(): any {
    let result: any = {};
    let logic: string[] = [];
    this.ast.forEach((element, index) => {
      index++;
      if (element.startGroup === true) {
        if (element.parentLogic === "OR") {
          result[MONGO_OPERATORS.OR] = [];
          logic.push(MONGO_OPERATORS.OR);
        } else if (element.parentLogic === "AND") {
          logic.push(MONGO_OPERATORS.AND);
        }
      }
      if (element.type === "leaf") {
        if (logic[logic.length - 1] === MONGO_OPERATORS.OR) {
          let or = result[MONGO_OPERATORS.OR];

          if (or) {
            or.push({
              [String(element.column)]: { [String(element.op)]: element.value },
            });
          }
        } else {
          if (!result[MONGO_OPERATORS.AND]) {
            result[MONGO_OPERATORS.AND] = [];
          }
          result[MONGO_OPERATORS.AND].push({
            [String(element.column)]: { [String(element.op)]: element.value },
          });
        }
      }
      if (element.endGroup) {
        logic.pop();
      }
    });
    return {
      payload: result,
      type: "mongo",
    };
  }

  protected readonly ast: flattedAst[];

  constructor(ast: flattedAst[]) {
    super({});
    this.ast = ast;
  }
}
