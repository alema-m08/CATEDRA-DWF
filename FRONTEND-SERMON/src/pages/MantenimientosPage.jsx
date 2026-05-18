import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import { toast } from "react-hot-toast";
import SkeletonTable from "../components/SkeletonTable";

const initialForm = {
  fechaProgramada: "",
  fechaRealizada: null,
  tipoServicio: "",
  estado: "PENDIENTE",
  observaciones: "",
  completado: false,
  equipo: { id: "" },
  tecnico: { id: "" },
};

export default function MantenimientosPage() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const rol = localStorage.getItem("rol");
  const isTecnico = rol === "TECNICO" || rol === "tecnico";

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const mRes = await api.get("/mantenimientos");
      setMantenimientos(mRes.data);

      if (!isTecnico) {
        const [eRes, tRes] = await Promise.all([
          api.get("/equipos"),
          api.get("/tecnicos"),
        ]);
        setEquipos(eRes.data);
        setTecnicos(tRes.data);
      }
    } catch (error) {
      toast.error("Error al cargar los mantenimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!form.fechaProgramada) nuevosErrores.fechaProgramada = "La fecha es obligatoria";
    if (!form.tipoServicio.trim()) nuevosErrores.tipoServicio = "El tipo de servicio es obligatorio";
    if (!form.equipo.id) nuevosErrores.equipo = "Debe seleccionar un equipo";
    if (!form.tecnico.id) nuevosErrores.tecnico = "Debe seleccionar un técnico";

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) {
      toast.error("Por favor, completa los campos requeridos");
      return;
    }

    try {
      await api.post("/mantenimientos", {
        ...form,
        equipo: { id: Number(form.equipo.id) },
        tecnico: { id: Number(form.tecnico.id) },
      });

      setForm(initialForm);
      setErrors({});
      cargarDatos();
      toast.success("Mantenimiento registrado correctamente");
    } catch (error) {
      toast.error("Error al registrar el mantenimiento");
    }
  };

  const generarOrden = async (m) => {
    if (!m.equipo?.cliente?.id) {
      toast.error("Este mantenimiento no tiene cliente asociado al equipo.");
      return;
    }

    await api.post("/ordenes-trabajo", {
      fechaProgramada: m.fechaProgramada,
      prioridad: "MEDIA",
      estado: "PENDIENTE",
      descripcion: `Orden generada para ${m.tipoServicio}. ${
        m.observaciones || ""
      }`,
      cliente: {
        id: m.equipo.cliente.id,
      },
      equipo: {
        id: m.equipo.id,
      },
      tecnico: {
        id: m.tecnico.id,
      },
    });

    toast.success("Orden generada correctamente.");
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar mantenimiento?")) return;

    try {
      await api.delete(`/mantenimientos/${id}`);
      cargarDatos();
      toast.success("Mantenimiento eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const marcarRealizado = async (m) => {
    const hoy = new Date().toISOString().split("T")[0];

    await api.put(`/mantenimientos/${m.id}`, {
      fechaProgramada: m.fechaProgramada,
      fechaRealizada: hoy,
      tipoServicio: m.tipoServicio,
      estado: "COMPLETADO",
      observaciones: m.observaciones || "Mantenimiento realizado.",
      completado: true,
      equipo: { id: m.equipo.id },
      tecnico: { id: m.tecnico.id },
    });

    cargarDatos();
    toast.success("Marcado como realizado");
  };

  const mantenimientosFiltrados = mantenimientos.filter(m => 
    m.equipo?.codigo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.tecnico?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.tipoServicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout
      title="Mantenimientos"
      subtitle={isTecnico ? "Gestiona los servicios técnicos asignados" : "Programa servicios técnicos y genera órdenes de trabajo"}
    >
      <div className="grid grid-cols-3 gap-8">
        {!isTecnico && (
          <form
            onSubmit={guardar}
            className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
          >
          <h3 className="text-xl font-bold text-gray-900">
            Nuevo mantenimiento
          </h3>

          <p className="text-sm text-gray-500">
            Registra el servicio técnico que debe realizarse.
          </p>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Fecha programada
            </label>
            <input
              type="date"
              value={form.fechaProgramada}
              onChange={(e) => {
                setForm({ ...form, fechaProgramada: e.target.value });
                if (errors.fechaProgramada) setErrors({ ...errors, fechaProgramada: null });
              }}
              className={`w-full border rounded-xl px-4 py-3 outline-none transition-colors ${
                errors.fechaProgramada ? "border-red-500 bg-red-50 focus:border-red-600" : "border-gray-200 focus:border-blue-500"
              }`}
            />
            {errors.fechaProgramada && <p className="text-red-500 text-xs mt-1">{errors.fechaProgramada}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tipo de servicio
            </label>
            <input
              placeholder="Recarga, inspección, reparación..."
              value={form.tipoServicio}
              onChange={(e) => {
                setForm({ ...form, tipoServicio: e.target.value });
                if (errors.tipoServicio) setErrors({ ...errors, tipoServicio: null });
              }}
              className={`w-full border rounded-xl px-4 py-3 outline-none transition-colors ${
                errors.tipoServicio ? "border-red-500 bg-red-50 focus:border-red-600" : "border-gray-200 focus:border-blue-500"
              }`}
            />
            {errors.tipoServicio && <p className="text-red-500 text-xs mt-1">{errors.tipoServicio}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Equipo
            </label>
            <select
              value={form.equipo.id}
              onChange={(e) => {
                setForm({ ...form, equipo: { id: e.target.value } });
                if (errors.equipo) setErrors({ ...errors, equipo: null });
              }}
              className={`w-full border rounded-xl px-4 py-3 outline-none transition-colors ${
                errors.equipo ? "border-red-500 bg-red-50 focus:border-red-600" : "border-gray-200 focus:border-blue-500"
              }`}
            >
              <option value="">Seleccionar equipo</option>
              {equipos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.codigo} - {e.tipo}
                </option>
              ))}
            </select>
            {errors.equipo && <p className="text-red-500 text-xs mt-1">{errors.equipo}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Técnico
            </label>
            <select
              value={form.tecnico.id}
              onChange={(e) => {
                setForm({ ...form, tecnico: { id: e.target.value } });
                if (errors.tecnico) setErrors({ ...errors, tecnico: null });
              }}
              className={`w-full border rounded-xl px-4 py-3 outline-none transition-colors ${
                errors.tecnico ? "border-red-500 bg-red-50 focus:border-red-600" : "border-gray-200 focus:border-blue-500"
              }`}
            >
              <option value="">Seleccionar técnico</option>
              {tecnicos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
            {errors.tecnico && <p className="text-red-500 text-xs mt-1">{errors.tecnico}</p>}
          </div>

          <textarea
            placeholder="Observaciones (opcional)"
            value={form.observaciones}
            onChange={(e) =>
              setForm({ ...form, observaciones: e.target.value })
            }
            className="w-full border border-gray-200 rounded-xl px-4 py-3 min-h-24 outline-none focus:border-blue-500 transition-colors"
          />

          <button className="w-full bg-[#E11D2E] text-white py-3 rounded-xl font-semibold">
            Guardar mantenimiento
          </button>
        </form>
        )}

        <div className={`${isTecnico ? 'col-span-3' : 'col-span-2'} bg-white rounded-2xl p-6 shadow-sm`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Mantenimientos registrados
              </h3>
              <p className="text-sm text-gray-500">
                Mostrando {mantenimientosFiltrados.length} resultados
              </p>
            </div>
            
            <input 
              type="search" 
              placeholder="Buscar equipo, técnico, servicio..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#E11D2E] outline-none"
            />
          </div>

          {loading ? <SkeletonTable /> : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="border-b text-gray-500 bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Equipo</th>
                  <th className="p-4 text-left">Técnico</th>
                  <th className="p-4 text-left">Servicio</th>
                  <th className="p-4 text-left">Estado</th>
                  <th className="p-4 text-left">Fecha</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {mantenimientosFiltrados.map((m) => (
                  <tr key={m.id} className="border-b">
                    <td className="p-4">
                      <span className="font-semibold text-gray-900">
                        {m.equipo?.codigo}
                      </span>
                      <p className="text-xs text-gray-500">
                        {m.equipo?.tipo}
                      </p>
                    </td>

                    <td className="p-4">{m.tecnico?.nombre}</td>

                    <td className="p-4">
                      {m.tipoServicio}
                      <p className="text-xs text-gray-500">
                        {m.observaciones}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          m.completado
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {m.estado}
                      </span>
                    </td>

                    <td className="p-4">{m.fechaProgramada}</td>

                    <td className="p-4 whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        {!isTecnico && (
                          <button
                            onClick={() => generarOrden(m)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg border border-blue-200 transition-colors shadow-sm whitespace-nowrap"
                          >
                            Generar orden
                          </button>
                        )}

                        {!m.completado && (
                          <button
                            onClick={() => marcarRealizado(m)}
                            className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg border border-green-200 transition-colors shadow-sm whitespace-nowrap"
                          >
                            Realizado
                          </button>
                        )}

                        {!isTecnico && (
                          <button
                            onClick={() => eliminar(m.id)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg border border-red-200 transition-colors shadow-sm whitespace-nowrap"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {mantenimientosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No se encontraron mantenimientos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}