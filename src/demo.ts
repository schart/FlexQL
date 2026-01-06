import { FlexQL } from "./flexql";
import { flexQLResultInterface, runQuerySettingsInterface } from "./structures";

const flexQl = new FlexQL();
const runQuerySettings: runQuerySettingsInterface = {
  separators: { and: ";", or: "," },
  adapter: "sql",
};

const generatedCode: flexQLResultInterface | null = flexQl.generate(
  `rating>4.5,rating<=5;views>0;comments>=100,test_bool==true`,
  runQuerySettings
);

console.log(generatedCode);
