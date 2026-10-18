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

  it("Should lexer boolean literals without inverting false", () => {
    const tokens = new Lexer("active==true;inactive==false").tokenizer();

    expect(tokens).toEqual([
      { type: "COLUMN", value: "active" },
      { type: "OPERATOR", value: "==" },
      { type: "BOOLEAN", value: true },
      { type: "SEPARATOR", value: ";" },
      { type: "COLUMN", value: "inactive" },
      { type: "OPERATOR", value: "==" },
      { type: "BOOLEAN", value: false },
      { type: "EOF", value: "EOF" },
    ]);
  });

  it("Should lexer decimal numbers without truncation", () => {
    const tokens = new Lexer("price>=4.5;views>100").tokenizer();

    expect(tokens[2]).toEqual({ type: "NUMBER", value: 4.5 });
    expect(tokens[6]).toEqual({ type: "NUMBER", value: 100 });
  });

  it("Should lexer non-numeric values as strings", () => {
    const tokens = new Lexer("code==12abc").tokenizer();

    expect(tokens[2]).toEqual({ type: "STRING", value: "12abc" });
  });
});
