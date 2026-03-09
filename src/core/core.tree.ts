import { InterfaceLogicalConditions } from "@/shared/interfaces/interface.parser";
import { treeInterface } from "@/shared/interfaces/interface.tree";

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
    return this.tree;
  }

  private tree: treeInterface | null;
  constructor() {
    this.tree = null;
  }
}
