import { FlexQL } from "./flexql";
import { flexQLResultInterface, runQuerySettingsInterface } from "./structures";

const flexQl = new FlexQL();
const runQuerySettings: runQuerySettingsInterface = {
  separators: { and: ";", or: "," },
  adapter: "raw-sql",
};

const generatedCode: flexQLResultInterface | null = flexQl.generate(
  `A == 5 , B > 5 ; C > 5 ; E == "heja"`,
  runQuerySettings
);

console.log(generatedCode);
