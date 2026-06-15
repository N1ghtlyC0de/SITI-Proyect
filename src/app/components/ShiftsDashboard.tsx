import { useState, useEffect, useRef } from "react";
import { 
  Users, 
  ArrowLeft,
  Clock,
  Plus,
  Minus,
  CheckCircle2,
  Calendar as CalendarIcon,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  History
} from "lucide-react";
import { HeaderNav } from "./HeaderNav";
import { cn } from "../lib/utils";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "sonner";
import { PrimaryButton } from "./molecules/PrimaryButton";

interface ShiftsDashboardProps {
  onNavigate?: (id: string) => void;
}

export function ShiftsDashboard({ onNavigate }: ShiftsDashboardProps) {
  const [activeEmployee, setActiveEmployee] = useState<number>(1);
  const [employeeCount, setEmployeeCount] = useState<number>(1);
  const [employeeSlots, setEmployeeSlots] = useState<{ [key: number]: Set<number> }>({ 1: new Set() });
  const [savedData, setSavedData] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [isCounterMinimized, setIsCounterMinimized] = useState(false);
  const counterCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCounterMinimized(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const currentRef = counterCardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Sync active employee scroll in sidebar
  useEffect(() => {
    const activeEl = document.getElementById(`employee-list-item-${activeEmployee}`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeEmployee]);

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
      setEmployeeSlots(curr => ({ ...curr, [next]: new Set() }));
      return next;
    });
  };

  const handleDecrement = () => {
    if (employeeCount > 1) {
      setEmployeeCount(prev => {
        const next = prev - 1;
        const newSlots = { ...employeeSlots };
        delete newSlots[prev];
        setEmployeeSlots(newSlots);
        return next;
      });
      setActiveEmployee(prev => Math.min(prev, employeeCount - 1));
    }
  };

  const toggleSlot = (empIndex: number, slotId: number) => {
    setEmployeeSlots(prev => {
      const empSet = new Set(prev[empIndex] || new Set());
      if (empSet.has(slotId)) {
        empSet.delete(slotId);
      } else {
        empSet.add(slotId);
      }
      return { ...prev, [empIndex]: empSet };
    });
  };

  const handleSave = () => {
    let hasEmpty = false;
    const payload = [];

    for (let i = 1; i <= employeeCount; i++) {
      const slots = employeeSlots[i] || new Set();
      if (slots.size === 0) {
        hasEmpty = true;
      } else {
        payload.push({
          empleado_id: i, // Assuming index is ID for now
          horas_trabajadas: slots.size,
          franjas: Array.from(slots)
        });
      }
    }

    if (hasEmpty) {
      setAlertMessage("Completa la información de los turnos seleccionando al menos una franja horaria para cada empleado.");
      return;
    }

    // Include selectedDate in the payload
    const fullPayload = {
      date: selectedDate.toISOString(),
      shifts: payload
    };

    // Mock save: The payload array now contains auto-calculated horas_trabajadas
    console.log("Submitting payload:", fullPayload);
    setSavedData(true);
    toast.success("Turno guardado exitosamente");
    setTimeout(() => setSavedData(false), 3000);
  };

  const handleNewShift = () => {
    setEmployeeCount(1);
    setEmployeeSlots({ 1: new Set() });
    setActiveEmployee(1);
    setSelectedDate(new Date());
    toast.info("Formulario reiniciado");
  };

  const isValid = Array.from({ length: employeeCount }).every((_, i) => {
    const slots = employeeSlots[i + 1];
    return slots && slots.size > 0;
  });

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isFuture = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.getTime() > today.getTime() && !isToday(date);
  };

  const getShiftHeaderLabel = () => {
    if (isToday(selectedDate)) {
      return "Turno de hoy";
    } else if (isFuture(selectedDate)) {
      return "Turno programado";
    } else {
      return "Fecha del turno";
    }
  };

  const formatDateLabel = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <div className="flex min-h-screen h-auto lg:h-screen lg:overflow-hidden flex-col" style={{ backgroundColor: "#F4F4F2", width: "100%" }}>
      {/* Header */}
      <div className="sticky top-0 z-50 flex-shrink-0 flex items-center justify-between px-4 w-full shadow-md" style={{ backgroundColor: "#2F6B3E", height: "64px", color: "white" }}>
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0 pl-2">
          <h1 className="text-lg font-semibold tracking-tight truncate hidden sm:block">Registro de Turnos</h1>
        </div>
        
        {/* Center Section - Navigation */}
        <div className="hidden lg:flex justify-center shrink-0 mx-2">
          <HeaderNav active="shifts" onNavigate={onNavigate} />
        </div>

        {/* Right Section */}
        <div className="flex flex-1 justify-end gap-2 pr-2">
          <PrimaryButton
            onClick={() => onNavigate?.("shifts-history")}
            variant="header"
            icon={<History className="size-4" />}
            aria-label="Ir al historial de turnos"
          >
            <span>Historial de turnos</span>
          </PrimaryButton>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden pb-0 pt-0 lg:min-h-0">
        {/* Left Column (Master Panel & Today's Shift Card) */}
        <div className="w-full lg:w-1/3 flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-card lg:overflow-hidden p-4 space-y-4 lg:h-full lg:shrink-0 mb-6 lg:mb-0">
          <div ref={counterCardRef} className="rounded-card bg-card p-6 shadow-sm border border-border text-center shrink-0">
            <div className="flex justify-center mb-3">
              <div className="rounded-full bg-primary/10 p-3">
                <CalendarIcon className="size-6 text-primary" />
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-1">{getShiftHeaderLabel()}</h2>
            
            {/* Interactive DatePicker */}
            <div className="mb-6 flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center justify-between w-full max-w-[280px] gap-2 rounded-md border border-gray-300 bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    )}
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="size-4 text-muted-foreground" />
                      <span>{formatDateLabel(selectedDate)}</span>
                    </div>
                    <ChevronDown className="size-4 text-gray-500 ml-auto" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

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

          {/* Master Employee List Container with horizontal scroll on mobile, vertical on desktop */}
          <div className="flex flex-col space-y-2 lg:flex-1 lg:min-h-0 lg:overflow-hidden shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Empleados ({employeeCount})
            </p>
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto whitespace-nowrap lg:whitespace-normal gap-2 lg:gap-0 lg:space-y-1 pt-1 pb-3 lg:pt-0 lg:pb-0 lg:pr-1 lg:h-auto">
              {Array.from({ length: employeeCount }).map((_, i) => {
                const empIndex = i + 1;
                const selectedSlots = employeeSlots[empIndex] || new Set();
                const hoursWorked = selectedSlots.size;
                const isActive = activeEmployee === empIndex;

                return (
                  <button
                    key={empIndex}
                    id={`employee-list-item-${empIndex}`}
                    onClick={() => setActiveEmployee(empIndex)}
                    className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 lg:px-4 lg:py-2.5 text-left transition-colors border text-sm shrink-0 w-auto lg:w-full ${
                      isActive
                        ? "bg-primary/10 border-primary text-primary font-semibold"
                        : "bg-transparent border-transparent hover:bg-accent text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 lg:gap-3">
                      <Users className={`size-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <span>Empleado {empIndex}</span>
                    </div>
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium shrink-0 ${
                      hoursWorked > 0
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {hoursWorked}
                      <span className="lg:inline hidden">{hoursWorked === 1 ? " hora" : " horas"}</span>
                      <span className="lg:hidden">h</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (Detail Workspace) */}
        <div className="w-full lg:w-2/3 flex flex-col h-full lg:h-full lg:overflow-hidden p-6 justify-between space-y-6">
          {/* Active Employee Container (strictly layout constrained) */}
          <div className="flex flex-col bg-card rounded-card shadow-sm border border-border overflow-hidden lg:flex-1 lg:min-h-0 lg:max-h-[calc(100vh-18rem)]">
            {/* Stationary Header */}
            <div className="p-6 pb-4 border-b border-border shrink-0">
              <div className="flex flex-row justify-between items-center w-full mb-4">
                <div className="flex items-center gap-2">
                  <Users className="size-6 text-primary" />
                  <h3 className="text-xl font-semibold">Configuración de Horas: Empleado {activeEmployee}</h3>
                </div>

                {/* Desktop Linear Pagination (Hidden on mobile) */}
                <div className="hidden lg:flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveEmployee(prev => Math.max(1, prev - 1))}
                    disabled={activeEmployee === 1}
                    className="flex items-center justify-center rounded-md bg-green-800 text-white hover:bg-green-700 p-2 text-sm font-medium transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-100 transition-all active:scale-95 cursor-pointer"
                    aria-label="Anterior empleado"
                  >
                    <ChevronLeft className="size-4 stroke-[2.5]" />
                  </button>
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    Emp {activeEmployee} de {employeeCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveEmployee(prev => Math.min(employeeCount, prev + 1))}
                    disabled={activeEmployee === employeeCount}
                    className="flex items-center justify-center rounded-md bg-green-800 text-white hover:bg-green-700 p-2 text-sm font-medium transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-100 transition-all active:scale-95 cursor-pointer"
                    aria-label="Siguiente empleado"
                  >
                    <ChevronRight className="size-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              <div className="mb-2 bg-accent/40 rounded-lg p-3 flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                <span className="text-sm font-medium">
                  Horas trabajadas: <strong className="text-base text-primary">{(employeeSlots[activeEmployee] || new Set()).size}</strong>
                </span>
              </div>
            </div>

            {/* Static Grid Subtitle Header (outside scroll boundary) */}
            <div className="px-6 pt-4 pb-1 shrink-0">
              <p className="text-sm font-medium">Selecciona las franjas horarias trabajadas:</p>
            </div>

            {/* Timeframe Grid wrapped in its own overflow-y-auto container */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 mx-6 mb-4 content-start">
                {timeSlots.map((slot) => {
                  const selectedSlots = employeeSlots[activeEmployee] || new Set();
                  const isSelected = selectedSlots.has(slot.id);
                  return (
                    <button
                      key={slot.id}
                      onClick={() => toggleSlot(activeEmployee, slot.id)}
                      className={`
                        flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors
                        ${isSelected 
                          ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' 
                          : 'border-border bg-transparent text-muted-foreground hover:bg-accent'
                        }
                      `}
                    >
                      {slot.label}
                      {isSelected && <CheckCircle2 className="size-3.5 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stationary Navigation Controls - Mobile Only */}
          <div className="py-2 border-t border-border shrink-0 mt-2 lg:hidden">
            {/* Mobile Visual Progress Grid */}
            <div className="flex flex-col w-full">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">
                Seleccionar Empleado (Progreso)
              </p>
              <div className="flex flex-wrap gap-2 justify-center pb-2">
                {Array.from({ length: employeeCount }).map((_, i) => {
                  const empIndex = i + 1;
                  const selectedSlots = employeeSlots[empIndex] || new Set();
                  const hasHours = selectedSlots.size > 0;
                  const isActive = activeEmployee === empIndex;

                  return (
                    <button
                      key={empIndex}
                      type="button"
                      onClick={() => setActiveEmployee(empIndex)}
                      className={cn(
                        "py-2 px-3 text-sm font-semibold rounded-md border transition-all duration-150 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/50",
                        isActive
                          ? (hasHours
                              ? "bg-primary/95 text-primary-foreground border-primary ring-2 ring-primary/20"
                              : "bg-primary/10 border-2 border-primary text-primary")
                          : (hasHours
                              ? "bg-[#2F6B3E] text-white border-transparent hover:bg-[#23512e]"
                              : "bg-card text-muted-foreground border-border hover:bg-accent")
                      )}
                      aria-label={`Ver Empleado ${empIndex}`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      Emp {empIndex}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stationary Save Actions */}
          <div className="pt-4 border-t border-border space-y-3 shrink-0 mt-auto">
            <button
              onClick={handleSave}
              disabled={!isValid}
              className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 font-semibold shadow-md transition-all ${
                savedData 
                  ? 'bg-success text-success-foreground' 
                  : !isValid 
                    ? 'bg-primary/50 text-primary-foreground/50 cursor-not-allowed opacity-50' 
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

      {/* Minimized Floating Counter Pill for Mobile */}
      <div 
        className={`fixed right-4 top-20 z-40 bg-white shadow-lg rounded-full px-5 py-2.5 border border-border flex items-center gap-3 transition-all duration-300 lg:hidden ${
          isCounterMinimized 
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto" 
            : "-translate-y-12 opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium text-muted-foreground">Empleados:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={handleDecrement}
            disabled={employeeCount <= 1}
            className="size-7 flex items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
            type="button"
            aria-label="Disminuir empleados"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="font-bold tabular-nums text-sm w-4 text-center text-foreground">
            {employeeCount}
          </span>
          <button 
            onClick={handleIncrement}
            className="size-7 flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            type="button"
            aria-label="Aumentar empleados"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
