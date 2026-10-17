import { TokenType } from "../enums/enum.lexer";

export interface tokenInterface<T = number | string | boolean> {
  type: TokenType;
  value: T;
}
