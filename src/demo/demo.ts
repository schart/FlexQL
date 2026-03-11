import { FlexQL } from "../api";
import {
  runQuerySettingsInterface,
  flexQLResultInterface,
} from "../shared/interfaces/interface.adapter";

const flexQl = new FlexQL();
const runQuerySettings: runQuerySettingsInterface = {
  separators: { and: ";", or: "," },
  adapter: "sql",
};

const generatedCode: flexQLResultInterface | null = flexQl.generate(
  `age>=21;country==USA,country==Canada,premium_user==true;score>50,status==active`,
  runQuerySettings,
);

console.log(generatedCode);
