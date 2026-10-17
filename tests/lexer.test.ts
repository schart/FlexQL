import { Lexer } from "../src/core/core.lexer";

describe("Lexer Tests", () => {
  it("Should lexer String/Number correctly", () => {
    const lexer = new Lexer("A > 5 , b > 2 ; c > 10");
    const tokens = lexer.tokenizer();

    expect(tokens).toEqual([
      { type: "COLUMN", value: "A" },
      { type: "OPERATOR", value: ">" },
      { type: "NUMBER", value: 5 },
      { type: "SEPARATOR", value: "," },
      { type: "COLUMN", value: "b" },
      { type: "OPERATOR", value: ">" },
      { type: "NUMBER", value: 2 },
      { type: "SEPARATOR", value: ";" },
      { type: "COLUMN", value: "c" },
      { type: "OPERATOR", value: ">" },
      { type: "NUMBER", value: 10 },
      { type: "EOF", value: "EOF" },
    ]);
  });
});
