import { LayoutDashboard, ScrollText, Building2 } from "lucide-react";
import type { NavSectionConfig } from "./navTypes";

export const USR_MAIN_SECTIONS: NavSectionConfig[] = [
  {
    title: "dashboard.sidebar.usr.category",
    items: [
      {
        to: "/usr",
        label: "dashboard.sidebar.usr.general",
        icon: LayoutDashboard,
        end: true,
      },
      {
        to: "/usr/certificates",
        label: "dashboard.sidebar.usr.certificates",
        icon: ScrollText,
      },
    ],
  },
];

export const USR_BOTTOM_SECTIONS: NavSectionConfig[] = [
  {
    title: "dashboard.sidebar.usr.settings",
    items: [
      {
        to: "/usr/organizations",
        label: "dashboard.sidebar.usr.organizations",
        icon: Building2,
      },
    ],
  },
];
