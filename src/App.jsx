import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Enrollment from "./pages/Enrollment";
import Uploads from "./pages/Uploads";
import Claims from "./pages/Claims";
import Payments from "./pages/Payments";
import Branches from "./pages/Branches";
import Members from "./pages/Members";
import Notifications from "./pages/Notifications";
import Renewals from "./pages/Renewals";
import Products from "./pages/Products";
import Account from "./pages/Account";
import ApiDocs from "./pages/ApiDocs";
import ApiKeys from "./pages/ApiKeys";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="enrollment" element={<Enrollment />} />
        <Route path="uploads" element={<Uploads />} />
        <Route path="claims" element={<Claims />} />
        <Route path="payments" element={<Payments />} />
        <Route path="branches" element={<Branches />} />
        <Route path="members" element={<Members />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="renewals" element={<Renewals />} />
        <Route path="products" element={<Products />} />
        <Route path="account" element={<Account />} />
        <Route path="api-docs" element={<ApiDocs />} />
        <Route path="api-keys" element={<ApiKeys />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
