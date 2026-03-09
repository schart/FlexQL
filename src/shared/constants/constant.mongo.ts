import mongoose from "mongoose";

export const MONGO_OPERATORS: Record<string, string> = {
  // logic
  AND: "$and",
  OR: "$or",

  // comparisons
  ">": "$gt",
  "<": "$lt",
  "==": "$eq",
  ">=": "$gte",
  "<=": "$lte",
};
