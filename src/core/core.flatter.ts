import { treeInterface } from "@/shared/interfaces/interface.tree";

export interface flattedAst {
  type?: string;
  node?: treeInterface;
  parentLogic?: string;
  startGroup?: boolean;
  endGroup?: boolean;
  column?: string;
  op?: string;
  value?: any;
}

export class AstFlatter {
  // {
  //   logic: 'AND',
  //   conditions: [
  //     { logic: 'OR', conditions: [Array] },
  //     { column: 'views', op: '>', value: 0 },
  //     { logic: 'OR', conditions: [Array] },
  //     { column: 'username', op: '==', value: 'heja' }
  //   ]
  // }
  //
  //    and - group: true
  //    or - group: true
  //        - element
  //        - element
  //    group end: true
  //    leaf record
  //    ,,,,,
  //      ,,,,
  //
  //
  //   [
  //   { groupStart: true, logic: null },
  //   { groupStart: true, logic: "OR" },
  //   { column: "rating", op: ">", value: 4.5, logic: "OR" },
  //   { column: "rating", op: "<=", value: 5, logic: "OR" },
  //   { groupEnd: true },
  //   { column: "views", op: ">", value: 0, logic: "AND" },
  //   { groupStart: true, logic: "OR" },
  //   { column: "comments", op: ">=", value: 100, logic: "OR" },
  //   { column: "test_bool", op: "==", value: true, logic: "OR" },
  //   { groupEnd: true },
  //   { column: "username", op: "==", value: "heja", logic: "AND" },
  //   { groupEnd: true },
  // ];

  main(): flattedAst[] {
    let stack: any[] = [
      {
        type: "node",
        node: this.ast,
        parentLogic: String(this.ast.logic),
        startGroup: true,
      },
    ];
    let result: flattedAst[] = [];

    while (stack.length > 0) {
      const item = stack.pop();

      // If type is "end" add ")" to result
      if (item?.type == "end") {
        result.push({
          endGroup: true,
        });
      }

      let node = item.node;

      if (node) {
        if (node.conditions) {
          result.push({
            startGroup: true,
            parentLogic: node.logic,
          });

          stack.push({
            type: "end",
          });

          if (node.conditions.length > 1) {
            // Add childs reversedly
            for (let i = node.conditions.length - 1; i >= 0; i--) {
              stack.push({
                type: "node",
                node: node.conditions[i],
              });
            }
          }
        } else {
          // Add leaf
          result.push({
            type: "leaf",
            column: node.column,
            op: node.op,
            value: node.value,
          });
        }
      }
    }

    return result;
  }

  protected readonly ast: treeInterface;
  constructor(ast: treeInterface) {
    this.ast = ast;
  }
}
