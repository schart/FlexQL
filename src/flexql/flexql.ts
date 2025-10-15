import { Lexer, Parser } from "@/core";
import { SQLAdapter } from "@/adapters";
import { Settings } from "@/settings/settings";
import { adapterType } from "@/structures/types/type.adapter";
import {
  tokenInterface,
  flexQLResultInterface,
  runQuerySettingsInterface,
} from "@/structures";
import { treeInterface } from "@/structures/interfaces/interface.tree";

export class FlexQL {
  public generate(
    input: string,
    settings?: runQuerySettingsInterface
  ): flexQLResultInterface | null {
    this.preSettings(settings);
    const tokens: tokenInterface[] | null = new Lexer(input).main();
    const parsed: treeInterface | null = new Parser(tokens).main();

    return this.executeAdapter(parsed, settings);
  }

  private executeAdapter(
    ast: treeInterface | null,
    { adapter }: Pick<runQuerySettingsInterface, "adapter"> = {}
  ): flexQLResultInterface | null {
    if (!ast) {
      return null;
    }

    const adapters: Record<adapterType, flexQLResultInterface<any>> = {
      "raw-sql": new SQLAdapter(ast).execute(),
      // sequelize: new SequelizeAdapter(ast).execute(),
    };

    return adapters[adapter || "raw-sql"];
  }

  private preSettings(settings?: runQuerySettingsInterface | {}) {
    const setting = new Settings(settings);
    setting.load();
  }
}
