import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import URL from "../components/API";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const id = params.get("id");
        const username = params.get("username");
        const email = params.get("email");
        const img = params.get("img");
        const role = params.get("role");

        if (token) {
          // Gọi API lấy user info
          const response = await axios.get(
            `${URL}/auth/user-info?jwt=${token}`
          );

          // Lưu vào localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(response.data.data));
          window.dispatchEvent(new Event("storage"));

          // Hiển thị spinner 2 giây trước khi chuyển hướng
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } catch (error) {
        console.error("OAuth login error:", error);
        alert("Đăng nhập thất bại! Vui lòng thử lại.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    handleOAuth();
  }, [navigate]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-5">
      {loading ? (
        <>
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            style={{ width: "4rem", height: "4rem" }}
          />
          <span className="mt-3 text-primary fw-semibold fs-5">
            Đang đăng nhập Google...
          </span>
        </>
      ) : (
        <span className="text-primary fs-4 fw-semibold">
          Đăng nhập thành công!
        </span>
      )}
    </div>
  );
};

export default OAuthSuccess;
