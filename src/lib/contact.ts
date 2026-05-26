export const WHATSAPP_NUMBER = "5585989761076";
export const CONTACT_EMAIL = "contato@touchmidia.com";
export const SITE_URL = "https://touchmidia.com";

export function buildWhatsappUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function buildMailtoUrl(subject: string, body?: string): string {
  const params = new URLSearchParams();
  params.set("subject", subject);
  if (body) params.set("body", body);
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

export const WHATSAPP_MESSAGES = {
  generic: "Olá! Vi o site da TOUCH MIDIA e quero saber mais.",
  ctaFinal: "Olá! Quero contratar a TOUCH MIDIA para um evento.",
  comoFunciona: "Olá! Quero entender melhor como a TOUCH MIDIA funciona.",
  customGame:
    "Olá! Quero conversar sobre um jogo personalizado, fora do catálogo da TOUCH MIDIA.",
  forGame: (gameName: string) =>
    `Olá! Tenho interesse em ${gameName} da TOUCH MIDIA.`,
} as const;
