import { LayoutDashboard, ScrollText, Building2 } from "lucide-react";
import type { NavSectionConfig } from "./navTypes";

export const USR_MAIN_SECTIONS: NavSectionConfig[] = [
  {
    title: "Danh mục",
    items: [
      {
        to: "/usr",
        label: "Chung",
        icon: LayoutDashboard,
        end: true,
      },
      {
        to: "/usr/certificates",
        label: "Danh sách bằng cấp",
        icon: ScrollText,
      },
    ],
  },
];

export const USR_BOTTOM_SECTIONS: NavSectionConfig[] = [
  {
    title: "Cài đặt",
    items: [
      {
        to: "/usr/organizations",
        label: "Tổ chức",
        icon: Building2,
      },
    ],
  },
];
