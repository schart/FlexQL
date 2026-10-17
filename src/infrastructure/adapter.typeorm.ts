import { flattedAst } from "@/core/core.flatter";
import { flexQLResultInterface } from "@/shared/interfaces/interface.adapter";
import { BaseAstAdapter } from "./base.adapter";
import { QueryGroup, QueryNode, unflattenAst } from "./adapter.ast";

export interface TypeORMQuery {
  where: string;
  parameters: Record<string, unknown>;
}

export class TypeORMAdapter extends BaseAstAdapter {
  generate(): flexQLResultInterface<TypeORMQuery> {
    const parameters: Record<string, unknown> = {};
    let parameterIndex = 0;
    const where = this.toWhere(unflattenAst(this.ast), parameters, () => parameterIndex++);
    return { type: "typeorm", payload: { conditions: { where, parameters } } };
  }

  private toWhere(node: QueryNode, parameters: Record<string, unknown>, nextParameter: () => number): string {
    if (this.isGroup(node)) {
      const operator = node.logic === "AND" ? " AND " : " OR ";
      return `(${node.conditions.map((condition) => this.toWhere(condition, parameters, nextParameter)).join(operator)})`;
    }
    const operators: Record<string, string> = { "==": "=", "!=": "!=", ">": ">", "<": "<", ">=": ">=", "<=": "<=" };
    if (!operators[node.op]) throw new Error(`Unsupported TypeORM operator: ${node.op}`);
    const parameter = `param${nextParameter()}`;
    parameters[parameter] = node.value;
    return `\`${node.column}\` ${operators[node.op]} :${parameter}`;
  }

  private isGroup(node: QueryNode): node is QueryGroup { return "conditions" in node; }

  constructor(ast: flattedAst[]) { super(ast); }
}
