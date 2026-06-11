import { ApiPostsPanel } from "../organisms/ApiPostsPanel";
import { DashboardLayout } from "../templates/DashboardLayout";

interface ApiIntegrationPageProps {
  onBack?: () => void;
}

export function ApiIntegrationPage({ onBack }: ApiIntegrationPageProps) {
  return (
    <DashboardLayout
      title="Panel de Integracion"
      description="Demostracion funcional de consumo REST usando GET y POST."
    >
      <div className="flex justify-start lg:col-span-2">
        <button type="button" className="btn-secondary" onClick={onBack} aria-label="Volver al inicio">
          Volver al inicio
        </button>
      </div>
      <ApiPostsPanel className="lg:col-span-2" />
      <aside
        className="rounded-card border border-border bg-card p-4 shadow-sm md:p-6"
        aria-labelledby="help-title"
      >
        <h2 id="help-title" className="text-base font-semibold text-foreground">
          Ayuda rapida
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>Usa el formulario para publicar un registro de ejemplo.</li>
          <li>Pulsa Actualizar para volver a consultar la API.</li>
          <li>Usa Deshacer para revertir la ultima publicacion local.</li>
          <li>Atajo: Ctrl+Enter envia el formulario rapidamente.</li>
        </ul>
      </aside>
    </DashboardLayout>
  );
}
