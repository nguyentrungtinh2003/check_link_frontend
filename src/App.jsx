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
import User from "./pages/User";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.info("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
            setTimeout(() => {
              window.location.href = "/auth/login";
            }, 3000);
          }
        } catch (err) {
          toast.error("Token không hợp lệ:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 3000);
        }
      }
    };
    checkToken();
    const interval = setInterval(checkToken, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
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

          <Route
            path="/auth/admin/user"
            element={
              JSON.parse(localStorage.getItem("user"))?.role === "ADMIN" ? (
                <User />
              ) : (
                <Home />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
