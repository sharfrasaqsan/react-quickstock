import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "sonner";
import AddItem from "./pages/AddItem";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./utils/ScrollToTop";
import EditItem from "./pages/EditItem";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user } = useAuth();
  return (
    <div>
      <Header />
      <Navbar />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-item"
            element={
              <ProtectedRoute>
                <AddItem />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-item/:id"
            element={
              <ProtectedRoute>
                <EditItem />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <ScrollToTop />
      <Toaster
        position="top-right"
        theme="system"
        toastOptions={{ duration: 5000 }}
      />
    </div>
  );
}

export default App;
