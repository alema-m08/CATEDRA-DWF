import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import SkeletonDashboard from "../components/SkeletonDashboard";

export default function ReportesPage() {
  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/reportes/resumen")
      .then((res) => setReporte(res.data))
      .catch(() => setError("No se pudieron cargar los reportes."));
  }, []);

  return (
    <MainLayout
      title="Reportes y analítica"
      subtitle="Resumen administrativo del sistema SERMON"
    >
      {error && (
        <div className="mb-6 bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!reporte && !error ? (
        <SkeletonDashboard />
      ) : reporte ? (
        <>
          <div className="grid grid-cols-4 gap-6">
            <Card title="Clientes" value={reporte.totalClientes} />
            <Card title="Equipos" value={reporte.totalEquipos} />
            <Card title="Técnicos" value={reporte.totalTecnicos} />
            <Card title="Órdenes" value={reporte.totalOrdenesTrabajo} danger />
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Mantenimientos
              </h3>

              <Bar label="Completados" value={reporte.mantenimientosCompletados} total={reporte.totalMantenimientos} />
              <Bar label="Pendientes" value={reporte.mantenimientosPendientes} total={reporte.totalMantenimientos} red />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Órdenes de trabajo
              </h3>

              <Bar label="Completadas" value={reporte.ordenesCompletadas} total={reporte.totalOrdenesTrabajo} />
              <Bar label="Pendientes" value={reporte.ordenesPendientes} total={reporte.totalOrdenesTrabajo} red />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Resumen general
            </h3>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <Row label="Total mantenimientos" value={reporte.totalMantenimientos} />
              <Row label="Mantenimientos completados" value={reporte.mantenimientosCompletados} />
              <Row label="Mantenimientos pendientes" value={reporte.mantenimientosPendientes} />
              <Row label="Total órdenes" value={reporte.totalOrdenesTrabajo} />
              <Row label="Órdenes completadas" value={reporte.ordenesCompletadas} />
              <Row label="Órdenes pendientes" value={reporte.ordenesPendientes} />
            </div>
          </div>
        </>
      ) : null}
    </MainLayout>
  );
}

function Card({ title, value, danger }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className={`text-4xl font-bold mt-3 ${danger ? "text-[#E11D2E]" : "text-gray-900"}`}>
        {value}
      </h3>
    </div>
  );
}

function Bar({ label, value, total, red }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>

      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${red ? "bg-[#E11D2E]" : "bg-[#111827]"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border rounded-xl p-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}