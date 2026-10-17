import { runQuerySettingsInterface } from "../interfaces/interface.adapter";
import { separatorsType } from "../types/type.adapter";

export const Operators = ["<", ">", "=", "!"];
export const DefaultSeparators: Record<"and" | "or", separatorsType> = {
  and: ";",
  or: ",",
};

const separatorRecord: Pick<runQuerySettingsInterface, "separators"> = {
  separators: DefaultSeparators,
};
let separatorValues: string[] = Object.values(DefaultSeparators);

export { separatorValues as Separators, separatorRecord };

// export let {
//   separators: separatorsSettings,
// }: Pick<RunQuerySettings, "separators"> = initSeparatorsSettings;

// separatorsSettings =
//   separatorsSettings == null
//     ? {
//         and: ";",
//         or: ",",
//       }
//     : separatorsSettings;

// let SeparatorValues: string[] = Object.values(separatorsSettings);
// SeparatorValues = SeparatorValues.length == 0 ? [";", ","] : SeparatorValues;

// export { SeparatorValues as Separators };
