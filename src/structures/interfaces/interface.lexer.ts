import { TokenType } from "../enums/enum.lexer";

export interface tokenInterface {
  type: TokenType;
  value: string;
}
