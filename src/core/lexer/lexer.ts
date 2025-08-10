import { Operators, Separators, Token, TokenType } from "@/structures";
import { LEXER_ERROR } from "@/structures/constants/error.constant";

export class Lexer {
  public main(): Token[] {
    this.core();
    return this.tokens;
  }

  private core() {
    if (this.data.length <= 0) {
      this.tokens.push(this.generateToken(TokenType.EOF, "EOF"));
      return this.tokens;
    }

    while (this.pos < this.data.length) {
      this.processWhiteSpace();

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
          this.generateToken(TokenType.SEPARATOR, this.currentChar)
        );
      }

      this.forwardNextToken();
    }

    this.tokens.push(this.generateToken(TokenType.EOF, "EOF"));
  }

  private forwardNextToken() {
    if (this.pos < this.data.length) {
      this.pos++;
      this.currentChar = this.data[this.pos];
    }
  }

  private processOperators() {
    this.processIdentifier();

    let OP = this.currentChar;
    this.forwardNextToken();

    if (Operators.includes(OP) && ["="].includes(this.currentChar)) {
      OP += this.currentChar;
      this.forwardNextToken();
    } else if (["=", "!"].includes(OP) && !["="].includes(this.currentChar)) {
      throw new Error("Unexcepted Token " + this.currentChar);
    }

    this.tokens.push(this.generateToken(TokenType.OPERATOR, OP));
    this.processValue();
  }

  private processIdentifier() {
    let identifier: string = "";
    let virtualPos: number = this.pos - 1;

    while (virtualPos >= 0 && !Separators.includes(this.data[virtualPos])) {
      //
      const current: string = this.data[virtualPos];
      identifier += current;
      virtualPos--;
    }

    if (identifier.trim().length <= 0)
      throw new Error(LEXER_ERROR.IDENTIFIER_LEN);

    this.tokens.push(
      this.generateToken(
        TokenType.COLUMN,
        identifier.split("").reverse().join("")
      )
    );
    identifier = "";
  }

  private processValue() {
    let value = "";

    while (
      !Separators.includes(this.currentChar) &&
      this.pos < this.data.length
    ) {
      value += this.currentChar;
      this.forwardNextToken();
    }

    if (value.trim().length <= 0) throw new Error(LEXER_ERROR.VALUE_LEN);

    this.tokens.push(this.generateToken(TokenType.VALUE, value));
    value = "";
  }

  private processWhiteSpace() {
    if (this.currentChar == " ") {
      this.forwardNextToken();
    }
  }

  private generateToken(type: string, value: string | number): Token {
    const token: Token = {
      type: type,
      value: value,
    };
    return token;
  }

  private readonly data: string;
  private pos: number;
  private currentChar: string;
  private tokens: Token[];

  constructor(data: string) {
    this.pos = 0;
    this.data = data;
    this.currentChar = this.data[this.pos];
    this.tokens = [];
  }
}
