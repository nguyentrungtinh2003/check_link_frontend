import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Card, Badge } from "react-bootstrap";
import axios from "axios";
import URL from "../components/API";

const History = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cellStyle = {
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  useEffect(() => {
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

        setHistories(history || []);
      } catch (err) {
        setError("Không thể tải lịch sử !");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Container
      style={{ marginTop: "80px", maxHeight: "80vh", overflowY: "auto" }}
    >
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
          <Alert variant="info">Chưa có lịch sử nào</Alert>
        )}

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
