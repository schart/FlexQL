export type TypeCondition = "AND" | "OR";

export interface InterfaceConditions {
  column: string;
  op: string;
  value: string | number | boolean;
}

export interface InterfaceLogicalConditions {
  logic?: TypeCondition;
  conditions: (InterfaceConditions | InterfaceLogicalConditions)[];
}
