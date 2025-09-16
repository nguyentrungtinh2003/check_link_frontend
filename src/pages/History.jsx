import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Spinner,
  Alert,
  Card,
  Badge,
  Button,
  Form,
} from "react-bootstrap";
import axios from "axios";
import URL from "../components/API";

const History = () => {
  const [histories, setHistories] = useState([]);
  const [rawHistories, setRawHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cellStyle = {
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  const fetchHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setError("Bạn chưa đăng nhập !");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.get(`${URL}/history/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const historyData = response.data.data;
      const history = historyData.reverse();

      setRawHistories(history || []);
      setHistories(history || []);
    } catch (err) {
      setError("Không thể tải lịch sử, vui lòng thử lại sau 30 giây !");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (!query) {
      setHistories(rawHistories);
    }

    const filteredHistories = rawHistories.filter((history) =>
      history.urlCheck.toLowerCase().includes(query.toLowerCase())
    );
    setHistories(filteredHistories);
  }, [query]);

  const deleteHistory = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá lịch sử này ?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${URL}/history/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchHistory();
    } catch (error) {
      setError("Không thể xoá lịch sử, vui lòng thử lại sau 30 giây !");
    }
  };

  return (
    <Container style={{ marginTop: "80px" }}>
      <Card
        className="p-4 shadow-lg"
        style={{ maxHeight: "550px", overflowY: "auto" }}
      >
        <h3 className="mb-4 text-center">Lịch sử kiểm tra URL</h3>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && histories?.length === 0 && (
          <Alert variant="info">Không có lịch sử nào</Alert>
        )}

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
            <Form.Label>Tìm kiếm</Form.Label>
            <Form.Control
              type="search"
              name="search"
              placeholder="Nhập URL cần tìm..."
              value={query}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>

        {!loading && histories?.length > 0 && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                {/* <th>IP</th>
                <th>User Agent</th> */}
                <th>Google Safe Browsing</th>
                <th>VirusTotal PhishTank</th>
                <th>Thời gian</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {histories?.map((h, index) => (
                <tr key={h.id}>
                  <td>{index + 1}</td>
                  <td style={cellStyle} title={h.urlCheck}>
                    {h.urlCheck}
                  </td>
                  {/* <td style={cellStyle} title={h.ipAddress}>
                    {h.ipAddress}
                  </td>
                  <td
                    style={{ maxWidth: "200px", wordBreak: "break-word" }}
                    title={h.userAgent}
                  >
                    {h.userAgent}
                  </td> */}
                  <td style={cellStyle} title={h.googleSafeBrowsing}>
                    {h.googleSafeBrowsing}
                  </td>
                  <td
                    style={cellStyle}
                    title={h.virusTotal?.malicious ? "Nguy hiểm" : "An toàn"}
                  >
                    <Badge bg={h.virusTotal?.malicious ? "danger" : "success"}>
                      {h.virusTotal?.malicious ? "Nguy hiểm" : "An toàn"}
                    </Badge>
                  </td>
                  <td
                    style={cellStyle}
                    title={new Date(h.createdAt).toLocaleString()}
                  >
                    {new Date(h.createdAt).toLocaleString()}
                  </td>
                  <td style={cellStyle}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteHistory(h.id)}
                    >
                      Xoá
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
};

export default History;
