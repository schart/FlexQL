import { flexQLResultInterface } from "@/shared/interfaces/interface.adapter";

export abstract class BaseAstAdapter {
  protected readonly ast: any;

  constructor(ast: any) {
    this.ast = ast;
  }

  abstract generate(): flexQLResultInterface;
}
