import { adapterType, separatorsType } from "../types/type.adapter";

export interface separatorSettingsInterface {
  separators?: Record<"and" | "or", separatorsType>;
}

export interface protectedColumns {
  columnProtect?: {
    exclude?: string[];
    rules?: {
      [column: string]: string[];
    };
  };
}

export interface runQuerySettingsInterface
  extends separatorSettingsInterface, protectedColumns {
  adapter?: adapterType | "sql";
  /** Optional allow-list for columns accepted from the query string. */
  allowedColumns?: string[];
  maxDepth?: number;
}

export interface flexQLResultInterface<T = unknown> {
  type: adapterType;
  payload: {
    conditions: T;
    values?: unknown[];
  };
}
