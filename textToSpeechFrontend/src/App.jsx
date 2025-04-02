import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [audioFilePath, setAudioFilePath] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);
    try {
      // console.log("Sending POST request to /upload with:", file.name);
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response from server:", response.data);
      // console.log("audioFilePath",audioFilePath)
      const correctedPath = response.data.audioFilePath.replace("public/", "");
      setAudioFilePath(correctedPath);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mt-5'>
      <h1 className='text-center'>PDF to Audio Converter</h1>
      <div className='text-center'>
        <input type="file" accept="application/pdf" onChange={handleFileChange} className='form-control my-3' />
        <button 
          className='btn btn-primary' 
          onClick={handleUpload} 
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {audioFilePath && (
        <div className="mt-4 text-center">
          <h4>Conversion Complete! Listen to the Audio:</h4>
          <audio controls>
            {/* <source src={`http://localhost:3000${audioFilePath}`} type="audio/mp3" /> */}
            <source src={`http://localhost:3000/${audioFilePath}`} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default App;
