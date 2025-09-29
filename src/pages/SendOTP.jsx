import React, { useState } from "react";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import URL from "../components/API";
import { toast } from "react-toastify";

const SendOTP = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(`${URL}/auth/send-otp?email=${email}`);
      toast.success("Gửi OTP thành công ! Vui lòng kiểm tra email.");
      setEmail("");
      localStorage.setItem("email-resetpass", email);
      setTimeout(() => {
        window.location.href = "/auth/reset-password";
      }, 3000);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Gửi OTP thất bại, vui lòng thử lại sau !"
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
        <h3 className="text-center mb-4">Gửi OTP</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email"
              className="border rounded-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100 border rounded-4"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Gửi OTP"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default SendOTP;
