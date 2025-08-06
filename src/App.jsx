import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaFilePdf,
  FaFileArchive,
  FaFileAlt,
  FaFileImage,
  FaFileVideo,
  FaFile,
  FaTrashAlt,
} from "react-icons/fa";

import "./App.css"; // 👈 External CSS

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

  const handleDelete = async (filename) => {
    const confirmDelete = window.confirm(`Delete ${filename}?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BACKEND_URL}/delete/${filename}`);
      setUploadedFiles((prev) =>
        prev.filter((file) => file.filename !== filename)
      );
      alert("File deleted");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete");
    }
  };

  return (
    <div className="container">
      <h1 className="title">📁 File Upload System</h1>

      <div className="upload-box">
        <input type="file" onChange={handleFileChange} />
        <br />
        <button onClick={handleUpload} className="upload-btn">
          Upload
        </button>
      </div>

      <h2 className="sub-title">Uploaded Files</h2>

      <div className="grid">
        {uploadedFiles.map((file, index) => {
          const { filename, url } = file;
          const ext = filename?.split(".").pop().toLowerCase();
          const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);
          const isVideo = ["mp4", "webm"].includes(ext);

          return (
            <div key={index} className="card">
              {isImage ? (
                <img src={url} alt={filename} className="media" />
              ) : isVideo ? (
                <video src={url} controls className="media" />
              ) : (
                fileTypeIcon(filename)
              )}

              <div className="filename">{filename}</div>

              <a href={url} target="_blank" rel="noreferrer" className="link">
                Download
              </a>

              <button
                className="delete-btn"
                onClick={() => handleDelete(filename)}
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
