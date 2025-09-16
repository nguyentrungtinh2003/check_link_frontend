import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import History from "./pages/History";
import Profile from "./pages/Profile";
import SendOTP from "./pages/SendOTP";
import ResetPassword from "./pages/ResetPassword";
import VerifyAcc from "./pages/VerifyAcc";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/auth/login";
        }
      } catch (err) {
        console.error("Token không hợp lệ:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    }
  }, []);

  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: "135px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth/send-otp" element={<SendOTP />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/verify-acc" element={<VerifyAcc />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
