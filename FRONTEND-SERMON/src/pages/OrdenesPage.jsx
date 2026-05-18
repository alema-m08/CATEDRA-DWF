import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import SkeletonTable from "../components/SkeletonTable";

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const rol = localStorage.getItem("rol");
  const isTecnico = rol === "TECNICO" || rol === "tecnico";

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/ordenes-trabajo");
      setOrdenes(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cambiarEstado = async (orden, nuevoEstado) => {
    await api.put(`/ordenes-trabajo/${orden.id}`, {
      fechaProgramada: orden.fechaProgramada,
      prioridad: orden.prioridad,
      estado: nuevoEstado,
      descripcion: orden.descripcion,
      cliente: { id: orden.cliente.id },
      equipo: { id: orden.equipo.id },
      tecnico: { id: orden.tecnico.id },
    });

    cargarOrdenes();
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta orden?")) return;
    await api.delete(`/ordenes-trabajo/${id}`);
    cargarOrdenes();
  };

  const ordenesFiltradas = ordenes.filter(o => 
    o.cliente?.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.equipo?.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.tecnico?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout
      title="Órdenes de trabajo"
      subtitle="Control operativo y seguimiento administrativo de servicios"
    >
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card title="Total órdenes" value={ordenes.length} />
        <Card title="Pendientes" value={ordenes.filter(o => o.estado === "PENDIENTE").length} danger />
        <Card title="Completadas" value={ordenes.filter(o => o.estado === "COMPLETADA").length} />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Listado de órdenes</h3>
            <p className="text-sm text-gray-500 mt-1">Mostrando {ordenesFiltradas.length} resultados</p>
          </div>
          
          <input 
            type="search" 
            placeholder="Buscar por cliente, equipo, descripción..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#E11D2E] outline-none"
          />
        </div>

        {loading ? <SkeletonTable /> : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="p-4 text-left">Cliente</th>
              <th className="p-4 text-left">Equipo</th>
              <th className="p-4 text-left">Técnico</th>
              <th className="p-4 text-left">Descripción</th>
              <th className="p-4 text-left">Prioridad</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ordenesFiltradas.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="p-4 font-semibold">
                  {o.cliente?.nombreEmpresa}
                </td>

                <td className="p-4">
                  {o.equipo?.codigo}
                  <p className="text-xs text-gray-500">{o.equipo?.tipo}</p>
                </td>

                <td className="p-4">{o.tecnico?.nombre}</td>

                <td className="p-4 max-w-xs">
                  {o.descripcion}
                  <p className="text-xs text-gray-500">
                    Fecha: {o.fechaProgramada}
                  </p>
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                    {o.prioridad}
                  </span>
                </td>

                <td className="p-4">
                  <span className={badgeEstado(o.estado)}>
                    {o.estado}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {o.estado === "PENDIENTE" && (
                      <button
                        onClick={() => cambiarEstado(o, "EN_PROCESO")}
                        className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-medium rounded-lg border border-yellow-200 transition-colors shadow-sm"
                      >
                        Iniciar
                      </button>
                    )}

                    {o.estado !== "COMPLETADA" && (
                      <button
                        onClick={() => cambiarEstado(o, "COMPLETADA")}
                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg border border-green-200 transition-colors shadow-sm"
                      >
                        Completar
                      </button>
                    )}

                    {!isTecnico && (
                      <button
                        onClick={() => eliminar(o.id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg border border-red-200 transition-colors shadow-sm"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {ordenesFiltradas.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No se encontraron órdenes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        )}
      </div>
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

function badgeEstado(estado) {
  if (estado === "COMPLETADA") {
    return "px-3 py-1 rounded-full text-xs bg-green-100 text-green-700";
  }

  if (estado === "EN_PROCESO") {
    return "px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700";
  }

  return "px-3 py-1 rounded-full text-xs bg-red-100 text-red-700";
}