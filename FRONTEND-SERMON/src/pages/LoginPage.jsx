import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        correo,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("rol", response.data.rol);
      localStorage.setItem("correo", response.data.correo);

      navigate("/dashboard");
    } catch (err) {
      toast.error("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#E11D2E] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-red-500/30">
            S
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            SERMON
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Sistema contra incendios
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Correo
            </label>

            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E11D2E] transition-shadow"
              placeholder="admin@sermon.com"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E11D2E] transition-shadow"
              placeholder="********"
              required
            />
          </div>


          <button
            type="submit"
            className="w-full bg-[#E11D2E] hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg"
          >
            Iniciar sesión
          </button>

        </form>

      </div>

    </div>
  );
}