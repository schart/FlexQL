import {
  Separators,
  separatorRecord,
  DefaultSeparators,
  runQuerySettingsInterface,
} from "@/structures";

export class Settings {
  load() {
    this.setSeparators(); // Set separators as custom (optional) or default
  }

  setSeparators(): void {
    separatorRecord.separators = {
      ...DefaultSeparators,
      ...this.settings.separators,
    };

    // indef of separator : 0
    // indef of separator: 1
    Separators.push(Object.values(separatorRecord.separators)[0]);
    Separators.push(Object.values(separatorRecord.separators)[1]);
  }

  private readonly settings: runQuerySettingsInterface;
  constructor(settings?: runQuerySettingsInterface) {
    this.settings = settings || {};
  }
}
