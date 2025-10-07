import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Spinner,
  Card,
  Badge,
  Button,
  Form,
  InputGroup,
  Pagination,
} from "react-bootstrap";
import axios from "axios";
import URL from "../components/API";
import { toast } from "react-toastify";
import {
  FaCheck,
  FaTrashAlt,
  FaExclamationTriangle,
  FaSearch,
  FaUndo,
  FaTimes,
  FaPenAlt,
} from "react-icons/fa";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const prevPage = () => page > 0 && setPage(page - 1);
  const nextPage = () => page < totalPages - 1 && setPage(page + 1);

  useEffect(() => {
    fetchUsers();
  }, [page, size]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${URL}/user?keyword=${query}&page=${page}&size=${size}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userData = response.data.data.content;
      setTotalPages(response.data.data.totalPages);
      setPage(response.data.data.pageable.pageNumber);
      setUsers(userData || []);
    } catch (err) {
      toast.error("Không thể lấy danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const toggleDeleteUser = async (id, active) => {
    const confirmMsg = active
      ? "Bạn có chắc muốn vô hiệu hoá người dùng này?"
      : "Bạn có chắc muốn khôi phục người dùng này?";
    const confirmDelete = window.confirm(confirmMsg);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${URL}/user/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        active ? "Vô hiệu hoá thành công!" : "Khôi phục thành công!"
      );
      fetchUsers();
    } catch (error) {
      toast.error("Thao tác thất bại, vui lòng thử lại sau!");
    }
  };

  const cellStyle = {
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <Container style={{ marginTop: "80px" }}>
      <Card
        className="p-4 shadow-lg border rounded-4 border-2 border-primary"
        style={{ maxHeight: "650px", overflowY: "auto" }}
      >
        <h3 className="mb-4 text-center">Danh sách người dùng</h3>

        {loading && (
          <div className="text-center">
            <Spinner variant="primary" animation="border" />
          </div>
        )}

        <Form onSubmit={handleSearch}>
          <InputGroup className="mb-3">
            <Form.Control
              type="search"
              placeholder="Nhập tên hoặc email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border rounded-4"
            />
            <Button
              type="submit"
              variant="primary"
              className="border rounded-4 ms-2"
            >
              <FaSearch />
            </Button>
          </InputGroup>
        </Form>

        {!loading && users?.length > 0 && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Vai trò</th>

                <th>Ngày tham gia</th>
                <th>Ngày cập nhật</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td style={cellStyle} title={u.username}>
                    {u.username}
                  </td>
                  <td style={cellStyle} title={u.email}>
                    {u.email}
                  </td>
                  <td>
                    {u.role === "ADMIN" ? (
                      <Badge bg="primary" className="rounded-4">
                        ADMIN
                      </Badge>
                    ) : (
                      <Badge bg="success" className="rounded-4">
                        USER
                      </Badge>
                    )}
                  </td>
                  <td
                    style={cellStyle}
                    title={new Date(u.createdAt).toLocaleString()}
                  >
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td
                    style={cellStyle}
                    title={new Date(u.updatedAt).toLocaleString()}
                  >
                    {new Date(u.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    {" "}
                    {u.active ? (
                      <Badge bg="success" className="rounded-4">
                        Đang hoạt động
                      </Badge>
                    ) : (
                      <Badge bg="danger" className="rounded-4">
                        Bị vô hiệu hoá
                      </Badge>
                    )}
                  </td>

                  <td>
                    <div className="d-flex">
                      <Button
                        variant="warning"
                        className="rounded-4 m-2"
                        size="sm"
                        href={`/profile/${u.id}`}
                      >
                        <FaPenAlt />
                      </Button>
                      {u.active ? (
                        <Button
                          variant="danger"
                          className="rounded-4 m-2"
                          size="sm"
                          onClick={() => toggleDeleteUser(u.id, u.active)}
                        >
                          <FaTrashAlt />
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          className="rounded-4 m-2"
                          size="sm"
                          onClick={() => toggleDeleteUser(u.id, u.active)}
                        >
                          <FaUndo />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Pagination className="justify-content-center mt-3">
          <Pagination.Prev onClick={prevPage} disabled={page === 0} />
          <Pagination.Item disabled>
            {page + 1} / {totalPages}
          </Pagination.Item>
          <Pagination.Next
            onClick={nextPage}
            disabled={page >= totalPages - 1}
          />
        </Pagination>
      </Card>
    </Container>
  );
};

export default User;
