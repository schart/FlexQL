import { flattedAst } from "@/core/core.flatter";
import { SEQUZELIZE_OPERATORS } from "@/shared/constants/constant.sequelize";
import { flexQLResultInterface } from "@/shared/interfaces/interface.adapter";
import { BaseAstAdapter } from "./base.adapter";
import { QueryGroup, QueryNode, unflattenAst } from "./adapter.ast";

export class SequelizeAdapter extends BaseAstAdapter {
  generate(): flexQLResultInterface<Record<string, unknown>> {
    return { type: "sequelize", payload: { conditions: this.toCondition(unflattenAst(this.ast)) } };
  }

  private toCondition(node: QueryNode): Record<string | symbol, unknown> {
    if (this.isGroup(node)) {
      return { [SEQUZELIZE_OPERATORS[node.logic]]: node.conditions.map((condition) => this.toCondition(condition)) };
    }
    const operator = SEQUZELIZE_OPERATORS[node.op];
    if (!operator) throw new Error(`Unsupported Sequelize operator: ${node.op}`);
    return { [node.column]: { [operator]: node.value } };
  }

  private isGroup(node: QueryNode): node is QueryGroup { return "conditions" in node; }

  constructor(ast: flattedAst[]) { super(ast); }
}
