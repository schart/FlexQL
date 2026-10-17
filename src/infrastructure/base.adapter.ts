import { flexQLResultInterface } from "@/shared/interfaces/interface.adapter";
import { flattedAst } from "@/core/core.flatter";

export abstract class BaseAstAdapter<T = unknown> {
  protected readonly ast: flattedAst[];

  constructor(ast: flattedAst[]) {
    this.ast = ast;
  }

  abstract generate(): flexQLResultInterface<T>;
}
