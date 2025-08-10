import { Lexer, Parser } from "@/core";
import { LinkedListInterface, RunQueryOptions, Token } from "@/structures";
import { SQLAdapter } from "@/adapters";

export class FlexQL {
  generate(
    input: string,
    options: RunQueryOptions | any = { adapter: "raw_sql" }
  ) {
    const parsedAST = this.core(input);
    if (!parsedAST) {
      return null;
    }

    return this.executeAdapter(parsedAST, options.adapter);
  }

  private executeAdapter(ast: LinkedListInterface, adapter: string) {
    const adapters: Record<string, any> = {
      raw_sql: new SQLAdapter(ast).main(),
    };

    return adapters[adapter];
  }

  private core(input: string): LinkedListInterface | null {
    const tokens: Token[] = new Lexer(input).main();
    const parser = new Parser(tokens);
    return parser.main() || null;
  }
}
