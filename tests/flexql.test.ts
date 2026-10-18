import { FlexQL } from "../src";

describe("FlexQL public API", () => {
  const query = "status==active;(age>=18,featured==true)";

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
});
