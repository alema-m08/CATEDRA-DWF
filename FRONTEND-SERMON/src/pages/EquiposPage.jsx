import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import { toast } from "react-hot-toast";
import SkeletonTable from "../components/SkeletonTable";

const initialForm = {
  codigo: "",
  tipo: "",
  marca: "",
  ubicacion: "",
  fechaInstalacion: "",
  fechaVencimiento: "",
  activo: true,
  cliente: { id: "" },
};

export default function EquiposPage() {
  const [equipos, setEquipos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const rol = localStorage.getItem("rol");
  const isTecnico = rol === "TECNICO" || rol === "tecnico";

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const equiposRes = await api.get("/equipos");
      setEquipos(equiposRes.data);

      if (!isTecnico) {
        const clientesRes = await api.get("/clientes");
        setClientes(clientesRes.data);
      }
    } catch {
      toast.error("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "clienteId") {
      setForm({ ...form, cliente: { id: Number(value) } });
      if (errors.clienteId) setErrors({ ...errors, clienteId: null });
      return;
    }

    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!form.codigo.trim()) nuevosErrores.codigo = "El código es obligatorio";
    if (!form.tipo.trim()) nuevosErrores.tipo = "El tipo de equipo es obligatorio";
    if (!form.marca.trim()) nuevosErrores.marca = "La marca es obligatoria";
    if (!form.ubicacion.trim()) nuevosErrores.ubicacion = "La ubicación es obligatoria";
    if (!form.fechaInstalacion) nuevosErrores.fechaInstalacion = "Obligatorio";
    if (!form.fechaVencimiento) nuevosErrores.fechaVencimiento = "Obligatorio";
    if (!form.cliente.id) nuevosErrores.clienteId = "Debe seleccionar un cliente";

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarEquipo = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) {
      toast.error("Por favor, completa los campos requeridos");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/equipos/${editingId}`, form);
        toast.success("Equipo actualizado correctamente");
      } else {
        await api.post("/equipos", form);
        toast.success("Equipo registrado correctamente");
      }

      setForm(initialForm);
      setEditingId(null);
      setErrors({});
      cargarDatos();
    } catch {
      toast.error("No se pudo guardar el equipo.");
    }
  };

  const editarEquipo = (equipo) => {
    setEditingId(equipo.id);
    setForm({
      codigo: equipo.codigo || "",
      tipo: equipo.tipo || "",
      marca: equipo.marca || "",
      ubicacion: equipo.ubicacion || "",
      fechaInstalacion: equipo.fechaInstalacion || "",
      fechaVencimiento: equipo.fechaVencimiento || "",
      activo: equipo.activo ?? true,
      cliente: { id: equipo.cliente?.id || "" },
    });
  };

  const eliminarEquipo = async (id) => {
    if (!window.confirm("¿Deseas eliminar este equipo?")) return;

    try {
      await api.delete(`/equipos/${id}`);
      cargarDatos();
      toast.success("Equipo eliminado correctamente");
    } catch {
      toast.error("No se pudo eliminar el equipo.");
    }
  };

  const equiposFiltrados = equipos.filter(e => 
    e.codigo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.cliente?.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout
      title="Inventario de equipos"
      subtitle={isTecnico ? "Consulta los equipos y sus ubicaciones" : "Administra extintores, paneles y sistemas contra incendios"}
    >
      <div className="grid grid-cols-3 gap-8">
        {!isTecnico && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900">
            {editingId ? "Editar equipo" : "Registrar equipo"}
          </h3>

          <form onSubmit={guardarEquipo} className="space-y-4 mt-6">
            <Input label="Código" name="codigo" value={form.codigo} onChange={handleChange} error={errors.codigo} />
            <Input label="Tipo" name="tipo" value={form.tipo} onChange={handleChange} placeholder="Extintor ABC 20 lb" error={errors.tipo} />
            <Input label="Marca" name="marca" value={form.marca} onChange={handleChange} placeholder="Ansul, Siemens..." error={errors.marca} />
            <Input label="Ubicación" name="ubicacion" value={form.ubicacion} onChange={handleChange} error={errors.ubicacion} />

            <Input label="Fecha instalación" name="fechaInstalacion" type="date" value={form.fechaInstalacion} onChange={handleChange} error={errors.fechaInstalacion} />
            <Input label="Fecha vencimiento" name="fechaVencimiento" type="date" value={form.fechaVencimiento} onChange={handleChange} error={errors.fechaVencimiento} />

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Cliente</label>
              <select
                name="clienteId"
                value={form.cliente.id}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
                  errors.clienteId ? "border-red-500 bg-red-50 focus:border-red-600" : "border-gray-300 focus:ring-2 focus:ring-[#E11D2E]"
                }`}
              >
                <option value="">Seleccione cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombreEmpresa}
                  </option>
                ))}
              </select>
              {errors.clienteId && <p className="text-red-500 text-xs mt-1">{errors.clienteId}</p>}
            </div>

            <button className="w-full bg-[#E11D2E] text-white py-3 rounded-xl font-semibold">
              {editingId ? "Actualizar equipo" : "Guardar equipo"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                  setErrors({});
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
              >
                Cancelar
              </button>
            )}
          </form>
        </div>
        )}

        <div className={`${isTecnico ? 'col-span-3' : 'col-span-2'} bg-white rounded-2xl shadow-sm p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Equipos registrados</h3>
              <p className="text-sm text-gray-500">Mostrando {equiposFiltrados.length} resultados</p>
            </div>
            
            <input 
              type="search" 
              placeholder="Buscar código, marca, cliente..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#E11D2E] outline-none"
            />
          </div>

          {loading ? <SkeletonTable /> : (
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left p-4">Código</th>
                  <th className="text-left p-4">Equipo</th>
                  <th className="text-left p-4">Cliente</th>
                  <th className="text-left p-4">Vencimiento</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {equiposFiltrados.map((equipo) => (
                  <tr key={equipo.id} className="border-t">
                    <td className="p-4 font-semibold">{equipo.codigo}</td>
                    <td className="p-4">
                      {equipo.tipo}
                      <p className="text-xs text-gray-500">{equipo.marca} · {equipo.ubicacion}</p>
                    </td>
                    <td className="p-4">{equipo.cliente?.nombreEmpresa}</td>
                    <td className="p-4">{equipo.fechaVencimiento}</td>
                    <td className="p-4 text-right space-x-2">
                      {!isTecnico && (
                        <button onClick={() => editarEquipo(equipo)} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                          Editar
                        </button>
                      )}
                      {!isTecnico && (
                        <button onClick={() => eliminarEquipo(equipo.id)} className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {equiposFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No se encontraron equipos.
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

function Input({ label, name, value, onChange, placeholder = "", type = "text", error }) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
          error ? "border-red-500 bg-red-50 focus:border-red-600" : "border-gray-300 focus:ring-2 focus:ring-[#E11D2E]"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}