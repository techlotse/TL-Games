/**
 * German strings.
 *
 * IMPORTANT: a 3-year-old cannot read. All in-game guidance is visual
 * (arrows, glowing targets, motion). These strings are short labels,
 * mostly for the accompanying parent.
 */
export const de = {
  appName: 'Spielgarten',
  tagline: 'Ruhig spielen und entdecken',

  // Navigation / shared actions
  home: 'Zuhause',
  back: 'Zurück',
  again: 'Nochmal',
  done: 'Fertig',
  soon: 'Bald',
  parents: 'Eltern',
  close: 'Schließen',

  // Game names
  gameGarage: 'Werkstatt',
  gameGarden: 'Blumengarten',
  gameShapes: 'Formen',
  gameRace: 'Rennen',

  // Parent gate
  parentGateTitle: 'Für Eltern',
  parentGateHint: 'Kreis gedrückt halten',
  parentGateHolding: 'Weiter halten …',

  // Parent area
  parentTitle: 'Eltern-Bereich',
  appearance: 'Darstellung',
  themeLabel: 'Heller oder dunkler Modus',
  themeLight: 'Hell',
  themeDark: 'Dunkel',
  highContrast: 'Mehr Kontrast',
  highContrastHint: 'Kräftigere Farben und Ränder',
  reducedMotion: 'Weniger Bewegung',
  reducedMotionHint: 'Sanftere, ruhigere Übergänge',
  progressTitle: 'Fortschritt',
  progressHint: 'Gespielte Runden pro Spiel',
  resetProgress: 'Fortschritt zurücksetzen',
  resetConfirmTitle: 'Fortschritt zurücksetzen?',
  resetConfirmYes: 'Ja, zurücksetzen',
  resetConfirmNo: 'Abbrechen',

  // About
  aboutTitle: 'Über Spielgarten',
  aboutBody:
    'Spielgarten ist eine ruhige, Montessori-inspirierte Spielwelt für Kinder ab 3 Jahren. Keine Werbung, kein Konto, keine Datenerfassung. Alles funktioniert auch ohne Internet.',
  aboutVersion: 'Version',
} as const

export type Dict = typeof de
