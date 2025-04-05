export const errorMessages: Record<string, string> = {
  OAuthSignin: "Feil ved pålogging.",
  OAuthCallback: "Feil ved kommunikasjon med innloggingstjenesten.",
  OAuthCreateAccount: "Kunne ikke opprette konto.",
  EmailCreateAccount: "Kunne ikke opprette konto med epost.",
  Callback: "Ugyldig tilbakekall fra innloggingstjenesten.",
  OAuthAccountNotLinked:
    "E-posten er allerede i bruk med en annen innloggingsmetode.",
  default: "Det oppstod en feil under innlogging.",
};
