import { AIService } from "@/ai/ai.service";
import { FlexQL } from "../api";
import {
  runQuerySettingsInterface,
  flexQLResultInterface,
} from "../shared/interfaces/interface.adapter";

const flexQl = new FlexQL();
const runQuerySettings: runQuerySettingsInterface = {
  separators: { and: ";", or: "," },
  adapter: "sql",
  columnProtect: {
    exclude: ["password"],
    rules: {},
  },
};
const input = `age>=30;username==heja,username==admin,country==NL;score>80,rank>=10;active==true,verified==true`;
const generatedCode: flexQLResultInterface | null = flexQl.parse(
  input,
  runQuerySettings,
);


// AI parser
new AIService(input).AIOrchestrator().then((res: any) => {
  console.log("AI ", JSON.parse(res));
});
