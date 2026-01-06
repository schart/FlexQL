import { Lexer, Parser } from "@/core";
import { SQLAdapter } from "@/adapters";
import { Settings } from "@/settings/settings";
import {
  tokenInterface,
  flexQLResultInterface,
  runQuerySettingsInterface,
} from "@/structures";
import { adapterType } from "@/structures/types/type.adapter";
import { SequelizeAdapter } from "@/adapters/adapter.sequelize";
import { treeInterface } from "@/structures/interfaces/interface.tree";

export class FlexQL {
  public generate(
    input: string,
    settings?: runQuerySettingsInterface
  ): flexQLResultInterface {
    this.preSettings(settings);

    const tokens: tokenInterface[] | null = new Lexer(input).tokenizer(); // Separate to words
    const parsed: treeInterface | null = new Parser(tokens).parse(); // Generate an AST
    return this.executeAdapter(parsed, settings);
  }

  private executeAdapter(
    ast: treeInterface | null,
    { adapter }: Pick<runQuerySettingsInterface, "adapter"> = {}
  ): flexQLResultInterface {
    if (!ast) {
      return { type: adapter || "sql", payload: null };
    }

    const adapters: Record<adapterType, flexQLResultInterface<any>> = {
      sql: new SQLAdapter(ast).execute(),
      sequelize: new SequelizeAdapter(ast).generate(),
    };

    return adapters[adapter || "sql"];
  }

  private preSettings(settings?: runQuerySettingsInterface | {}) {
    const setting = new Settings(settings);
    setting.load();
  }
}
