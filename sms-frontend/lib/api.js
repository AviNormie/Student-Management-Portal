import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable cookies for all requests
});

// Single request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Try to get user data from localStorage
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      // If we have a token, use Bearer authentication
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } 
      // If we have username/password, use Basic authentication
      else if (userData.username && userData.password) {
        const token = btoa(`${userData.username}:${userData.password}`);
        config.headers.Authorization = `Basic ${token}`;
      }
      
      // Always include credentials for session-based auth as fallback
      config.withCredentials = true;
    } catch (error) {
      console.error('Error in auth interceptor:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add an interceptor to include authentication headers with every request
api.interceptors.request.use(
  (config) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (userData.username) {
      // For Basic Auth, we need to send username and password
      // Since we don't store password in localStorage for security reasons,
      // we'll use the session authentication that Spring Security provides
      
      // Set withCredentials to true to include cookies in cross-site requests
      config.withCredentials = true;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginUser = async (username, password, role) => {
  try {
    const response = await api.post('/auth/login', 
      { username, password, role: role.toUpperCase() }
    );
    
    // Store user data including password for Basic Auth
    const userData = {
      ...response.data,
      password: password // Store password for Basic Auth
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || { message: 'Login failed' };
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

export const getCourseAttendance = async (courseId, date) => {
  try {
    const response = await api.get(`/attendance/course/${courseId}/date`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch course attendance' };
  }
};

export const getClassAttendance = async (classId) => {
  try {
    const response = await api.get(`/attendance/class/${classId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch class attendance' };
  }
};

// Class APIs
export const createClass = async (classData) => {
  try {
    const response = await api.post('/classes', classData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create class' };
  }
};

export const getClassesByCourse = async (courseId) => {
  try {
    const response = await api.get(`/classes/course/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch classes for course' };
  }
};

export const getClassById = async (classId) => {
  try {
    const response = await api.get(`/classes/${classId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch class' };
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
    console.log('Submitting marks data:', marksData);
    const response = await api.post('/marks', marksData);
    return response.data;
  } catch (error) {
    console.error('Error adding marks:', error);
    if (error.response && error.response.data) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw new Error('Failed to add marks');
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
    console.log('Creating course with data:', courseData);
    console.log('Auth token:', localStorage.getItem('token'));
    console.log('User data:', localStorage.getItem('user'));
    
    const response = await api.post('/courses', courseData);
    return response.data;
  } catch (error) {
    console.error('Course creation error:', error);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
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

export const createTeacher = async (teacherData) => {
  try {
    const response = await api.post('/teachers', teacherData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create teacher' };
  }
};