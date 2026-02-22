import AppSidebar from "@/components/custom/sidebar/AppSidebar";
import {
  USR_MAIN_SECTIONS,
  USR_BOTTOM_SECTIONS,
} from "@/components/custom/sidebar/usrNavItems";

/**
 * User dashboard sidebar.
 * Wraps AppSidebar with user-specific nav items.
 */
export default function Sidebar() {
  return (
    <AppSidebar
      mainSections={USR_MAIN_SECTIONS}
      bottomSections={USR_BOTTOM_SECTIONS}
    />
  );
}
