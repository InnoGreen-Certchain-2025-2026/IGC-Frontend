import {
  LayoutDashboard,
  Users,
  ScrollText,
  Settings,
  Info,
} from "lucide-react";
import type { NavSectionConfig } from "./navTypes";

/**
 * Returns org dashboard nav sections.
 * Needs orgCode to build absolute paths.
 */
export function getOrgNavSections(orgCode: string): NavSectionConfig[] {
  return [
    {
      title: "Quản lý",
      items: [
        {
          to: `/org/${orgCode}`,
          label: "Tổng quan",
          icon: LayoutDashboard,
          end: true,
        },
        {
          to: `/org/${orgCode}/info`,
          label: "Thông tin tổ chức",
          icon: Info,
        },
        {
          to: `/org/${orgCode}/members`,
          label: "Thành viên",
          icon: Users,
        },
        {
          to: `/org/${orgCode}/certificates`,
          label: "Chứng chỉ",
          icon: ScrollText,
        },
        {
          to: `/org/${orgCode}/settings`,
          label: "Cài đặt",
          icon: Settings,
        },
      ],
    },
  ];
}
