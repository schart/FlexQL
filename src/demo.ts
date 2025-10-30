import { FlexQL } from "./flexql";
import { flexQLResultInterface, runQuerySettingsInterface } from "./structures";

const flexQl = new FlexQL();
const runQuerySettings: runQuerySettingsInterface = {
  separators: { and: ";", or: "," },
  adapter: "sequelize",
};

const generatedCode: flexQLResultInterface | null = flexQl.generate(
  `username=="heja",country=="NL";score>90,rank>=5,level=="pro";created_at>="2025-01-01";updated_at<="2025-10-01",last_login>="2025-09-01";active==true,verified==true`,
  runQuerySettings
);

console.log(generatedCode);
