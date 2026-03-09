import { Parser } from "../src/core/parser/core.parser";
import { Lexer } from "../src/core/lexer/core.lexer";

describe("Parser Tests", () => {
  it("Should parse OR/AND correctly", () => {
    const tokens = new Lexer("A > 5 , b > 2 ; c > 10").main();
    const parsedTree = new Parser(tokens).main();
    console.log("parsed tree", parsedTree);

    expect(parsedTree).toEqual({
      logic: "AND",
      conditions: [
        {
          logic: "OR",
          conditions: [
            { column: "A", op: ">", value: "5" },
            { column: "B", op: ">", value: "2" },
          ],
        },
        { column: "C", op: ">", value: "10" },
      ],
    });
  });
});
