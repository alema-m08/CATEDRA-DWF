import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import SkeletonDashboard from "../components/SkeletonDashboard";

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <MainLayout
      title="Panel ejecutivo"
      subtitle="Resumen operativo de SERMON"
    >
      {!data ? (
        <SkeletonDashboard />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6">
            <Card title="Clientes activos" value={data.totalClientes} subtitle="Empresas registradas" />
            <Card title="Equipos registrados" value={data.totalEquipos} subtitle="Extintores y sistemas" />
            <Card title="Técnicos activos" value={data.totalTecnicos} subtitle="Personal operativo" />
            <Card title="Órdenes pendientes" value={data.ordenesPendientes} subtitle="Servicios por atender" danger />
          </div>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm col-span-2">
              <h3 className="text-lg font-bold text-gray-900">
                Estado de mantenimientos
              </h3>

              <div className="mt-8 space-y-5">
                <Bar
                  label="Completados"
                  value={data.mantenimientosCompletados}
                  total={data.totalMantenimientos}
                />

                <Bar
                  label="Pendientes"
                  value={data.mantenimientosPendientes}
                  total={data.totalMantenimientos}
                  red
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">
                Resumen rápido
              </h3>

              <div className="mt-6 space-y-4 text-sm">
                <Row label="Mantenimientos" value={data.totalMantenimientos} />
                <Row label="Órdenes de trabajo" value={data.totalOrdenesTrabajo} />
                <Row label="Pendientes" value={data.ordenesPendientes} />
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}

function Card({ title, value, subtitle, danger }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className={`text-4xl font-bold mt-4 ${danger ? "text-[#E11D2E]" : "text-gray-900"}`}>
        {value}
      </h3>
      <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}

function Bar({ label, value, total, red }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
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