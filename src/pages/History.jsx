import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Card } from "react-bootstrap";
import axios from "axios";
import URL from "../components/API";

const History = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")); // bạn nhớ set userId khi login nhé
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

        setHistories(response.data.data || []);
      } catch (err) {
        setError("Không thể tải lịch sử!");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Container style={{ marginTop: "80px" }}>
      <Card className="p-4 shadow-lg">
        <h3 className="mb-4 text-center">Lịch sử kiểm tra URL</h3>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && histories?.length === 0 && (
          <Alert variant="info">Chưa có lịch sử nào</Alert>
        )}

        {!loading && histories?.length > 0 && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                <th>IP</th>
                <th>User Agent</th>
                <th>Kết quả Google</th>
                <th>Kết quả VirusTotal</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {histories?.map((h, index) => (
                <tr key={h.id}>
                  <td>{index + 1}</td>
                  <td>{h.url}</td>
                  <td>{h.ipAddress}</td>
                  <td style={{ maxWidth: "200px", wordBreak: "break-word" }}>
                    {h.userAgent}
                  </td>
                  <td>{h.googleSafeBrowsing}</td>
                  <td>{h.virusTotal?.malicious ? "Nguy hiểm" : "An toàn"}</td>
                  <td>{new Date(h.createdAt).toLocaleString()}</td>
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
