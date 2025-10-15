import { adapterType, separatorsType } from "../types/type.adapter";

export interface separatorSettingsInterface {
  separators?: Record<"and" | "or", separatorsType>; // (and= ?, or= ?) (it can be contained anything)
}

export interface runQuerySettingsInterface extends separatorSettingsInterface {
  adapter?: adapterType | "raw-sql";
}

// Adapters' return structures
export interface flexQLResultInterface<T = any> {
  type: adapterType;
  payload: T | null;
}
