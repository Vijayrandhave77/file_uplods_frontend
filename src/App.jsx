import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaFilePdf,
  FaFileArchive,
  FaFileAlt,
  FaFileImage,
  FaFileVideo,
  FaFile,
} from "react-icons/fa";

const fileTypeIcon = (fileName) => {
  const ext = fileName?.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
    return <FaFileImage size={40} color="#4caf50" />;
  if (["mp4", "webm", "avi", "mov"].includes(ext))
    return <FaFileVideo size={40} color="#2196f3" />;
  if (["pdf"].includes(ext)) return <FaFilePdf size={40} color="#f44336" />;
  if (["zip", "rar", "7z"].includes(ext))
    return <FaFileArchive size={40} color="#9c27b0" />;
  if (["txt", "doc", "docx"].includes(ext))
    return <FaFileAlt size={40} color="#607d8b" />;
  return <FaFile size={40} color="#000000" />;
};

const App = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/files`);
      setUploadedFiles(res.data || []);
    } catch (err) {
      console.error("Error fetching files", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${BACKEND_URL}/upload`, formData);
      alert("File uploaded successfully");
      setFile(null);
      fetchFiles();
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        📁 File Upload System
      </h1>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "500px",
          margin: "0 auto 40px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <input
          type="file"
          onChange={handleFileChange}
          style={{ marginBottom: "20px" }}
        />
        <br />
        <button
          onClick={handleUpload}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Upload
        </button>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Uploaded Files
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "20px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {uploadedFiles.map((file, index) => {
          const { filename, url } = file;
          const ext = filename?.split(".").pop().toLowerCase();
          const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);
          const isVideo = ["mp4", "webm"].includes(ext);

          return (
            <div
              key={index}
              style={{
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              {isImage ? (
                <img
                  src={url}
                  alt={filename}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              ) : isVideo ? (
                <video
                  src={url}
                  controls
                  style={{
                    width: "100%",
                    height: "120px",
                    borderRadius: "4px",
                  }}
                />
              ) : (
                fileTypeIcon(filename)
              )}

              <div
                style={{
                  marginTop: "10px",
                  fontSize: "13px",
                  wordBreak: "break-word",
                }}
              >
                {filename}
              </div>

              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  marginTop: "5px",
                  fontSize: "12px",
                  color: "#007bff",
                  textDecoration: "none",
                }}
              >
                Download
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
