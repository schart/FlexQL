export type AdapterType = "raw-sql" | "sequelize";

export interface RunQueryOptions {
  adapter?: AdapterType;
}
