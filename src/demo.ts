import { FlexQL } from "./flexql";
import { flexQLResultInterface, runQuerySettingsInterface } from "./structures";

const flexQl = new FlexQL();
const runQuerySettings: runQuerySettingsInterface = {
  separators: { and: ";", or: "," },
  adapter: "raw-sql",
};

const generatedCode: flexQLResultInterface | null = flexQl.generate(
  "name == joe ; age >= 10 , tax > 10",
  runQuerySettings
);

console.log("Output of flexQl", generatedCode);
