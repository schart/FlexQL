import { FlexQL } from "./flexql";
import { flexQLResultInterface, runQuerySettingsInterface } from "./structures";

const flexQl = new FlexQL();
const runQuerySettings: runQuerySettingsInterface = {
  separators: { and: ";", or: "," },
  adapter: "raw-sql",
};

const generatedCode: flexQLResultInterface | null = flexQl.generate(
  "A > 5 , B > 5 ; C > 5 , D > 5 ; E > 5 , F > 5 ; G == 5",
  runQuerySettings
);

console.log("Output of flexQl", generatedCode);
