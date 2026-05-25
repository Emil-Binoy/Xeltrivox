import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import Chat from "./pages/Chat"
import Register from "./pages/Register"
import { Toaster } from "react-hot-toast";


const App = () => {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/chat" element={<ProtectedRoute>
            <Chat/>
          </ProtectedRoute>}/>
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App