import { SEQUZELIZE_OPERATORS } from "@/shared/constants/constant.sequelize";
import { flexQLResultInterface } from "@/shared/interfaces/interface.adapter";
import { AstFlatter, flattedAst } from "@/core/core.flatter";
import { BaseAstAdapter } from "./base.adapter";
import { where } from "sequelize";

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
        // If Logic is "OR" proceed for OR Group

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

  // execute(): flexQLResultInterface {
  //   const ast: any = this.ast;
  //   const conditions = ast.conditions;

  //   // Groupping of AND & OR FACTORIES
  //   let orCond: object[] = [];
  //   let andCond: object[] = [];
  //   let orGroups: object[] = [];

  //   if (Array.isArray(conditions) && conditions.length > 0) {
  //     // Process AND factors
  //     conditions
  //       .filter((c: InterfaceConditions) => c.column && c.value !== undefined)
  //       .forEach((c: InterfaceConditions) => {
  //         andCond.push({
  //           [c.column]:
  //             c.op === "=="
  //               ? c.value
  //               : { [SEQUZELIZE_OPERATORS[c.op]]: c.value },
  //         });
  //       });

  //     // Process OR factors
  //     for (let i = 0; i < conditions.length; i++) {
  //       if (conditions[i].logic) {
  //         conditions[i].conditions
  //           .filter(
  //             (c: InterfaceConditions) => c.column && c.value !== undefined,
  //           )
  //           .forEach((c: InterfaceConditions) => {
  //             orCond.push({
  //               [c.column]:
  //                 c.op === "=="
  //                   ? c.value
  //                   : { [SEQUZELIZE_OPERATORS[c.op]]: c.value },
  //             });
  //           });

  //         orGroups.push({
  //           [SEQUZELIZE_OPERATORS[conditions[i].logic]]: orCond,
  //         });
  //         orCond = [];
  //       }
  //     }
  //   } else {
  //     // Process Just One
  //     this.whConditions.where = {
  //       [this.ast.column]: {
  //         [SEQUZELIZE_OPERATORS[this.ast.op]]: this.ast.value,
  //       },
  //     };
  //   }

  //   this.whConditions.where = andCond;
  //   if (orGroups.length > 0) {
  //     this.whConditions.where.push(...orGroups);
  //   }

  //   // If both are null AND & OR
  //   if (andCond.length === 0 && orCond.length === 0) {
  //     this.whConditions = {};
  //   }

  //   return {
  //     type: "sequelize",
  //     payload: {
  //       conditions: this.whConditions,
  //     },
  //   };
  // }
}
