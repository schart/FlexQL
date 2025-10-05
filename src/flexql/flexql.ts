import { Lexer, Parser } from "@/core";
import { SQLAdapter } from "@/adapters";
import { Settings } from "@/settings/settings";
import {
  treeInterface,
  tokenInterface,
  flexQLResultInterface,
  runQuerySettingsInterface,
} from "@/structures";
import { adapterType } from "@/structures/types/type.adapter";
import { SequelizeAdapter } from "@/adapters/adapter.sequelize";

export class FlexQL {
  public generate(
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
    // console.log("Tokens: ", tokens)

    // Parser
    const parsed: treeInterface | null = this.parse(tokens);
    console.log("parsed: ", parsed);
    return this.executeAdapter(parsed, settings);
  }

  private executeAdapter(
    ast: treeInterface | null,
    { adapter }: Pick<runQuerySettingsInterface, "adapter"> = {}
  ): flexQLResultInterface | null {
    if (!ast) {
      return null;
    }

    const adapters: Record<adapterType, any> = {
      "raw-sql": new SQLAdapter(ast).execute(),
      sequelize: new SequelizeAdapter(ast).execute(),
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

  private parse(tokens: tokenInterface[]): treeInterface | null {
    const parser: Parser = new Parser(tokens);
    return parser.main() || null;
  }
}
