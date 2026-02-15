/**
 * Tamaños estandarizados de iconos para consistencia visual
 * Usar estas constantes en lugar de hardcodear tamaños
 */

export const ICON_SIZES = {
    xs: "w-4 h-4", // 16px - Inputs, badges, alerts
    sm: "w-5 h-5", // 20px - Navigation, info items, contact
    md: "w-6 h-6", // 24px - Section headers, CTAs
    lg: "w-7 h-7", // 28px - Service cards, features
    xl: "w-8 h-8", // 32px - WhatsApp float, hero icons
    "2xl": "w-10 h-10", // 40px - Icon containers
} as const;

export type IconSize = keyof typeof ICON_SIZES;
