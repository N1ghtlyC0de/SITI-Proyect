import { useState } from "react";
import { 
  Users, 
  ArrowLeft,
  Clock,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  LogOut,
  X
} from "lucide-react";
import { BottomNav } from "./BottomNav";

interface ShiftsDashboardProps {
  onNavigate?: (id: string) => void;
}

export function ShiftsDashboard({ onNavigate }: ShiftsDashboardProps) {
  const [employeeCount, setEmployeeCount] = useState<number>(1);
  const [savedData, setSavedData] = useState<boolean>(false);

  // Store number of hours first, then time slots.
  // We'll store hours per employee in a separate state, and slots in another.
  const [employeeHours, setEmployeeHours] = useState<{ [key: number]: number }>({ 1: 0 });
  const [employeeSlots, setEmployeeSlots] = useState<{ [key: number]: Set<number> }>({ 1: new Set() });

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const timeSlots = [
    { id: 1, label: "08:00 - 09:00" },
    { id: 2, label: "09:00 - 10:00" },
    { id: 3, label: "10:00 - 11:00" },
    { id: 4, label: "11:00 - 12:00" },
    { id: 5, label: "12:00 - 13:00" },
    { id: 6, label: "13:00 - 14:00" },
    { id: 7, label: "14:00 - 15:00" },
    { id: 8, label: "15:00 - 16:00" },
    { id: 9, label: "16:00 - 17:00" },
    { id: 10, label: "17:00 - 18:00" },
    { id: 11, label: "18:00 - 19:00" },
    { id: 12, label: "19:00 - 20:00" },
  ];

  const handleIncrement = () => {
    setEmployeeCount(prev => {
      const next = prev + 1;
      setEmployeeHours(curr => ({ ...curr, [next]: 0 }));
      setEmployeeSlots(curr => ({ ...curr, [next]: new Set() }));
      return next;
    });
  };

  const handleDecrement = () => {
    if (employeeCount > 1) {
      setEmployeeCount(prev => {
        const next = prev - 1;
        const newHours = { ...employeeHours };
        const newSlots = { ...employeeSlots };
        delete newHours[prev];
        delete newSlots[prev];
        setEmployeeHours(newHours);
        setEmployeeSlots(newSlots);
        return next;
      });
    }
  };

  const updateHours = (empIndex: number, delta: number) => {
    setEmployeeHours(prev => ({
      ...prev,
      [empIndex]: Math.max(0, (prev[empIndex] || 0) + delta)
    }));
  };

  const toggleSlot = (empIndex: number, slotId: number) => {
    setEmployeeSlots(prev => {
      const empSet = new Set(prev[empIndex] || new Set());
      const hoursWorked = employeeHours[empIndex] || 0;

      if (empSet.has(slotId)) {
        empSet.delete(slotId);
      } else {
        if (empSet.size >= hoursWorked) {
          setAlertMessage("El número de horas registradas es menor, valida las franjas trabajadas");
          return prev;
        }
        empSet.add(slotId);
      }
      return { ...prev, [empIndex]: empSet };
    });
  };

  const handleSave = () => {
    let hasEmpty = false;
    for (let i = 1; i <= employeeCount; i++) {
      const hoursWorked = employeeHours[i] || 0;
      const slots = employeeSlots[i] || new Set();
      
      if (hoursWorked === 0 || slots.size === 0) {
        hasEmpty = true;
      }

      if (hoursWorked > 0 && slots.size < hoursWorked) {
        setAlertMessage("Te falta registrar alguna franja horaria");
        return;
      }
      if (slots.size > hoursWorked) {
        setAlertMessage("El número de horas registradas es menor, valida las franjas trabajadas");
        return;
      }
    }

    if (hasEmpty) {
      setAlertMessage("Completa la información de los turnos");
      return;
    }

    // Mock save
    setSavedData(true);
    setTimeout(() => setSavedData(false), 3000);
  };

  const handleNewShift = () => {
    onNavigate?.("home");
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "#F4F4F2", width: "100%" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 flex-shrink-0 flex items-center justify-between p-4" style={{ backgroundColor: "#2F6B3E", height: "52px", color: "white" }}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate?.("home")}
            className="rounded-full p-1 transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-lg font-semibold tracking-tight">Registro de Turnos</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-6 pt-14">
        <div className="mx-auto w-full max-w-6xl space-y-6 p-4">
          
          <div className="rounded-card bg-card p-6 shadow-sm border border-border text-center">
            <div className="flex justify-center mb-3">
              <div className="rounded-full bg-primary/10 p-3">
                <Calendar className="size-6 text-primary" />
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-1">Turno de hoy</h2>
            <p className="text-sm text-muted-foreground mb-6">Martes, 28 de abril de 2026</p>

            <div className="space-y-4">
              <p className="text-sm font-medium">¿Cuántos empleados trabajaron hoy?</p>
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={handleDecrement}
                  disabled={employeeCount <= 1}
                  className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border disabled:opacity-50"
                >
                  <Minus className="size-5" />
                </button>
                
                <span className="text-2xl font-bold tabular-nums w-12 text-center">
                  {employeeCount}
                </span>
                
                <button 
                  onClick={handleIncrement}
                  className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Plus className="size-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {Array.from({ length: employeeCount }).map((_, i) => {
              const empIndex = i + 1;
              const hoursWorked = employeeHours[empIndex] || 0;
              const selectedSlots = employeeSlots[empIndex] || new Set();

              return (
                <div key={empIndex} className="rounded-card bg-card p-4 shadow-sm border border-border animate-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="size-5 text-primary" />
                      <h3 className="font-semibold">Empleado {empIndex}</h3>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Horas trabajadas:</p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateHours(empIndex, -1)}
                        className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="font-bold tabular-nums w-8 text-center">{hoursWorked}</span>
                      <button 
                        onClick={() => updateHours(empIndex, 1)}
                        className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-medium mb-2">Selecciona las franjas horarias:</p>
                  
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 lg:grid-cols-3">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedSlots.has(slot.id);
                      return (
                        <button
                          key={slot.id}
                          onClick={() => toggleSlot(empIndex, slot.id)}
                          className={`
                            flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-colors
                            ${isSelected 
                              ? 'border-primary bg-primary/5 text-primary' 
                              : 'border-border bg-transparent text-muted-foreground hover:bg-accent'
                            }
                          `}
                        >
                          {slot.label}
                          {isSelected && <CheckCircle2 className="size-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={handleSave}
              className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 font-semibold shadow-md transition-all ${
                savedData 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
              }`}
              style={{ minHeight: 56 }}
            >
              {savedData ? (
                <>
                  <CheckCircle2 className="size-5" />
                  Turnos guardados exitosamente
                </>
              ) : (
                "Guardar registro de turnos"
              )}
            </button>

            <button
              onClick={handleNewShift}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-4 font-semibold text-foreground shadow-sm transition-all hover:bg-accent active:scale-95"
              style={{ minHeight: 56 }}
            >
              <LogOut className="size-5" />
              Nuevo turno
            </button>
          </div>
          
        </div>
      </div>
      
      <BottomNav active="shifts" onNavigate={onNavigate} />

      {alertMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-card bg-card p-6 shadow-lg animate-in zoom-in-95 duration-200 text-center">
            <button
              onClick={() => setAlertMessage(null)}
              className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-muted"
            >
              <X className="size-5" />
            </button>
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <Clock className="size-6 text-destructive" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Atención</h3>
            <p className="text-sm text-muted-foreground">{alertMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
