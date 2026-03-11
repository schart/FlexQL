import { Lexer, Parser } from "@/core";
import { Settings } from "@/config/settings";
import { adapterType } from "@/shared/types/type.adapter";
import { SQLAdapter } from "@/infrastructure/adapter.sql";
import { treeInterface } from "@/shared/interfaces/interface.tree";
import { tokenInterface } from "@/shared/interfaces/interface.lexer";
import { SequelizeAdapter } from "@/infrastructure/adapter.sequelize";
import {
  runQuerySettingsInterface,
  flexQLResultInterface,
} from "@/shared/interfaces/interface.adapter";
import { AstFlatter, flattedAst } from "@/core/core.flatter";

export class FlexQL {
  public generate(
    input: string,
    settings?: runQuerySettingsInterface,
  ): flexQLResultInterface {
    this.preSettings(settings);

    const tokens: tokenInterface[] | null = new Lexer(input).tokenizer(); // Separate to words
    const parsed: treeInterface | null = new Parser(tokens).parse(); // Generate an AST
    return this.executeAdapter(parsed, settings);
  }

  private executeAdapter(
    ast: treeInterface | null,
    { adapter }: Pick<runQuerySettingsInterface, "adapter"> = {},
  ): flexQLResultInterface {
    if (!ast) {
      return { type: adapter || "sql", payload: null };
    }

    // AST flatter
    const flattedAst = new AstFlatter(ast).main();
 
    const adapters: Record<adapterType, flexQLResultInterface<any>> = {
      sql: new SQLAdapter(flattedAst).generate(),
      sequelize: new SequelizeAdapter(ast).generate(),
    };

    return adapters[adapter || "sql"];
  }

  private preSettings(settings?: runQuerySettingsInterface | {}) {
    const setting = new Settings(settings);
    setting.load();
  }
}
