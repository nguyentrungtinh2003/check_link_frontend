import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import URL from "../components/API";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });

  useEffect(() => {
    if (!id) {
      setLoading(false);
      // Lấy user trong localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        setFormData({
          username: storedUser?.username,
          email: storedUser?.email,
        });
        toast.info(`Xin chào bạn ${storedUser.username}`);
      }
    } else {
      // Lấy user từ API nếu có id trong URL
      setLoading(true);
      axios
        .get(`${URL}/user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          setUser(response.data.data);
          setFormData({
            username: response.data.data.username,
            email: response.data.data.email,
          });
          setLoading(false);
        })
        .catch(() => {
          toast.error("Lỗi khi lấy thông tin người dùng");
          setLoading(false);
        });
    }
  }, [id]);

  // if (!user) {
  //   return <p className="text-center mt-5">Chưa có user</p>;
  // }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-2">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios
      .put(`${URL}/user/update/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        toast.success("Cập nhật thông tin thành công !");
        setIsEditing(false);
        setUser(response.data.data);
      })
      .catch(() => {
        toast.error("Lỗi khi cập nhật thông tin !");
      });
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <Card
        style={{ width: "22rem" }}
        className="shadow-lg border rounded-4 border-2 border-primary"
      >
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
              <Card.Title className="fw-bold fs-4">{user?.username}</Card.Title>
              <Card.Text className="text-muted">{user?.email}</Card.Text>
              <Card.Text className="text-muted">
                Ngày tham gia: {new Date(user?.createdAt).toLocaleString()}
              </Card.Text>
              <Card.Text className="text-muted">
                {user?.active ? "Đang hoạt động" : "Bị vô hiệu hoá"}
              </Card.Text>
              <Card.Text className="text-muted">
                Vai trò: {user?.role}
              </Card.Text>
              <Button
                variant="primary"
                className="border rounded-4"
                onClick={() => setIsEditing(true)}
              >
                Cập nhật
              </Button>
            </>
          ) : (
            <>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    className="border rounded-4"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
              <div className="d-flex justify-content-between">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  className="border rounded-4"
                >
                  Lưu
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setIsEditing(false)}
                  className="border rounded-4"
                >
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
