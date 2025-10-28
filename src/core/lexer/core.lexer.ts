import { LEXER_ERROR } from "@/structures/constants/constant.error";
import { Operators, Separators, tokenInterface, TokenType } from "@/structures";

export class Lexer {
  private pos: number = 0;
  private currentChar: string;
  private readonly data: string;
  private tokens: tokenInterface[] = [];

  constructor(data: string) {
    this.data = data;
    this.currentChar = this.data[this.pos];
  }

  public main(): tokenInterface[] {
    if (this.data.length <= 0) {
      this.tokens.push(
        this.generateToken({ type: TokenType.EOF, value: "EOF" })
      );
      return this.tokens;
    }

    while (this.pos < this.data.length) {
      this.forwardWhiteSpace();

      if (Operators.includes(this.currentChar)) {
        this.processOperators();
      }

      if (Separators.includes(this.currentChar)) {
        if (Separators.includes(this.data[this.pos - 1])) {
          throw new Error(LEXER_ERROR.TOO_MANY_SEPARATOR);
        }

        if (Separators.includes(this.data[this.data.length - 1])) {
          throw new Error(LEXER_ERROR.SEPARATOR_POSITION);
        }

        this.tokens.push(
          this.generateToken({
            type: TokenType.SEPARATOR,
            value: this.currentChar.trim(),
          })
        );
      }

      this.forwardNextToken();
    }

    this.tokens.push(this.generateToken({ type: TokenType.EOF, value: "EOF" }));
    return this.tokens;
  }

  private processOperators(): void {
    this.processIdentifier();

    let OP = this.currentChar;
    this.forwardNextToken();

    if (Operators.includes(OP) && ["="].includes(this.currentChar)) {
      OP += this.currentChar;
      this.forwardNextToken();
    } else if (["=", "!"].includes(OP) && !["="].includes(this.currentChar)) {
      throw new Error("Unexcepted Token " + this.currentChar);
    }

    this.tokens.push(
      this.generateToken({ type: TokenType.OPERATOR, value: OP.trim() })
    );
    this.processValue();
  }

  private processIdentifier(): void {
    let identifier: string = "";
    let virtualPos: number = this.pos - 1;

    while (virtualPos >= 0 && !Separators.includes(this.data[virtualPos])) {
      const current: string = this.data[virtualPos];
      identifier += current;
      virtualPos--;
    }

    if (identifier.trim().length <= 0)
      throw new Error(LEXER_ERROR.IDENTIFIER_LEN);

    this.tokens.push(
      this.generateToken({
        type: TokenType.COLUMN,
        value: identifier.split("").reverse().join("").trim(),
      })
    );

    identifier = "";
  }

  private processValue(): void {
    let value: number | string = "";
    let possibleDataType: "NUMBER" | "STRING" = "NUMBER";

    while (
      !Separators.includes(this.currentChar) &&
      this.pos < this.data.length
    ) {
      value += this.currentChar.trim();
      this.forwardNextToken();
    }

    const parseInt: number = Number.parseInt(value);
    if (!Number.isInteger(parseInt)) {
      possibleDataType = "STRING";
      value = value.replace(/^["']|["']$/g, ""); // Normalize  strings
    } else {
      value = parseInt;
    }

    if (!value) throw new Error(LEXER_ERROR.VALUE_LEN);
    this.tokens.push(
      this.generateToken({ type: TokenType[possibleDataType], value: value })
    );
    value = "";
  }

  private forwardWhiteSpace(): void {
    if (this.currentChar == " ") {
      this.forwardNextToken();
    }
  }

  private forwardNextToken(): void {
    if (this.pos < this.data.length) {
      this.pos++;
      this.currentChar = this.data[this.pos];
    }
  }

  private generateToken(token: tokenInterface): tokenInterface {
    return {
      type: token.type,
      value: token.value,
    };
  }
}
