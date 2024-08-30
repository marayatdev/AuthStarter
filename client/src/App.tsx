import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register } from "./pages/Auth/Register/Register";
import { Login } from "./pages/Auth/Login/Login";
import Dashbord from "./pages/Home/Dashbord";
import { useAuth } from "./contexts/Auth/AuthContext";

function App() {

  const { user } = useAuth();


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashbord />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
