import { useParams } from "react-router";
import AppSidebar from "@/components/custom/sidebar/AppSidebar";
import { getOrgNavSections } from "@/components/custom/sidebar/orgNavItems";

/**
 * Organization dashboard sidebar.
 * Wraps AppSidebar with org-specific nav items.
 */
export default function OrgSidebar() {
  const { orgCode } = useParams<{ orgCode: string }>();
  const mainSections = getOrgNavSections(orgCode ?? "");

  return <AppSidebar mainSections={mainSections} />;
}
