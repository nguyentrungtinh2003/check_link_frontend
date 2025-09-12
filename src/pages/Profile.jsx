import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Giả lập user trong localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  if (!user) return <p className="text-center mt-5">Chưa có user</p>;

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
          <Card.Title className="fw-bold fs-4">{user.username}</Card.Title>
          <Card.Text className="text-muted">{user.email}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Profile;
