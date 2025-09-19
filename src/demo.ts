import { FlexQL } from "./flexql";
import { flexQLResultInterface, runQuerySettingsInterface } from "./structures";

const flexQl = new FlexQL();
const runQuerySettings: runQuerySettingsInterface = {
  separators: { and: "&", or: "|" },
  adapter: "sequelize",
};

const generatedCode: flexQLResultInterface | null = flexQl.generate(
  "CategoryName==Beverages&age>=10",
  runQuerySettings
);

console.log("Output of flexQl", generatedCode);
