import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/chat" replace /> : children;
};

const App = () => {
  const hasToken = localStorage.getItem("token");

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              hasToken ? (
                <Navigate to="/chat" replace />
              ) : (
                <Navigate to="/register" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              hasToken ? (
                <Navigate to="/chat" replace />
              ) : (
                <Navigate to="/register" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
