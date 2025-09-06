import {
  Separators,
  SeparatorRecord,
  RunQuerySettings,
  DefaultSeparators,
} from "@/structures";

export class Settings {
  load() {
    this.setSeparators();
  }

  setSeparators(): void {
    SeparatorRecord.separators = this.settings.separators || DefaultSeparators;

    Separators.push(Object.values(SeparatorRecord.separators)[0]); // ["?", "?"] indef of : 0
    Separators.push(Object.values(SeparatorRecord.separators)[1]); // ["?", "?"] indef of : 1
  }

  private readonly settings: RunQuerySettings;
  constructor(settings?: RunQuerySettings) {
    this.settings = settings || {};
  }
}
