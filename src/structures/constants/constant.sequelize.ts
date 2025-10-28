import { Op } from "sequelize";

export const SEQUZELIZE_OPERATORS: Record<any, any> = {
  // Logic
  and: Op.and,
  or: Op.or,

  // comparisons
  ">": Op.gt,
  "<": Op.lt,
  "==": Op.eq,
  ">=": Op.gte,
  "<=": Op.lte,
};
