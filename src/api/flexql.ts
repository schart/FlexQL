import { Lexer, Parser } from "@/core";
import { Settings } from "@/config/settings";
import { SQLAdapter } from "@/infrastructure/adapter.sql";
import { treeInterface } from "@/shared/interfaces/interface.tree";
import { tokenInterface } from "@/shared/interfaces/interface.lexer";
import { SequelizeAdapter } from "@/infrastructure/adapter.sequelize";
import {
  runQuerySettingsInterface,
  flexQLResultInterface,
} from "@/shared/interfaces/interface.adapter";
import { AstFlatter, flattedAst } from "@/core/core.flatter";
import { MongoAdapter } from "@/infrastructure/adapter.mongo";
import { ElasticsearchAdapter } from "@/infrastructure/adapter.elasticsearch";
import { TypeORMAdapter } from "@/infrastructure/adapter.typeorm";

export class FlexQL {
  public parse(
    input: string,
    settings?: runQuerySettingsInterface,
  ): flexQLResultInterface<unknown> {
    this.preSettings(settings);

    // Tokenize
    const tokens: tokenInterface[] | null = new Lexer(
      input,
      settings,
    ).tokenizer();

    // Generate an AST
    const parsed: treeInterface | null = new Parser(tokens, settings).parse();
    if (!parsed) return { type: "sql", payload: { conditions: null } };
    const flattedAst = new AstFlatter(parsed).main();
    return this.executeAdapter(flattedAst, settings);
  }

  private executeAdapter(
    ast: flattedAst[],
    { adapter }: Pick<runQuerySettingsInterface, "adapter"> = {},
  ): flexQLResultInterface<unknown> {
    // Only the requested adapter is generated: building every adapter makes a
    // query fail whenever any other adapter does not support one of its operators.
    switch (adapter || "sql") {
      case "sequelize":
        return new SequelizeAdapter(ast).generate();
      case "mongo":
        return new MongoAdapter(ast).generate();
      case "elasticsearch":
        return new ElasticsearchAdapter(ast).generate();
      case "typeorm":
        return new TypeORMAdapter(ast).generate();
      case "sql":
      default:
        return new SQLAdapter(ast).generate();
    }
  }

  private preSettings(settings?: runQuerySettingsInterface | {}) {
    const setting = new Settings(settings);
    setting.load();
  }
}
