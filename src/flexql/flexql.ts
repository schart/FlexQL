import { Lexer, Parser } from "@/core";
import { SQLAdapter } from "@/adapters";
import { LinkedListInterface, RunQuerySettings, Token } from "@/structures";
import { Settings } from "@/settings/settings";

export class FlexQL {
  generate(input: string, settings?: RunQuerySettings | {}): string | null {
    const parsedAst = this.core(input, settings);
    if (!parsedAst) {
      return null;
    }

    return this.executeAdapter(parsedAst, settings);
  }

  private executeAdapter(
    ast: LinkedListInterface,
    { adapter }: Pick<RunQuerySettings, "adapter"> = {}
  ): string {
    const adapters: Record<string, any> = {
      "raw-sql": new SQLAdapter(ast).main(),
    };

    return adapters[adapter || "raw-sql"];
  }

  private core(
    input: string,
    settings?: RunQuerySettings | {}
  ): LinkedListInterface | null {
    // Load all settings
    const settingsClass = new Settings(settings);
    settingsClass.load();

    const tokens: Token[] = new Lexer(input).main();
    const parser = new Parser(tokens);

    return parser.main() || null;
  }
}
