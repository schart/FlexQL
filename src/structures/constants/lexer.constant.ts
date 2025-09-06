import { RunQuerySettings } from "../interfaces/adapter.interface";

export const Operators = ["<", ">", "=", "!"];
export const DefaultSeparators = { and: ";", or: "," };

let SeparatorRecord: Pick<RunQuerySettings, "separators"> = {};
let SeparatorValues: any = [];
export { SeparatorValues as Separators, SeparatorRecord };

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
