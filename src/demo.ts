import { FlexQL } from "./flexql";
import { flexQLResultInterface, runQuerySettingsInterface } from "./structures";

const flexQl = new FlexQL();
const runQuerySettings: runQuerySettingsInterface = {
  separators: { and: ";", or: "," },
  adapter: "raw-sql",
};

const generatedCode: flexQLResultInterface | null = flexQl.generate(
  "A> 10 ; B> 10 ; C >10",
  runQuerySettings
);

console.log("Output of flexQl", generatedCode);
