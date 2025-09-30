import React, { useEffect, useState } from "react";
import axios from "axios";
import URL from "../components/API";
import { toast } from "react-toastify";
import { FaCheck, FaTrashAlt, FaExclamationTriangle } from "react-icons/fa";
import { Badge } from "react-bootstrap";

function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token !== null) {
      toast.info(
        `Xin chào bạn ${
          JSON.parse(localStorage.getItem("user"))?.username || ""
        }`
      );
      console.log(`User: ${localStorage.getItem("token")}`);
    } else {
      toast.info("Vui lòng đăng nhập để sử dụng dịch vụ");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    if (token === null) {
      toast.info("Vui lòng đăng nhập để sử dụng dịch vụ");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${URL}/check?url=${url.trim()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau 30 giây");
        setLoading(false);
        console.log(res);
        return;
      }

      let data = res.data;

      if (typeof data.virusTotal === "string") {
        try {
          data.virusTotal = JSON.parse(data.virusTotal);
        } catch (e) {
          console.error("VirusTotal không parse được JSON:", e);
        }
      }

      setResult(data);
    } catch (err) {
      console.error("Request error:", err);
      toast.error(
        err.response?.data?.message ||
          "Đã xảy ra lỗi. Vui lòng thử lại sau 30 giây"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border border-2 border-primary rounded-4 p-2">
        <div className="card-body">
          {/* Form nhập URL */}
          <form onSubmit={handleSubmit} className="m-4">
            <div className="row g-2">
              <div className="col-12 col-md-9">
                <input
                  type="search"
                  className="form-control border rounded-4"
                  placeholder="Nhập URL cần kiểm tra..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-3 d-grid">
                <button
                  type="submit"
                  className="btn btn-primary border rounded-4"
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Đang kiểm tra...
                    </>
                  ) : (
                    "Kiểm tra"
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Hiển thị lỗi */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Kết quả */}
          {result && (
            <div>
              <h5 className="mb-3 text-primary">
                <i className="bi bi-check-circle-fill me-2"></i>
                Kết quả kiểm tra URL
              </h5>

              {/* Google Safe Browsing */}
              <div className="card border border-primary mb-3 shadow-sm border-1 rounded-4">
                <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
                  <span>
                    <i className="bi bi-shield-lock-fill me-2 text-primary"></i>
                    <strong>Google Safe Browsing</strong>
                  </span>
                  <span>
                    {result.googleSafeBrowsing?.includes("An toàn") ? (
                      <Badge className="border rounded-4 " bg="success">
                        <FaCheck /> An toàn
                      </Badge>
                    ) : (
                      <Badge className="border rounded-4" bg="danger">
                        <FaExclamationTriangle /> Không an toàn
                      </Badge>
                    )}
                  </span>
                </div>
              </div>

              {/* VirusTotal */}
              <div className="card mb-3 shadow-sm border-1 border border-primary rounded-4">
                <div className="card-body">
                  <span>
                    <i className="bi bi-bug-fill me-2 text-danger"></i>
                    <strong>VirusTotal</strong>
                  </span>
                  {(() => {
                    const vt = result.virusTotal;
                    if (!vt || !vt.stats) return <p>Không có dữ liệu</p>;

                    const stats = vt.stats;
                    return (
                      <div className="table-responsive">
                        <table className="table table-hover table-bordered text-center mt-3">
                          <thead className="table-light">
                            <tr>
                              <th>Nguy hiểm</th>
                              <th>Đáng ngờ</th>
                              <th>An toàn</th>
                              <th>Chưa phát hiện</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td
                                className={
                                  stats.malicious > 0
                                    ? "bg-danger text-white"
                                    : ""
                                }
                              >
                                {stats.malicious}{" "}
                              </td>
                              <td
                                className={
                                  stats.suspicious > 0
                                    ? "bg-warning text-black"
                                    : ""
                                }
                              >
                                {stats.suspicious}
                              </td>
                              <td className="bg-success text-white">
                                {stats.harmless}
                              </td>
                              <td>{stats.undetected}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* PhishTank */}
              <div className="card shadow-sm border-1 border border-primary rounded-4">
                <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
                  <span>
                    <i className="bi bi-fish me-2 text-info"></i>
                    <strong>PhishTank</strong>
                  </span>
                  {(() => {
                    const vt = result.virusTotal;
                    if (!vt || !vt.results)
                      return <span>Không có dữ liệu</span>;

                    const res =
                      vt.results["Phishtank"] || vt.results["PhishTank"];
                    if (!res)
                      return "Không có dữ liệu. Vui lòng nhấn nút kiểm tra 1 lần nữa";

                    return (
                      <span
                        className={`badge rounded-pill px-3 py-2 mt-2 mt-md-0 ${
                          res.category === "malicious"
                            ? "bg-danger"
                            : "bg-success"
                        }`}
                      >
                        {res.category === "malicious"
                          ? "Có trong danh sách lừa đảo và giả mạo"
                          : "Không có trong danh sách lừa đảo và giả mạo"}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <small className="m-2 d-block text-center mt-3 text-danger front-bold">
        ⚠️ Mỗi phút bạn chỉ được phép gửi 10 lần
      </small> */}

      <footer className="text-center py-3 m-2 border-top">
        <p className="mb-0">© 2025 Bản quyền thuộc về Trung Tính Dev</p>
      </footer>
    </div>
  );
}

export default Home;
