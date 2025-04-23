import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Auth APIs
export const loginUser = async (username, password, role) => {
  try {
    console.log(`Sending login request to: ${API_URL}/auth/login`);
    console.log('Login payload:', { username, password, role });
    
    const response = await api.post('/auth/login', { 
      username, 
      password, 
      role: role.toUpperCase() // Ensure role is uppercase to match backend expectations
    });
    
    console.log('Login API response status:', response.status);
    console.log('Login API response headers:', response.headers);
    console.log('Login API response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error("Login failed details:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    throw error.response?.data || { message: 'Login failed. Server may be unavailable.' };
  }
};

// Student APIs
export const getAllStudents = async () => {
  try {
    const response = await api.get('/students');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch students' };
  }
};

export const getStudentById = async (id) => {
  try {
    const response = await api.get(`/students/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch student' };
  }
};

export const getStudentByUserId = async (userId) => {
  try {
    const response = await api.get(`/students/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch student' };
  }
};

export const createStudent = async (studentData) => {
  try {
    const response = await api.post('/students', studentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create student' };
  }
};

export const updateStudent = async (id, studentData) => {
  try {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update student' };
  }
};

export const deleteStudent = async (id) => {
  try {
    await api.delete(`/students/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete student' };
  }
};

// Attendance APIs
export const getStudentAttendance = async (studentId) => {
  try {
    const response = await api.get(`/attendance/student/${studentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch attendance' };
  }
};

export const markAttendance = async (attendanceData) => {
  try {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to mark attendance' };
  }
};

// Marks APIs
export const getStudentMarks = async (studentId) => {
  try {
    const response = await api.get(`/marks/student/${studentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch marks' };
  }
};

export const addMarks = async (marksData) => {
  try {
    const response = await api.post('/marks', marksData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add marks' };
  }
};

// Course APIs
export const getAllCourses = async () => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch courses' };
  }
};

export async function createCourse(courseData) {
  try {
    const response = await api.post('/courses', courseData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create course');
  }
}

// Admin APIs
export const createAdmin = async (adminData) => {
  try {
    const response = await api.post('/auth/register/admin', adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create admin user' };
  }
};