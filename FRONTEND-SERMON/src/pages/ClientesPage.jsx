import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import { toast } from "react-hot-toast";
import SkeletonTable from "../components/SkeletonTable";

const initialForm = {
  nombreEmpresa: "",
  direccion: "",
  telefono: "",
  contacto: "",
  correo: "",
  activo: true,
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch {
      toast.error("No se pudieron cargar los clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!form.nombreEmpresa.trim()) nuevosErrores.nombreEmpresa = "El nombre es obligatorio";
    if (!form.direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria";
    if (!form.telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio";
    if (!form.contacto.trim()) nuevosErrores.contacto = "El contacto es obligatorio";
    if (!form.correo.trim()) nuevosErrores.correo = "El correo es obligatorio";

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarCliente = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) {
      toast.error("Por favor, completa los campos requeridos");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/clientes/${editingId}`, form);
        toast.success("Cliente actualizado correctamente");
      } else {
        await api.post("/clientes", form);
        toast.success("Cliente registrado correctamente");
      }

      setForm(initialForm);
      setEditingId(null);
      setErrors({});
      cargarClientes();
    } catch {
      toast.error("No se pudo guardar el cliente.");
    }
  };

  const editarCliente = (cliente) => {
    setEditingId(cliente.id);
    setForm({
      nombreEmpresa: cliente.nombreEmpresa || "",
      direccion: cliente.direccion || "",
      telefono: cliente.telefono || "",
      contacto: cliente.contacto || "",
      correo: cliente.correo || "",
      activo: cliente.activo ?? true,
    });
  };

  const eliminarCliente = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar este cliente?");

    if (!confirmar) return;

    try {
      await api.delete(`/clientes/${id}`);
      cargarClientes();
      toast.success("Cliente eliminado correctamente");
    } catch {
      toast.error("No se pudo eliminar el cliente.");
    }
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setForm(initialForm);
    setErrors({});
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout
      title="Gestión de clientes"
      subtitle="Administra empresas atendidas por SERMON"
    >
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {editingId ? "Editar cliente" : "Nuevo cliente"}
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            Completa la información de la empresa.
          </p>

          <form onSubmit={guardarCliente} className="space-y-4">
            <Input
              label="Empresa"
              name="nombreEmpresa"
              value={form.nombreEmpresa}
              onChange={handleChange}
              placeholder="Claro El Salvador"
              error={errors.nombreEmpresa}
            />

            <Input
              label="Dirección"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="San Salvador"
              error={errors.direccion}
            />

            <Input
              label="Teléfono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="7777-1234"
              error={errors.telefono}
            />

            <Input
              label="Contacto"
              name="contacto"
              value={form.contacto}
              onChange={handleChange}
              placeholder="Carlos Ramírez"
              error={errors.contacto}
            />

            <Input
              label="Correo"
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              placeholder="contacto@empresa.com"
              error={errors.correo}
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-[#E11D2E] text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                {editingId ? "Actualizar" : "Guardar"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="px-4 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Clientes registrados
              </h3>
              <p className="text-sm text-gray-500">
                Mostrando {clientesFiltrados.length} resultados
              </p>
            </div>
            
            <input 
              type="search" 
              placeholder="Buscar cliente..." 
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
                  <th className="text-left p-4">Empresa</th>
                  <th className="text-left p-4">Contacto</th>
                  <th className="text-left p-4">Teléfono</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="border-t">
                    <td className="p-4 font-semibold text-gray-900">
                      {cliente.nombreEmpresa}
                      <p className="text-xs text-gray-500 font-normal">
                        {cliente.correo}
                      </p>
                    </td>

                    <td className="p-4 text-gray-700">{cliente.contacto}</td>
                    <td className="p-4 text-gray-700">{cliente.telefono}</td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        Activo
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => editarCliente(cliente)}
                        className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarCliente(cliente.id)}
                        className="px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}

                {clientesFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No se encontraron clientes.
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

function Input({ label, name, value, onChange, placeholder, type = "text", error }) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>

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