import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import URL from "../components/API";
import URL2 from "../components/API2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify"; // ✅ phải lấy từ react-toastify

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const response = await axios.post(`${URL}/auth/login`, {
        username: formData.username,
        password: formData.password,
      });
      toast.success("Đăng nhập thành công !");
      localStorage.setItem("user", JSON.stringify(response.data.data));

      // Lưu token hoặc user info vào localStorage (nếu backend trả về)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      setFormData({ username: "", password: "" });
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  //--- login google ----
  const handleGoogleLogin = () => {
    window.location.href = `${URL2}/oauth2/authorization/google`;
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ marginTop: "80px" }}
    >
      <Card
        className="p-4 shadow-lg border rounded-4 border-2 border-primary"
        style={{ width: "400px" }}
      >
        <h3 className="text-center mb-4">Đăng nhập</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên đăng nhập"
              name="username"
              className="border rounded-4"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Mật khẩu</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                name="password"
                className="border rounded-4"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                variant="primary"
                className="ms-2 rounded-4"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 border rounded-4"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Đăng nhập"}
          </Button>
          <div className="text-center mt-3">
            <p className="text-lg mb-2">Hoặc</p>
            <Button
              variant="light"
              onClick={handleGoogleLogin}
              className="d-flex align-items-center justify-content-center border rounded-pill py-2 w-100"
            >
              <img
                src="/google-ico.svg"
                alt="Google logo"
                width="20"
                height="20"
                className="me-3"
              />
              <span className="fw-semibold">Đăng nhập với Google</span>
            </Button>
          </div>
        </Form>
        {/* Thêm link đăng ký */}
        <div className="text-center mt-3">
          <span>Chưa có tài khoản ? </span>
          <a href="/auth/register">Đăng ký</a>
        </div>
        <div className="text-center mt-3">
          <span>Quên mật khẩu ? </span>
          <a href="/auth/send-otp">Đặt lại mật khẩu</a>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
