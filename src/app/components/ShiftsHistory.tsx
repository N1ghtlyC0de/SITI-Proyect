import React, { useState, useEffect } from "react";
import { Calendar, ArrowLeft, ChevronDown, ChevronUp, Clock, RefreshCw } from "lucide-react";
import { getShifts, ApiShift } from "../services/fastapi";


interface ShiftsHistoryProps {
  onBack?: () => void;
}

const timeSlotsMap: { [key: number]: string } = {
  1: "08:00 - 09:00",
  2: "09:00 - 10:00",
  3: "10:00 - 11:00",
  4: "11:00 - 12:00",
  5: "12:00 - 13:00",
  6: "13:00 - 14:00",
  7: "14:00 - 15:00",
  8: "15:00 - 16:00",
  9: "16:00 - 17:00",
  10: "17:00 - 18:00",
  11: "18:00 - 19:00",
  12: "19:00 - 20:00",
};

interface GroupedShift {
  dateKey: string;
  formattedDate: string;
  shifts: ApiShift[];
  totalEmployees: number;
  totalHours: number;
  status: string;
}

export function ShiftsHistory({ onBack }: ShiftsHistoryProps) {
  const [shifts, setShifts] = useState<ApiShift[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDates, setExpandedDates] = useState<string[]>([]);

  const fetchShiftsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getShifts();
      setShifts(data);
    } catch (err: any) {
      console.error("Error fetching shifts:", err);
      setError(err?.message || "Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShiftsData();
  }, []);

  const toggleExpand = (dateKey: string) => {
    setExpandedDates((prev) =>
      prev.includes(dateKey)
        ? prev.filter((k) => k !== dateKey)
        : [...prev, dateKey]
    );
  };

  // Filter out validations (which have null/undefined empleado_id) and group by date
  const employeeShifts = shifts.filter(
    (s) => s.empleado_id !== null && s.empleado_id !== undefined
  );

  const groupedShiftsMap: { [key: string]: ApiShift[] } = {};
  employeeShifts.forEach((shift) => {
    if (!shift.date) return;
    // Extract date portion (YYYY-MM-DD)
    const dateKey = shift.date.split("T")[0];
    if (!groupedShiftsMap[dateKey]) {
      groupedShiftsMap[dateKey] = [];
    }
    groupedShiftsMap[dateKey].push(shift);
  });

  // Convert map to sorted array (most recent first)
  const groupedShifts: GroupedShift[] = Object.keys(groupedShiftsMap)
    .sort((a, b) => b.localeCompare(a))
    .map((dateKey) => {
      const dayShifts = groupedShiftsMap[dateKey];
      // Unique employee IDs
      const uniqueEmployees = new Set(dayShifts.map((s) => s.empleado_id));
      const totalEmployees = uniqueEmployees.size;

      // Sum of hours
      const totalHours = dayShifts.reduce(
        (sum, s) => sum + (s.horas_trabajadas || 0),
        0
      );

      // Local date parsing to avoid timezone shift
      const [year, month, day] = dateKey.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);
      const formattedDate = dateObj
        .toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
        .replace(/^\w/, (c) => c.toUpperCase());

      // Status determined by date comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isFutureDate = dateObj.getTime() > today.getTime();
      const status = isFutureDate ? "Programado" : "Guardado";

      return {
        dateKey,
        formattedDate,
        shifts: dayShifts.sort((a, b) => (a.empleado_id || 0) - (b.empleado_id || 0)),
        totalEmployees,
        totalHours,
        status,
      };
    });

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2.5">
                <Calendar className="size-5 text-green-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Historial de registro de turnos</h2>
                <p className="text-sm text-gray-500">Visualiza el historial y los turnos futuros programados.</p>
              </div>
            </div>
            <button
              onClick={fetchShiftsData}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 active:scale-95 disabled:opacity-50 transition-all cursor-pointer focus:outline-none"
              type="button"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Sincronizar</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="w-12 px-4 py-3"></th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Empleados</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Horas</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
                        <p className="text-sm">Cargando historial de turnos...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-red-500 font-medium">
                      <p className="text-sm">{error}</p>
                      <button
                        onClick={fetchShiftsData}
                        className="mt-3 px-4 py-2 bg-green-700 text-white rounded-lg text-xs hover:bg-green-800 transition-colors cursor-pointer font-semibold"
                        type="button"
                      >
                        Reintentar
                      </button>
                    </td>
                  </tr>
                ) : groupedShifts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400 font-medium">
                      No se encontraron registros de turnos guardados.
                    </td>
                  </tr>
                ) : (
                  groupedShifts.map((group) => {
                    const isExpanded = expandedDates.includes(group.dateKey);
                    return (
                      <React.Fragment key={group.dateKey}>
                        <tr
                          className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                          onClick={() => toggleExpand(group.dateKey)}
                        >
                          <td className="px-4 py-4 w-12 text-center">
                            <div className="p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
                              {isExpanded ? (
                                <ChevronUp className="size-4" />
                              ) : (
                                <ChevronDown className="size-4" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 font-medium text-gray-900">{group.formattedDate}</td>
                          <td className="px-4 py-4 text-gray-600">
                            {group.totalEmployees} {group.totalEmployees === 1 ? "empleado" : "empleados"}
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {group.totalHours} {group.totalHours === 1 ? "hora" : "horas"}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                group.status === "Guardado"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {group.status}
                            </span>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-gray-50/40">
                            <td colSpan={5} className="px-6 py-4">
                              <div className="bg-gray-50 border border-gray-150 rounded-lg p-4 shadow-xs">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5 pl-1">
                                  <Clock className="size-3.5 text-gray-400" />
                                  Detalle de franjas horarias por empleado
                                </h4>
                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-4 py-2.5 font-semibold text-gray-600 uppercase tracking-wider">
                                          Empleado
                                        </th>
                                        <th className="px-4 py-2.5 font-semibold text-gray-600 uppercase tracking-wider">
                                          Horas trabajadas
                                        </th>
                                        <th className="px-4 py-2.5 font-semibold text-gray-600 uppercase tracking-wider">
                                          Franjas horarias
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                      {group.shifts.map((empShift) => {
                                        const sortedFranjas = [...(empShift.franjas || [])].sort((a, b) => a - b);
                                        const franjasLabels = sortedFranjas
                                          .map((id) => timeSlotsMap[id])
                                          .filter(Boolean)
                                          .join(", ");
                                        return (
                                          <tr key={empShift.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                              Empleado {empShift.empleado_id}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 font-medium">
                                              {empShift.horas_trabajadas} {empShift.horas_trabajadas === 1 ? "hora" : "horas"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                              {franjasLabels || "Sin franjas registradas"}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

