
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Auth/Register/Register';
import { Login } from './pages/Auth/Login/Login';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
