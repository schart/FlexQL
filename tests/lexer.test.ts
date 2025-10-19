import { Lexer } from "../src/core/lexer/core.lexer";

describe("Lexer Tests", () => {
  it("Should lexer String/Number correctly", () => {
    const lexer = new Lexer("A > 5 , b > 2 ; c > 10");
    const tokens = lexer.main();

    expect(tokens).toEqual([
      { type: "IDENTIFIER", value: "A" },
      { type: "OPERATOR", value: ">" },
      { type: "NUMBER", value: 5 },
      { type: "SEPARATOR", value: "," },
      { type: "IDENTIFIER", value: "b" },
      { type: "OPERATOR", value: ">" },
      { type: "NUMBER", value: 2 },
      { type: "SEPARATOR", value: ";" },
      { type: "IDENTIFIER", value: "c" },
      { type: "OPERATOR", value: ">" },
      { type: "NUMBER", value: 10 },
    ]);
  });
});
