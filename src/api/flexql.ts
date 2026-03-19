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
  public parse(
    input: string,
    settings?: runQuerySettingsInterface,
  ): flexQLResultInterface {
    this.preSettings(settings);

    // Tokenize
    const tokens: tokenInterface[] | null = new Lexer(input).tokenizer();

    // Generate an AST
    const parsed: treeInterface | null = new Parser(tokens).parse();
    if (!parsed) return { type: "sql", payload: { conditions: null } };

    const flattedAst = new AstFlatter(parsed).main();
    return this.executeAdapter(flattedAst, settings);
  }

  private executeAdapter(
    ast: flattedAst[],
    { adapter }: Pick<runQuerySettingsInterface, "adapter"> = {},
  ): flexQLResultInterface {
    const adapters: Record<adapterType, flexQLResultInterface<any>> = {
      sql: new SQLAdapter(ast).generate(),
      sequelize: new SequelizeAdapter(ast).generate(),
    };

    return adapters[adapter || "sql"];
  }

  private preSettings(settings?: runQuerySettingsInterface | {}) {
    const setting = new Settings(settings);
    setting.load();
  }
}
