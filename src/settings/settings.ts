import {
  separatorRecord,
  DefaultSeparators,
  Separators,
} from "@/shared/constants";
import { runQuerySettingsInterface } from "@/shared/interfaces/interface.adapter";

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
    Separators.splice(0, Separators.length, ...Object.values(separatorRecord.separators));
  }

  private readonly settings: runQuerySettingsInterface;
  constructor(settings?: runQuerySettingsInterface) {
    this.settings = settings || {};
  }
}
