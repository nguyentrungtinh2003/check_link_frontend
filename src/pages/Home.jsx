import React, { useState } from "react";
import axios from "axios";

function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const res = await axios.get(`http://localhost:8081/api/check?url=${url}`);
    if (res.status !== 200) {
      setError(res.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      setLoading(false);
      console.log(res);
      return;
    }
    // Sau khi nhận response từ backend
    let data = res.data;

    // Nếu virusTotal là string, parse sang object
    if (typeof data.virusTotal === "string") {
      try {
        data.virusTotal = JSON.parse(data.virusTotal);
      } catch (e) {
        console.error("VirusTotal không parse được JSON:", e);
      }
    }
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-3">
        <div className="card-body p-4">
          {/* Form nhập URL */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-2">
              <div className="col-12 col-md-9">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập URL cần kiểm tra..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-3 d-grid">
                <button type="submit" className="btn btn-primary">
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
              <h5 className="mb-3 text-success">
                <i className="bi bi-check-circle-fill me-2"></i>
                Kết quả kiểm tra URL
              </h5>

              {/* Google Safe Browsing */}
              <div className="card mb-3 shadow-sm border-0">
                <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
                  <span>
                    <i className="bi bi-shield-lock-fill me-2 text-primary"></i>
                    <strong>Google Safe Browsing</strong>
                  </span>
                  <span
                    className={`badge rounded-pill px-3 py-2 mt-2 mt-md-0 ${
                      result.googleSafeBrowsing?.includes("An toàn")
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {result.googleSafeBrowsing?.includes("An toàn")
                      ? "An toàn"
                      : "Nguy hiểm"}
                  </span>
                </div>
              </div>

              {/* VirusTotal */}
              <div className="card mb-3 shadow-sm border-0">
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
                                  stats.malicious > 0 ? "table-danger" : ""
                                }
                              >
                                {stats.malicious}
                              </td>
                              <td
                                className={
                                  stats.suspicious > 0 ? "table-warning" : ""
                                }
                              >
                                {stats.suspicious}
                              </td>
                              <td className="table-success">
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
              <div className="card shadow-sm border-0">
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
                    if (!res) return "Không có dữ liệu";

                    return (
                      <span
                        className={`badge rounded-pill px-3 py-2 mt-2 mt-md-0 ${
                          res.category === "malicious"
                            ? "bg-danger"
                            : "bg-success"
                        }`}
                      >
                        {res.category === "malicious"
                          ? "Có trong danh sách lừa đảo"
                          : "Không có trong danh sách lừa đảo"}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
