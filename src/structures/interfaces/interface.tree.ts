import {
  InterfaceLogicalConditions,
  InterfaceConditions,
} from "./interface.parser";

export interface treeInterface {
  logic?: "AND" | "OR";
  conditions: (InterfaceLogicalConditions | InterfaceConditions)[];
}
