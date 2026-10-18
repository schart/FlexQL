import { Op } from "sequelize";
import { FlexQL } from "../src";

describe("FlexQL public API", () => {
  const query = "status==active;(age>=18,featured==true)";
  const adapters = [
    "sql",
    "sequelize",
    "mongo",
    "elasticsearch",
    "typeorm",
  ] as const;

  it("generates a parameterized SQL condition", () => {
    const result = new FlexQL().parse(query, { adapter: "sql" });

    expect(result.type).toBe("sql");
    expect(result.payload.conditions).toContain("status = ?");
    expect(result.payload.values).toEqual(["active", 18, true]);
  });

  it.each(["sequelize", "mongo", "elasticsearch", "typeorm"] as const)(
    "supports the %s adapter",
    (adapter) => {
      const result = new FlexQL().parse(query, { adapter });

      expect(result.type).toBe(adapter);
      expect(result.payload.conditions).toBeDefined();
    },
  );

  it("enforces the configured nesting depth", () => {
    expect(() =>
      new FlexQL().parse("(((status==active)))", {
        adapter: "sql",
        maxDepth: 2,
      }),
    ).toThrow("Maximum query depth of 2 exceeded.");
  });

  it("rejects SQL expressions disguised as column names", () => {
    expect(() =>
      new FlexQL().parse("1>0", { adapter: "sql" }),
    ).toThrow("Invalid column name");
    expect(() =>
      new FlexQL().parse("city==x,1>0", { adapter: "sql" }),
    ).toThrow("Invalid column name");
  });

  it("supports an explicit column allow-list", () => {
    expect(() =>
      new FlexQL().parse("email==x", {
        adapter: "typeorm",
        allowedColumns: ["city"],
      }),
    ).toThrow("Column is not allowed");
  });

  it.each(adapters)(
    "resolves a single-condition query in the %s adapter",
    (adapter) => {
      const result = new FlexQL().parse("status==active", { adapter });

      expect(result.type).toBe(adapter);
      expect(result.payload.conditions).toBeDefined();
    },
  );

  it("does not turn a single-condition query into an empty filter", () => {
    expect(new FlexQL().parse("status==active", { adapter: "sql" })).toEqual({
      type: "sql",
      payload: { conditions: "( status = ? )", values: ["active"] },
    });

    expect(new FlexQL().parse("status==active", { adapter: "mongo" })).toEqual({
      type: "mongo",
      payload: { conditions: { $and: [{ status: { $eq: "active" } }] } },
    });

    expect(
      new FlexQL().parse("status==active", { adapter: "elasticsearch" }),
    ).toEqual({
      type: "elasticsearch",
      payload: {
        conditions: { bool: { must: [{ term: { status: "active" } }] } },
      },
    });

    expect(new FlexQL().parse("status==active", { adapter: "typeorm" })).toEqual(
      {
        type: "typeorm",
        payload: {
          conditions: {
            where: "(`status` = :param0)",
            parameters: { param0: "active" },
          },
        },
      },
    );

    expect(
      new FlexQL().parse("status==active", { adapter: "sequelize" }),
    ).toEqual({
      type: "sequelize",
      payload: {
        conditions: { [Op.and]: [{ status: { [Op.eq]: "active" } }] },
      },
    });
  });

  it.each(adapters)("supports the != operator in the %s adapter", (adapter) => {
    const result = new FlexQL().parse("x==1;y!=2", { adapter });

    expect(result.payload.conditions).toBeDefined();
  });

  it("renders != as a parameterized SQL condition", () => {
    expect(new FlexQL().parse("x==1;y!=2", { adapter: "sql" })).toEqual({
      type: "sql",
      payload: { conditions: "( x = ? AND y != ? )", values: [1, 2] },
    });
  });

  it("does not resolve column rules from the prototype chain", () => {
    for (const column of ["__proto__", "constructor", "toString"]) {
      const result = new FlexQL().parse(`${column}==x`, {
        adapter: "sql",
        columnProtect: { rules: { age: [">"] } },
      });

      expect(result.payload.conditions).toBe(`( ${column} = ? )`);
    }
  });
});
