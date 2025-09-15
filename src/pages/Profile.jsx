import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import URL from "../components/API";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });

  useEffect(() => {
    // Lấy user trong localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        username: storedUser.username,
        email: storedUser.email,
      });
    }
  }, []);

  if (!user) return <p className="text-center mt-5">Chưa có user</p>;

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lưu thay đổi
  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    axios
      .put(`${URL}/user/update/${user.id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("User updated:", response.data);
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật user:", err);
      });

    setIsEditing(false);
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <Card style={{ width: "22rem" }} className="shadow-lg border-0 rounded-3">
        <Card.Img
          variant="top"
          src="https://png.pngtree.com/png-clipart/20230512/original/pngtree-hacker-with-a-laptop-hacking-using-mask-png-image_9158513.png"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            margin: "20px auto",
          }}
        />
        <Card.Body className="text-center">
          {!isEditing ? (
            <>
              <Card.Title className="fw-bold fs-4">{user.username}</Card.Title>
              <Card.Text className="text-muted">{user.email}</Card.Text>
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Cập nhật
              </Button>
            </>
          ) : (
            <>
              <Form>
                {/* <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Form.Group> */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
              <div className="d-flex justify-content-between">
                <Button variant="primary" onClick={handleSave}>
                  Lưu
                </Button>
                <Button variant="danger" onClick={() => setIsEditing(false)}>
                  Huỷ
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Profile;
