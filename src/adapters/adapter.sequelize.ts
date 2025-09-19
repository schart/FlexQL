import { flexQLResultInterface, linkedListInterface } from "@/structures";

export class SequelizeAdapter {
  execute(): flexQLResultInterface | null {
    let where: Record<any, any> = {};
    let current: typeof this.ast = this.ast;

    while (current.next != null) {
      current = current.next;
    }

    return null;
  }

  private readonly ast: linkedListInterface;
  constructor(ast: linkedListInterface) {
    this.ast = ast;
  }
}
