import { adapterType, separatorsType } from "../types/type.adapter";

// Separator Options
export interface separatorSettingsInterface {
  separators?: Record<"and" | "or", separatorsType>; // (and= ?, or= ?) (it can be contained anything)
}

// For excluded columns
export interface protectedColumns {
  columnProtect?: {
    exclude?: string[]; // Names' of excluded columns ["password"]
    rules?: {
      // Rule to manage column access
      [column: string | number]: string[];
    };
    /*
      rules: {
        email: { allow: ["=="] },
        age: { allow: [">", "<", ">=", "<="] }
      }
    */
  };
}

// Query Adapter Options
export interface runQuerySettingsInterface
  extends separatorSettingsInterface, protectedColumns {
  adapter?: adapterType | "sql";
}

// Adapters' return structures
export interface flexQLResultInterface<T = any> {
  type: adapterType;
  payload: {
    conditions: any | any[];
    values?: any[];
  };
}
