export type TypeCondition = "AND" | "OR";

export interface InterfaceConditions {
  column: string;
  op: string;
  value: string | number;
}

export interface InterfaceLogicalConditions {
  logic?: TypeCondition;
  conditions: (InterfaceConditions | InterfaceLogicalConditions)[];
}
