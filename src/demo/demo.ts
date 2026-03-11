import { FlexQL } from "../api";
import {
  runQuerySettingsInterface,
  flexQLResultInterface,
} from "../shared/interfaces/interface.adapter";

const flexQl = new FlexQL();
const runQuerySettings: runQuerySettingsInterface = {
  separators: { and: ";", or: "," },
  adapter: "sequelize",
};

const generatedCode: flexQLResultInterface | null = flexQl.generate(
  ` `,
  runQuerySettings,
);

console.log(generatedCode);
