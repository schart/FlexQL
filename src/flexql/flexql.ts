import { Lexer, Parser } from "@/core";
import { SQLAdapter } from "@/adapters";
import { Settings } from "@/settings/settings";
import {
  tokenInterface,
  linkedListInterface,
  flexQLResultInterface,
  runQuerySettingsInterface,
} from "@/structures";

export class FlexQL {
  generate(
    input: string,
    settings?: runQuerySettingsInterface | {}
  ): flexQLResultInterface | null {
    if (!input) {
      return null;
    }
    // Load settings
    this.preSettings(settings);

    // Lexer/tokenizer
    const tokens: tokenInterface[] = this.tokenizer(input);

    // Parser
    const parsed: linkedListInterface | null = this.parse(tokens);

    return this.executeAdapter(parsed, settings);
  }

  private executeAdapter(
    ast: linkedListInterface | null,
    { adapter }: Pick<runQuerySettingsInterface, "adapter"> = {}
  ): flexQLResultInterface | null {
    if (!ast) {
      return null;
    }

    const adapters: Record<string, any> = {
      "raw-sql": new SQLAdapter(ast).execute(),
    };

    return adapters[adapter || "raw-sql"];
  }

  private preSettings(settings?: runQuerySettingsInterface | {}) {
    const setting = new Settings(settings);
    setting.load();
  }

  private tokenizer(input: string): tokenInterface[] {
    return new Lexer(input).main();
  }

  private parse(tokens: tokenInterface[]): linkedListInterface | null {
    const parser: Parser = new Parser(tokens);
    return parser.main() || null;
  }
}
