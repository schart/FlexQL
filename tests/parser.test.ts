import { Parser } from "../src/core/core.parser";
import { Lexer } from "../src/core/core.lexer";

describe("Parser Tests", () => {
  it("Should parse OR/AND correctly", () => {
    const tokens = new Lexer("A > 5 , b > 2 ; c > 10").tokenizer();
    const parsedTree = new Parser(tokens).parse();

    expect(parsedTree).toEqual({
      logic: "AND",
      conditions: [
        {
          logic: "OR",
          conditions: [
            { column: "A", op: ">", value: 5 },
            { column: "b", op: ">", value: 2 },
          ],
        },
        { column: "c", op: ">", value: 10 },
      ],
    });
  });

  it("Should parse nested parenthesized conditions", () => {
    const tokens = new Lexer("A==1;(B==2,C==3)").tokenizer();
    const parsedTree = new Parser(tokens).parse();

    expect(parsedTree).toEqual({
      logic: "AND",
      conditions: [
        { column: "A", op: "==", value: 1 },
        {
          logic: "OR",
          conditions: [
            { column: "B", op: "==", value: 2 },
            { column: "C", op: "==", value: 3 },
          ],
        },
      ],
    });
  });

  it("Should reject queries deeper than the configured limit", () => {
    const tokens = new Lexer("(((A==1)").tokenizer();

    expect(() => new Parser(tokens, { maxDepth: 2 }).parse()).toThrow(
      "Maximum query depth of 2 exceeded.",
    );
  });

  it("Should wrap a single condition in a logical group", () => {
    const tokens = new Lexer("A==1").tokenizer();
    const parsedTree = new Parser(tokens).parse();

    expect(parsedTree).toEqual({
      logic: "AND",
      conditions: [{ column: "A", op: "==", value: 1 }],
    });
  });

  it("Should ignore inherited properties when resolving column rules", () => {
    const settings = { columnProtect: { rules: { age: [">"] } } };

    for (const column of ["__proto__", "constructor", "toString"]) {
      const tokens = new Lexer(`${column}==1`).tokenizer();

      expect(new Parser(tokens, settings).parse()).toEqual({
        logic: "AND",
        conditions: [{ column, op: "==", value: 1 }],
      });
    }
  });

  it("Should still enforce own column rules", () => {
    const tokens = new Lexer("age>18").tokenizer();

    expect(() =>
      new Parser(tokens, {
        columnProtect: { rules: { age: ["=="] } },
      }).parse(),
    ).toThrow("Operator '>' is not allowed for column 'age'");
  });
});
