import { BaseAstAdapter } from "./base.adapter";
import { flattedAst } from "@/core/core.flatter";
import { SEQUZELIZE_OPERATORS } from "@/shared/constants/constant.sequelize";
import { flexQLResultInterface } from "@/shared/interfaces/interface.adapter";

export class SequelizeAdapter extends BaseAstAdapter {
  protected readonly ast: flattedAst[];

  constructor(ast: flattedAst[]) {
    super({});
    this.ast = ast;
  }

  generate(): flexQLResultInterface {
    let result: any = [];
    let logic: string[] = [];

    this.ast.forEach((element, index) => {
      index++;

      if (element.startGroup === true) {
        if (element.parentLogic === "OR") {
          result.push({ [SEQUZELIZE_OPERATORS.OR]: [] });
          logic.push(SEQUZELIZE_OPERATORS.OR);
        } else if (element.parentLogic === "AND") {
          logic.push(SEQUZELIZE_OPERATORS.AND);
        }
      }

      if (element.type === "leaf") {
        if (logic[logic.length - 1] === SEQUZELIZE_OPERATORS.OR) {
          let or = result[result.length - 1][SEQUZELIZE_OPERATORS["OR"]];

          if (or) {
            or.push({
              [String(element.column)]: {
                [SEQUZELIZE_OPERATORS[String(element.op)]]: element.value,
              },
            });
          }
        } else {
          result.push({
            [String(element.column)]: {
              [SEQUZELIZE_OPERATORS[String(element.op)]]: element.value,
            },
          });
        }
      }

      if (element.endGroup) {
        logic.pop();
      }
    });

    return {
      payload: {
        conditions: { [SEQUZELIZE_OPERATORS.AND]: result },
      },
      type: "sequelize",
    };
  }
}
