import { TokenType } from "../enums/enum.lexer";

export interface tokenInterface<T = number | string> {
  type: TokenType;
  value: T extends number ? any : string;
}
