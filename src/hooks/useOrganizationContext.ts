import { useAppSelector } from "@/features/hooks";

export function useOrganizationContext() {
  const selectedOrg = useAppSelector(
    (state) => state.organization.selectedOrganization,
  );

  return {
    organization: selectedOrg,
    orgId: selectedOrg?.id ?? null,
    orgCode: selectedOrg?.code ?? null,
  };
}
