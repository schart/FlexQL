import { FlexQL } from "./flexql";
import { flexQLResultInterface, runQuerySettingsInterface } from "./structures";

const flexQl = new FlexQL();
const runQuerySettings: runQuerySettingsInterface = {
  separators: { and: ";", or: "," },
  adapter: "sequelize",
};

const generatedCode: flexQLResultInterface | null = flexQl.generate(
  `rating>4.5,rating<=5;views>0;comments>=100`,
  runQuerySettings
);

console.log(generatedCode);
