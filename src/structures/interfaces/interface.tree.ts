export interface treeInterface {
  logic: string; // AND = ? - OR = ?
  conditions: Pick<treeInterface, 'conditions'>[];   
 }
