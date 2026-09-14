import {
  Wifi,
  Router,
  Network,
  Zap,
  Headphones,
  ShieldCheck,
  RadioTower,
  Sparkles,
  BadgeCheck,
  Signal,
  Globe,
  Server,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/content-types";

export const ICON_MAP: Record<IconName, LucideIcon> = {
  Wifi,
  Router,
  Network,
  Zap,
  Headphones,
  ShieldCheck,
  RadioTower,
  Sparkles,
  BadgeCheck,
  Signal,
  Globe,
  Server,
};

export function resolveIcon(name: string): LucideIcon {
  return (ICON_MAP as Record<string, LucideIcon>)[name] ?? Wifi;
}
