export interface treeInterface {
  logic: string; // AND = ? - OR = ?
  conditions: any//{column: string, op: string, value: string}[] | Pick<treeInterface, 'conditions'>[];   
 }
