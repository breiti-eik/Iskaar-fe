import action_en from "./en/action.json";
import phase_en from "./en/phase.json";
import action_de from "./de/action.json";
import phase_de from "./de/phase.json";

type Namespace = "action" | "phase";
type Lang = "en" | "de";

const resources = {
  en: {
    action: action_en,
    phase: phase_en,
  },
  de: {
    action: action_de,
    phase: phase_de,
  },
};

let currentLang: Lang = "de";

export function setLanguage(lang: Lang) {
  currentLang = lang;
}

export function t(namespace: Namespace, key: string): string {
  const value =
    resources[currentLang][namespace][
      key as keyof (typeof resources)["en"][typeof namespace]
    ];
  return value ?? `[missing:${namespace}.${key}]`;
}
