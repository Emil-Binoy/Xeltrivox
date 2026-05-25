import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import Chat from "./pages/Chat"
import Register from "./pages/Register"


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/chat" element={<ProtectedRoute>
          <Chat/>
        </ProtectedRoute>}/>
        <Route path="*" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App