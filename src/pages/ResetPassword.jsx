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

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: localStorage.getItem("email") || "",
    otp: "",
    newPassword: "",
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
    setLoading(true);

    try {
      const res = await axios.post(`${URL}/auth/reset-password`, formData);
      setSuccess(res.data.message || "Đặt lại mật khẩu thành công!");
      setFormData({ email: "", otp: "", newPassword: "" });
      window.location.href = "/auth/login";
    } catch (err) {
      setError(err.response?.data?.message || "Đặt lại mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ marginTop: "80px" }}
    >
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Đặt lại mật khẩu</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="otp">
            <Form.Label>OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập mã OTP"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>Mật khẩu mới</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Đặt lại mật khẩu"
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ResetPassword;
