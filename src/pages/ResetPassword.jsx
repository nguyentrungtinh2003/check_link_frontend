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
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: localStorage.getItem("email-resetpass") || "",
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
      toast.success("Đặt lại mật khẩu thành công !");
      setFormData({ email: "", otp: "", newPassword: "" });
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 3000);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Đặt lại mật khẩu thất bại, vui lòng thử lại sau !"
      );
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
              className="border rounded-4"
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
              className="border rounded-4"
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
                className="border rounded-4"
                value={formData.newPassword}
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
            type="submit"
            className="w-100 border rounded-4"
            disabled={loading}
          >
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
