import { ArrowRight, Bot, CheckCircle2, ChevronLeft, Gamepad2, Play, Sparkles, Star, Trophy, type LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

export const iconRegistry = {
  'arrow-right': ArrowRight, 'back': ChevronLeft, 'robot': Bot,
  'play': Play, 'star': Star, 'trophy': Trophy,
  'sparkles': Sparkles, 'gamepad': Gamepad2, 'success': CheckCircle2,
} satisfies Record<string, LucideIcon>;
export type IconName = keyof typeof iconRegistry;
export type DvIconProps = Omit<ComponentProps<LucideIcon>, 'name'> & { name: IconName };
export function DvIcon({ name, 'aria-label': ariaLabel, ...props }: DvIconProps) {
  const Glyph = iconRegistry[name];
  return <Glyph aria-label={ariaLabel} aria-hidden={ariaLabel ? undefined : true} {...props} />;
}
