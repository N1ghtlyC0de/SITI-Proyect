import { Calendar, ArrowLeft } from "lucide-react";

interface ShiftsHistoryProps {
  onBack?: () => void;
}

export function ShiftsHistory({ onBack }: ShiftsHistoryProps) {
  // Simple layout with a back button and a work-in-progress placeholder table
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F2]" style={{ width: "100%" }}>
      {/* Header */}
      <header className="bg-[#2F6B3E] text-white p-4 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 rounded-lg px-2 py-1 -ml-2 transition-colors hover:bg-white/10 focus:outline-none"
            aria-label="Volver al panel"
            type="button"
          >
            <ArrowLeft className="size-5" />
            <span className="text-sm font-medium">Volver</span>
          </button>
          <h1 className="text-xl font-bold">Historial de Turnos</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-6xl w-full mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full bg-green-100 p-2.5">
              <Calendar className="size-5 text-green-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Historial de registro de turnos</h2>
              <p className="text-sm text-gray-500">Visualiza el historial y los turnos futuros programados.</p>
            </div>
          </div>

          {/* Placeholder Table */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Empleados</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Horas</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr>
                  <td className="px-4 py-4 font-medium text-gray-900">Lunes, 15 de junio de 2026</td>
                  <td className="px-4 py-4 text-gray-600">1 empleado</td>
                  <td className="px-4 py-4 text-gray-600">8 horas</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Guardado
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-gray-900">Martes, 16 de junio de 2026</td>
                  <td className="px-4 py-4 text-gray-600">3 empleados</td>
                  <td className="px-4 py-4 text-gray-600">24 horas</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Programado
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400 font-medium">
                    Sección en desarrollo: Próximamente se integrará con la base de datos de turnos.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
