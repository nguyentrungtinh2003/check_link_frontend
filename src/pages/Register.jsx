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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify"; // ✅ phải lấy từ react-toastify

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State toggle show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      localStorage.setItem("email-verifyacc", formData.email);

      toast.success(
        "Đăng ký thành công, vui lòng kiểm tra email để nhận OTP !"
      );
      setTimeout(() => {
        window.location.href = "/auth/verify-acc";
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        <h3 className="text-center mb-4">Đăng ký</h3>

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

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email thật, vì có bước xác thực OTP"
              name="email"
              className="border rounded-4"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Password with eye toggle */}
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

          {/* Confirm Password with eye toggle */}
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                name="confirmPassword"
                className="border rounded-4"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <Button
                variant="primary"
                className="ms-2 rounded-4"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 border rounded-4"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Đăng ký"}
          </Button>
        </Form>

        {/* Thêm link đăng nhập */}
        <div className="text-center mt-3">
          <span>Đăng nhập ngay </span>
          <a href="/auth/login">Đăng nhập</a>
        </div>
      </Card>
    </Container>
  );
};

export default Register;
