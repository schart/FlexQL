import { flexQLResultInterface, treeInterface } from "@/structures";

export class SequelizeAdapter {
  execute(): flexQLResultInterface | null {
    let where: Record<any, any> = {};
    let current: typeof this.ast = this.ast;
 
    
    return null;
  }

  private readonly ast: treeInterface;
  constructor(ast: treeInterface) {
    this.ast = ast;
  }
}
