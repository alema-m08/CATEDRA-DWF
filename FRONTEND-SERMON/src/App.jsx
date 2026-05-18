import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ClientesPage from "./pages/ClientesPage";
import EquiposPage from "./pages/EquiposPage";
import TecnicosPage from "./pages/TecnicosPage";
import MantenimientosPage from "./pages/MantenimientosPage";
import OrdenesPage from "./pages/OrdenesPage";
import AlertasPage from "./pages/AlertasPage";
import ReportesPage from "./pages/ReportesPage";
import UsuariosPage from "./pages/UsuariosPage";
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const isTecnico = rol === "TECNICO" || rol === "tecnico";

  if (!token) return <Navigate to="/" />;
  if (isTecnico) return <Navigate to="/dashboard" />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <AdminRoute>
              <ClientesPage />
            </AdminRoute>
          }
        />
        
        <Route
          path="/equipos"
          element={
            <PrivateRoute>
              <EquiposPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/tecnicos"
          element={
            <AdminRoute>
              <TecnicosPage />
            </AdminRoute>
          }
        />

        <Route
          path="/mantenimientos"
          element={
            <PrivateRoute>
              <MantenimientosPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/ordenes"
          element={
            <PrivateRoute>
              <OrdenesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/alertas"
          element={
            <PrivateRoute>
              <AlertasPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <AdminRoute>
              <ReportesPage />
            </AdminRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <AdminRoute>
              <UsuariosPage />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}