import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";

export default function AlertasPage() {
  const [alertas, setAlertas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    api.get("/alertas")
      .then((res) => {
        setAlertas(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar las alertas.");
        setLoading(false);
      });
  }, []);

  const getStyle = (prioridad) => {
    if (prioridad === "ALTA") return "bg-red-100 text-red-700";
    if (prioridad === "MEDIA") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getSolucion = (alerta) => {
    if (!alerta) return "";
    
    const tipo = alerta.tipo?.toUpperCase() || "";
    const desc = alerta.descripcion?.toLowerCase() || "";

    if (tipo.includes("MANTENIMIENTO") || desc.includes("mantenimiento")) {
      return "1. Ve a la sección de Mantenimientos.\n2. Busca el equipo mencionado.\n3. Programa un nuevo servicio o marca el pendiente como 'Realizado'.\n4. Si el cliente lo requiere, genera una Orden de Trabajo.";
    }
    if (tipo.includes("EQUIPO") || desc.includes("vencimiento") || desc.includes("extintor")) {
      return "1. Coordina una inspección física del equipo.\n2. Ve a la sección de Equipos.\n3. Busca el código afectado y edítalo.\n4. Actualiza la 'Fecha de vencimiento' con la nueva vigencia tras el servicio.";
    }
    if (tipo.includes("ORDEN") || desc.includes("orden")) {
      return "1. Ve a la sección de Órdenes de trabajo.\n2. Filtra por estado 'PENDIENTE'.\n3. Contacta al técnico asignado para conocer el motivo del retraso o reasigna la orden si es urgente.";
    }
    
    return "Revisa los detalles del registro afectado en el sistema y comunícate con el personal correspondiente para resolver la incidencia.";
  };

  return (
    <MainLayout
      title="Alertas y vencimientos"
      subtitle="Equipos, mantenimientos y órdenes que requieren atención"
    >
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card title="Alertas activas" value={alertas.length} />
        <Card title="Prioridad alta" value={alertas.filter(a => a.prioridad === "ALTA").length} danger />
        <Card title="Prioridad media" value={alertas.filter(a => a.prioridad === "MEDIA").length} />
        <Card title="Seguimiento" value="24/7" />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Listado de alertas
        </h3>

        {error && (
          <div className="mb-6 bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-500 text-center py-8">Cargando alertas...</p>
          ) : alertas.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay alertas activas.
            </p>
          ) : (
            alertas.map((alerta, index) => (
            <div
              key={index}
              onClick={() => setSelectedAlert(alerta)}
              className="border border-gray-100 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 hover:border-red-100 transition-all shadow-sm hover:shadow"
            >
              <div>
                <p className="text-sm text-gray-500">{alerta.tipo}</p>
                <h4 className="font-bold text-gray-900 mt-1">{alerta.titulo}</h4>
                <p className="text-sm text-gray-600 mt-2">{alerta.descripcion}</p>
              </div>

              <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getStyle(alerta.prioridad)}`}>
                {alerta.prioridad}
              </span>
            </div>
          ))
          )}
        </div>
      </div>

      {/* Modal de Detalle y Solución */}
      {selectedAlert && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity"
          onClick={() => setSelectedAlert(null)}
        >
          <div 
            className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl transform transition-transform"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getStyle(selectedAlert.prioridad)}`}>
                  PRIORIDAD {selectedAlert.prioridad}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-4">
                  {selectedAlert.titulo}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{selectedAlert.tipo}</p>
              </div>
              <button 
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Descripción del problema
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedAlert.descripcion}
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ¿Cómo solucionarlo?
              </h4>
              <ul className="text-blue-800 text-sm space-y-2">
                {getSolucion(selectedAlert).split('\n').map((paso, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-semibold">{paso.split('.')[0]}.</span>
                    <span>{paso.substring(paso.indexOf('.') + 1).trim()}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button 
                onClick={() => setSelectedAlert(null)}
                className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Entendido, cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

function Card({ title, value, danger }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className={`text-3xl font-bold mt-3 ${danger ? "text-[#E11D2E]" : "text-gray-900"}`}>
        {value}
      </h3>
    </div>
  );
}