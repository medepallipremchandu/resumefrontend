import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const uploadJobDescription = (file) => {
  let formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_URL}/upload-job-description/`, formData);
};

export const uploadResumes = (file) => {
  let formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_URL}/upload-resumes/`, formData);
};

export const processResumes = () => {
  return axios.get(`${API_URL}/process-resumes/`);
};

export const downloadResume = (filename) => {
  return axios.get(`${API_URL}/download_resume/${filename}/`, {
    responseType: "blob",
  });
};