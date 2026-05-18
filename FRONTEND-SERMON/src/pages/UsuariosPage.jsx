import { useEffect, useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import SkeletonTable from "../components/SkeletonTable";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    rol: "TECNICO",
    activo: true,
    password: "NO_CAMBIAR",
  });

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const editar = (usuario) => {
    setEditId(usuario.id);
    setForm({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      activo: usuario.activo,
      password: "NO_CAMBIAR",
    });
  };

  const guardar = async (e) => {
    e.preventDefault();
    await api.put(`/usuarios/${editId}`, form);
    setEditId(null);
    cargarUsuarios();
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    await api.delete(`/usuarios/${id}`);
    cargarUsuarios();
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout title="Gestión de usuarios" subtitle="Administra cuentas y roles">
      {editId && (
        <form onSubmit={guardar} className="bg-white rounded-2xl p-6 shadow-sm mb-8 grid grid-cols-4 gap-4">
          <input className="border rounded-xl px-4 py-3" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <input className="border rounded-xl px-4 py-3" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />

          <select className="border rounded-xl px-4 py-3" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
            <option value="ADMIN">ADMIN</option>
            <option value="TECNICO">TECNICO</option>
          </select>

          <select className="border rounded-xl px-4 py-3" value={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.value === "true" })}>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>

          <button className="bg-[#E11D2E] text-white py-3 rounded-xl font-semibold">
            Guardar cambios
          </button>

          <button type="button" onClick={() => setEditId(null)} className="bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">
            Cancelar
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Usuarios del sistema</h3>
            <p className="text-sm text-gray-500 mt-1">Mostrando {usuariosFiltrados.length} resultados</p>
          </div>
          
          <input 
            type="search" 
            placeholder="Buscar por nombre, correo o rol..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#E11D2E] outline-none"
          />
        </div>

        {loading ? <SkeletonTable /> : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500 bg-gray-50">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Correo</th>
              <th className="p-4 text-left">Rol</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-4 font-semibold">{u.nombre}</td>
                <td className="p-4">{u.correo}</td>
                <td className="p-4">{u.rol}</td>
                <td className="p-4">{u.activo ? "Activo" : "Inactivo"}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => editar(u)} className="px-3 py-2 bg-gray-100 rounded-lg">
                    Editar
                  </button>
                  <button onClick={() => eliminar(u.id)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No se encontraron usuarios.
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