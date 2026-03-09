import { FlexQL } from "../api";
import { runQuerySettingsInterface, flexQLResultInterface } from "../shared/interfaces/interface.adapter";

const flexQl = new FlexQL();
const runQuerySettings: runQuerySettingsInterface = {
  separators: { and: ";", or: "," },
  adapter: "sql",
};

const generatedCode: flexQLResultInterface | null = flexQl.generate(
  `rating>4.5,rating<=5;views>0;comments>=100,test_bool==true`,
  runQuerySettings,
);

console.log(generatedCode);
