import { FlexQL } from "./flexql";
import { RunQuerySettings } from "./structures";

const flexQl = new FlexQL();
const runQuerySettings: RunQuerySettings = {
  separators: { and: ";", or: "!" },
  adapter: "raw-sql",
};

const generatedCode: string | null = flexQl.generate(
  "CategoryName==Beverages!age>10",
  runQuerySettings
);

console.log("Generated WH Conditions: ", generatedCode);
