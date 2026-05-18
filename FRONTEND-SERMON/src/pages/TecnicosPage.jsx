import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import { toast } from "react-hot-toast";
import SkeletonTable from "../components/SkeletonTable";

const initialForm = {
  nombre: "",
  especialidad: "",
  telefono: "",
  correo: "",
  disponible: true,
  activo: true,
};

export default function TecnicosPage() {
  const [tecnicos, setTecnicos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const cargarTecnicos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tecnicos");
      setTecnicos(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTecnicos();
  }, []);

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!form.especialidad.trim()) nuevosErrores.especialidad = "La especialidad es obligatoria";
    if (!form.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio";
    if (!form.correo.trim()) nuevosErrores.correo = "El correo es obligatorio";

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
      if (editingId) {
        await api.put(`/tecnicos/${editingId}`, form);
        toast.success("Técnico actualizado correctamente");
      } else {
        await api.post("/tecnicos", form);
        toast.success("Técnico registrado correctamente");
      }

      setForm(initialForm);
      setEditingId(null);
      setErrors({});
      cargarTecnicos();
    } catch {
      toast.error("Error al guardar técnico");
    }
  };

  const editar = (t) => {
    setEditingId(t.id);
    setForm(t);
    setErrors({});
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar técnico?")) return;

    try {
      await api.delete(`/tecnicos/${id}`);
      cargarTecnicos();
      toast.success("Técnico eliminado");
    } catch {
      toast.error("Error al eliminar técnico");
    }
  };

  const tecnicosFiltrados = tecnicos.filter(t => 
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout
      title="Gestión de técnicos"
      subtitle="Administra el personal operativo"
    >
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6">
            {editingId ? "Editar técnico" : "Nuevo técnico"}
          </h3>

          <form onSubmit={guardar} className="space-y-4">
            <Input label="Nombre" name="nombre" value={form.nombre} setForm={setForm} form={form} error={errors.nombre} setErrors={setErrors} errors={errors} />
            <Input label="Especialidad" name="especialidad" value={form.especialidad} setForm={setForm} form={form} error={errors.especialidad} setErrors={setErrors} errors={errors} />
            <Input label="Teléfono" name="telefono" value={form.telefono} setForm={setForm} form={form} error={errors.telefono} setErrors={setErrors} errors={errors} />
            <Input label="Correo" name="correo" value={form.correo} setForm={setForm} form={form} type="email" error={errors.correo} setErrors={setErrors} errors={errors} />

            <div className="flex gap-3">
              <button className="flex-1 bg-[#E11D2E] text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition">
                {editingId ? "Actualizar" : "Guardar"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                    setErrors({});
                  }}
                  className="px-4 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Listado de técnicos</h3>
              <p className="text-sm text-gray-500 mt-1">Mostrando {tecnicosFiltrados.length} resultados</p>
            </div>
            
            <input 
              type="search" 
              placeholder="Buscar técnico..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#E11D2E] outline-none"
            />
          </div>

          {loading ? <SkeletonTable /> : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="p-4 text-left">Nombre</th>
                <th className="p-4 text-left">Especialidad</th>
                <th className="p-4 text-left">Correo</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {tecnicosFiltrados.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="p-4 font-semibold">{t.nombre}</td>
                  <td className="p-4">{t.especialidad}</td>
                  <td className="p-4">{t.correo}</td>

                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => editar(t)} className="px-3 py-2 bg-gray-100 rounded-lg">
                      Editar
                    </button>

                    <button onClick={() => eliminar(t.id)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {tecnicosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No se encontraron técnicos.
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

function Input({ label, name, value, setForm, form, type = "text", error, setErrors, errors }) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => {
          setForm({
            ...form,
            [name]: e.target.value,
          });
          if (errors && errors[name]) {
            setErrors({ ...errors, [name]: null });
          }
        }}
        className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
          error ? "border-red-500 bg-red-50 focus:border-red-600" : "border-gray-300 focus:ring-2 focus:ring-[#E11D2E]"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}