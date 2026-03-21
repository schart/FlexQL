export const LEXER_ERROR = {
  IDENTIFIER_LEN: "Column name must be at least one character.",
  VALUE_LEN: "Value must be at least one character.",
  TOO_MANY_SEPARATOR: "Too many separators.",
  SEPARATOR_POSITION: "Separator must bind two queries.",
  PROTECTED_COLUMN_ACCESS: "Access to protected column is not allowed.",
  RULE_VIOLATION: (column: string, operator: string, allowed: string[]) =>
    `Operator '${operator}' is not allowed for column '${column}'. Allowed: ${allowed.join(", ")}.`,
};

export const PARSER_ERROR = {
  UNEXPECTED_COLUMN: (type: string) => `Unexpected column token: '${type}'.`,
  UNEXPECTED_OPERATOR: (type: string) => `Unexpected operator token: '${type}'.`,
  UNEXPECTED_VALUE: (type: string) => `Unexpected value token: '${type}'.`,
};

export const GENERAL_ERROR = {
  UNEXPECTED_TOKEN: "Unexpected token.",
};