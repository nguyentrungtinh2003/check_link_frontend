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
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import URL from "../components/API";
import { toast } from "react-toastify"; // ✅ phải lấy từ react-toastify
import {
  FaCheck,
  FaTrashAlt,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa";
import { Pagination } from "react-bootstrap";
const History = () => {
  const [histories, setHistories] = useState([]);
  const [rawHistories, setRawHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, size]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchHistory();
  };

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
        toast.error("Vui lòng đăng nhập để xem lịch sử");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${URL}/history/user/${user.id}?keyword=${query}&page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const historyData = response.data.data.content;
      setTotalPages(response.data.data.totalPages);
      setPage(response.data.data.pageable.pageNumber);

      setHistories(historyData || []);
    } catch (err) {
      toast.error("Không thể lấy lịch sử, vui lòng thử lại sau 30 giây !");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (!loading && !error && histories?.length === 0) {
      toast.info("Không có lịch sử kiểm tra URL nào");
    }
  }, [loading, error, histories]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  // useEffect(() => {
  //   if (!query) {
  //     setHistories(rawHistories);
  //   }

  //   const filteredHistories = rawHistories.filter((history) =>
  //     history.urlCheck.toLowerCase().includes(query.toLowerCase())
  //   );
  //   setHistories(filteredHistories);
  // }, [query]);

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

      toast.success("Xoá lịch sử thành công !");
      fetchHistory();
    } catch (error) {
      toast.error("Xoá lịch sử thất bại, vui lòng thử lại sau 30 giây!");
    }
  };

  return (
    <Container style={{ marginTop: "80px" }}>
      <Card
        className="p-4 shadow-lg border rounded-4 border-2 border-primary"
        style={{ maxHeight: "650px", overflowY: "auto" }}
      >
        <h3 className="mb-4 text-center">Lịch sử kiểm tra URL</h3>

        {loading && (
          <div className="text-center">
            <Spinner variant="primary" animation="border" />
          </div>
        )}

        {/* {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && histories?.length === 0 && (
          <Alert variant="info">Không có lịch sử nào</Alert>
        )} */}

        <Form>
          <InputGroup className="mb-3">
            <Form.Control
              type="search"
              name="search"
              placeholder="Nhập URL cần tìm..."
              value={query}
              onChange={handleChange}
              className="border rounded-4"
            />
            <Button
              variant="primary"
              onClick={handleSearch}
              className="border rounded-4 ms-2"
            >
              <FaSearch />
            </Button>
          </InputGroup>
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
                    {h.googleSafeBrowsing.includes("An toàn") ? (
                      <Badge className="border rounded-4" bg="success">
                        <FaCheck /> An toàn
                      </Badge>
                    ) : (
                      <Badge className="border rounded-4" bg="danger">
                        <FaExclamationTriangle /> Không an toàn
                      </Badge>
                    )}
                  </td>
                  <td
                    style={cellStyle}
                    title={h.virusTotal?.malicious ? "Nguy hiểm" : "An toàn"}
                  >
                    {h.virusTotal?.malicious ? (
                      <Badge className="border rounded-4" bg="danger">
                        <FaExclamationTriangle /> Không an toàn
                      </Badge>
                    ) : (
                      <Badge className="border rounded-4" bg="success">
                        <FaCheck /> An toàn
                      </Badge>
                    )}
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
                      className="border rounded-4"
                      onClick={() => deleteHistory(h.id)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Pagination className="justify-content-center mt-3">
          <Pagination.Prev onClick={prevPage} disabled={page === 0} />
          <Pagination.Item disabled>{page + 1}</Pagination.Item>
          <Pagination.Next
            onClick={nextPage}
            disabled={page >= totalPages - 1}
          />
        </Pagination>
      </Card>
    </Container>
  );
};

export default History;
