import { flattedAst } from "@/core/core.flatter";

export interface QueryLeaf {
  column: string;
  op: string;
  value: unknown;
}

export interface QueryGroup {
  logic: "AND" | "OR";
  conditions: QueryNode[];
}

export type QueryNode = QueryLeaf | QueryGroup;

export function unflattenAst(ast: flattedAst[]): QueryNode {
  const root = ast[0];

  // A single leaf may be passed as the whole document; return it as-is so the
  // caller never receives an empty condition group (which would match all rows).
  if (root && !root.startGroup) {
    return {
      column: String(root.column),
      op: String(root.op),
      value: root.value,
    };
  }

  let index = 0;

  const readGroup = (): QueryGroup => {
    const start = ast[index++];
    const conditions: QueryNode[] = [];

    while (index < ast.length && !ast[index].endGroup) {
      const item = ast[index];
      if (item.startGroup) conditions.push(readGroup());
      else {
        index++;
        conditions.push({
          column: String(item.column),
          op: String(item.op),
          value: item.value,
        });
      }
    }

    if (ast[index]?.endGroup) index++;
    return { logic: start.parentLogic === "OR" ? "OR" : "AND", conditions };
  };

  return readGroup();
}
