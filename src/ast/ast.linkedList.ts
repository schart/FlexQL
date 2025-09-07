/*
  I used linked list instead of Binary Tree cause the i don't necessary vertical movement currently
*/

import { linkedListInterface } from "@/structures";

export class LinkedList {
  insert(object: linkedListInterface) {
    if (!this.linkedList) {
      this.linkedList = object;
      return;
    }

    let current = this.linkedList;

    while (current.next !== null) {
      current = current.next;
    }

    current.next = object;
  }

  traversal() {
    let current = this.linkedList;

    while (current?.next != null) {
      current = current.next;
    }
    console.log(current?.comparison);
  }

  peek(): linkedListInterface | null {
    return this.linkedList || null;
  }

  private linkedList: linkedListInterface | null;

  constructor() {
    this.linkedList = null;
  }
}
