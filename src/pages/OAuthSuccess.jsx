import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import URL from "../components/API";
import { toast } from "react-toastify";

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

          toast.success("Đăng nhập Google thành công !");
          // Hiển thị spinner 2 giây trước khi chuyển hướng
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } catch (error) {
        toast.error("Đăng nhập thất bại! Vui lòng thử lại.");
        navigate("/auth/login");
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
          <div className="text-center">
            <Spinner variant="primary" animation="border" />
          </div>
        </>
      ) : (
        <h2></h2>
      )}
    </div>
  );
};

export default OAuthSuccess;
