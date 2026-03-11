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
  `age>=30;username==heja,username==admin,country==NL;score>80,rank>=10;active==true,verified==true`,
  runQuerySettings,
);

console.log(generatedCode);
