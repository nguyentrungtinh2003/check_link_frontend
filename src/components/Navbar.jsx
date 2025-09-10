import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";

function Navbar() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")); // lấy username từ localStorage
    if (storedUser) {
      setUsername(storedUser.username);
      console.log("Navbar render, username:", storedUser);
    }
  }, []);

  const Logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/auth/login"; // Chuyển hướng đến trang đăng nhập
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-primary bg-primary shadow-sm fixed-top">
      <div className="container d-flex justify-content-between align-items-center">
        <a className="navbar-brand fw-bold fs-4 text-white" href="/">
          URL Checker
        </a>

        <Nav className="ms-auto d-flex align-items-center">
          {username ? (
            <div className="d-flex align-items-center text-white fw-bold">
              <img
                src="https://png.pngtree.com/png-clipart/20230512/original/pngtree-hacker-with-a-laptop-hacking-using-mask-png-image_9158513.png"
                className="me-2"
                width={40}
                height={40}
              />
              {username}
            </div>
          ) : (
            <a
              href="/auth/login"
              className="text-white fw-bold text-decoration-none"
            >
              <img
                src="https://png.pngtree.com/png-clipart/20230512/original/pngtree-hacker-with-a-laptop-hacking-using-mask-png-image_9158513.png"
                className="me-2"
                width={40}
                height={40}
              />
              Đăng nhập
            </a>
          )}
        </Nav>
        <div>
          <button onClick={() => Logout()} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
