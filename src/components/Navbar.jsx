import React, { useEffect, useState } from "react";
import { Navbar, Nav, Dropdown, Container } from "react-bootstrap";
import { toast } from "react-toastify";

function MyNavbar() {
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        setUsername(storedUser.username);
      } else {
        setUser(null);
        setUsername("");
      }
    };

    // Gọi ngay khi mount
    loadUser();

    // Theo dõi khi localStorage thay đổi (ví dụ khi login xong)
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const Logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Đăng xuất thành công!");
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  };

  return (
    <Navbar
      expand="lg"
      bg="primary"
      variant="dark"
      fixed="top"
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand href="/" className="fw-bold fs-4">
          URL Checker
        </Navbar.Brand>

        {/* Nút toggle hiển thị trên mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Phần nội dung co giãn */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {username ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="primary"
                  id="dropdown-basic"
                  className="border-0 bg-transparent p-0"
                >
                  <div className="d-flex align-items-center text-white fw-bold">
                    <img
                      src={
                        user?.img
                          ? "/google-ico.svg"
                          : "https://png.pngtree.com/png-clipart/20230512/original/pngtree-hacker-with-a-laptop-hacking-using-mask-png-image_9158513.png"
                      }
                      alt="avatar"
                      className="me-2 rounded-circle"
                      width={20}
                      height={20}
                    />
                    {username}
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href={`/profile/${user?.id}`}>
                    Thông tin cá nhân
                  </Dropdown.Item>
                  <Dropdown.Item href="/history">
                    Lịch sử kiểm tra URL
                  </Dropdown.Item>
                  {user?.role === "ADMIN" && (
                    <>
                      <Dropdown.Item href="/auth/admin/user">
                        Quản trị người dùng
                      </Dropdown.Item>
                      <Dropdown.Item href="/auth/admin/history">
                        Quản trị lịch sử
                      </Dropdown.Item>
                    </>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-danger" onClick={Logout}>
                    Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <a
                href="/auth/login"
                className="d-flex align-items-center text-white fw-bold text-decoration-none"
              >
                <img
                  src="https://png.pngtree.com/png-clipart/20230512/original/pngtree-hacker-with-a-laptop-hacking-using-mask-png-image_9158513.png"
                  alt="login"
                  className="me-2 rounded-circle"
                  width={40}
                  height={40}
                />
                <span>Đăng nhập</span>
              </a>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
