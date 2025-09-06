export type AdapterType = "raw-sql" | "sequelize";

export interface SeparatorSettings {
  separators?: Record<"and" | "or", string>; // (and= ?, or= ?) (it can be contained anything)
}

export interface RunQuerySettings extends SeparatorSettings {
  adapter?: AdapterType | "raw-sql";
}
