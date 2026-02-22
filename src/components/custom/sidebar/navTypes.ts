import type { LucideIcon } from "lucide-react";

export interface NavItemConfig {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}
