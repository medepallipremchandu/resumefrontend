import React, { useState } from "react";

import { uploadJobDescription, uploadResumes, processResumes, downloadResume } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../components/ResumeMatcher.css";
// import axios from "axios";

const ResumeMatcher = () => {
  const [jobFile, setJobFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);

  const API_URL = "http://127.0.0.1:8000/api";
  
  const handleJobFileChange = (event) => {
    setJobFile(event.target.files[0]);
  };

  const handleResumeFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleJobUpload = async () => {
    if (!jobFile) return toast.error("Please select a job description file");

    try {
      await uploadJobDescription(jobFile);
      toast.success("Job description uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload job description");
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return toast.error("Please select a ZIP file of resumes");

    try {
      await uploadResumes(resumeFile);
      toast.success("Resumes uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload resumes");
    }
  };

  const handleProcessResumes = async () => {
    setProcessing(true);
    setResults([]);

    try {
      const response = await processResumes();
      setResults(response.data.resumes);
      toast.success("Resume processing complete");
    } catch (error) {
      toast.error("Error processing resumes");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await downloadResume(filename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  

  return (
    <div className="container">
      <ToastContainer />
      <h2>Resume Matcher</h2>

      <div className="upload-section">
        <h4>Upload Job Description</h4>
        <input type="file" accept=".docx" onChange={handleJobFileChange} />
        <button onClick={handleJobUpload}>Upload</button>
      </div>

      <div className="upload-section">
        <h4>Upload Resumes (ZIP)</h4>
        <input type="file" accept=".zip" onChange={handleResumeFileChange} />
        <button onClick={handleResumeUpload}>Upload</button>
      </div>

      <div className="process-section">
        <button onClick={handleProcessResumes} disabled={processing}>
          {processing ? "Processing..." : "Start Matching"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="results-section">
          <h3>Matching Results</h3>
          <table>
            <thead>
              <tr>
                {/* <th>Company</th> */}
                <th>Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Filename</th>
                <th>Similarity (%)</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, index) => (
                <tr key={index}>
                  {/* <td>{res.company}</td> */}
                  <td>{res.name}</td>
                  <td>{res.email}</td>
                  <td>{res.phone_number}</td>
                  <td>{res.filename}</td>
                  <td>{res.match_percentage}</td>
                  <td>
                    <button onClick={() => handleDownload(res.filename)}>Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ResumeMatcher;