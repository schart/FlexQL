import { flattedAst } from "@/core/core.flatter";
import { flexQLResultInterface } from "@/shared/interfaces/interface.adapter";
import { BaseAstAdapter } from "./base.adapter";
import { QueryGroup, QueryNode, unflattenAst } from "./adapter.ast";

export class MongoAdapter extends BaseAstAdapter {
  generate(): flexQLResultInterface<Record<string, unknown>> {
    return { type: "mongo", payload: { conditions: this.toCondition(unflattenAst(this.ast)) } };
  }

  private toCondition(node: QueryNode): Record<string, unknown> {
    if (this.isGroup(node)) {
      const operator = node.logic === "AND" ? "$and" : "$or";
      return { [operator]: node.conditions.map((condition) => this.toCondition(condition)) };
    }
    const operators: Record<string, string> = { "==": "$eq", "!=": "$ne", ">": "$gt", "<": "$lt", ">=": "$gte", "<=": "$lte" };
    if (!operators[node.op]) throw new Error(`Unsupported MongoDB operator: ${node.op}`);
    return { [node.column]: { [operators[node.op]]: node.value } };
  }

  private isGroup(node: QueryNode): node is QueryGroup { return "conditions" in node; }

  constructor(ast: flattedAst[]) { super(ast); }
}
