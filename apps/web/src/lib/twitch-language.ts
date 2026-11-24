// The broadcaster languages Twitch lists lives under, as TypeType-Live accepts them.
export const TWITCH_LANGUAGES = [
  "AR",
  "ASL",
  "BG",
  "CA",
  "CS",
  "DA",
  "DE",
  "EL",
  "EN",
  "ES",
  "FI",
  "FR",
  "HI",
  "HU",
  "ID",
  "IT",
  "JA",
  "KO",
  "MS",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "RU",
  "SK",
  "SV",
  "TH",
  "TL",
  "TR",
  "UK",
  "VI",
  "ZH",
  "ZH_HK",
  "OTHER",
] as const;

export type TwitchLanguage = (typeof TWITCH_LANGUAGES)[number];

const known = new Set<string>(TWITCH_LANGUAGES);

// Keeps stored values the server still knows, once each, in list order.
export function sanitizeLanguages(value: unknown): TwitchLanguage[] {
  if (!Array.isArray(value)) return [];
  const chosen = new Set(value.filter((code): code is string => typeof code === "string"));
  return TWITCH_LANGUAGES.filter((code) => known.has(code) && chosen.has(code));
}

export function toggleLanguage(current: TwitchLanguage[], code: TwitchLanguage): TwitchLanguage[] {
  return current.includes(code)
    ? current.filter((entry) => entry !== code)
    : sanitizeLanguages([...current, code]);
}

// The value of the language query parameter; undefined means every language.
export function languageQuery(languages: readonly string[]): string | undefined {
  return languages.length > 0 ? languages.join(",").toLowerCase() : undefined;
}

// BCP 47 tag Intl knows for a Twitch code; OTHER has none.
function languageTag(code: TwitchLanguage): string | null {
  if (code === "OTHER") return null;
  if (code === "ASL") return "ase";
  return code.replace("_", "-");
}

export function languageLabel(
  code: TwitchLanguage,
  locale: string,
  otherLabel: string,
  displayNames?: Intl.DisplayNames,
): string {
  const tag = languageTag(code);
  if (!tag) return otherLabel;
  try {
    const names = displayNames ?? new Intl.DisplayNames([locale], { type: "language" });
    const name = names.of(tag);
    // Intl answers with the tag itself when it has no name, as for sign languages.
    return name && name !== tag ? name : code;
  } catch {
    return code;
  }
}
