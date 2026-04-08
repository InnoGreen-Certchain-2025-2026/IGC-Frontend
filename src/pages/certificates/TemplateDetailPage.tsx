import { Navigate, useParams } from "react-router";

export default function TemplateDetailPage() {
  const { templateId, orgCode } = useParams<{
    templateId: string;
    orgCode: string;
  }>();

  if (!templateId) {
    return <Navigate to={`/org/${orgCode}/certificates/templates`} replace />;
  }

  return (
    <Navigate
      to={`/org/${orgCode}/certificates/template-editor/${templateId}`}
      replace
    />
  );
}
