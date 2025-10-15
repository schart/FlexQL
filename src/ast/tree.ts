import {
  InterfaceLogicalConditions,
  InterfaceConditions,
} from "@/structures/interfaces/interface.parser";

export interface treeInterface {
  logic?: "AND" | "OR";
  conditions: (InterfaceLogicalConditions | InterfaceConditions)[];
}

export class Tree {
  insert(object: treeInterface) {
    if (!this.tree) {
      this.tree = object;
      return;
    }

    this.tree.conditions.push(object as InterfaceLogicalConditions);
  }

  traversal() {
    let current = this.tree;
    console.log(current);
  }

  peek(): treeInterface | null {
    return this.tree || null;
  }

  private tree: treeInterface | null;
  constructor() {
    this.tree = null;
  }
}
