import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "sonner";
import AddItem from "./components/items/AddItem";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./utils/ScrollToTop";
import EditItem from "./components/items/EditItem";

function App() {
  return (
    <div>
      <Header />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/add-item" element={<AddItem />} />
          <Route path="/edit-item/:id" element={<EditItem />} />

          <Route path="/login" element={<Login />} />
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
