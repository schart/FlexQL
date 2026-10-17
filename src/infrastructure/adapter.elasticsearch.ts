import { flattedAst } from "@/core/core.flatter";
import { flexQLResultInterface } from "@/shared/interfaces/interface.adapter";
import { BaseAstAdapter } from "./base.adapter";
import { QueryGroup, QueryNode, unflattenAst } from "./adapter.ast";

const operators: Record<string, string> = {
  "==": "term",
  ">": "gt",
  "<": "lt",
  ">=": "gte",
  "<=": "lte",
  "!=": "must_not",
};

export class ElasticsearchAdapter extends BaseAstAdapter {
  generate(): flexQLResultInterface<Record<string, unknown>> {
    return { type: "elasticsearch", payload: { conditions: this.toQuery(unflattenAst(this.ast)) } };
  }

  private toQuery(node: QueryNode): Record<string, unknown> {
    if (this.isGroup(node)) {
      const clauses = node.conditions.map((condition) => this.toQuery(condition));
      return { bool: { [node.logic === "AND" ? "must" : "should"]: clauses } };
    }

    if (node.op === "==") return { term: { [node.column]: node.value } };
    if (node.op === "!=") return { bool: { must_not: [{ term: { [node.column]: node.value } }] } };
    return { range: { [node.column]: { [operators[node.op]]: node.value } } };
  }

  private isGroup(node: QueryNode): node is QueryGroup {
    return "conditions" in node;
  }

  constructor(ast: flattedAst[]) {
    super(ast);
  }
}
