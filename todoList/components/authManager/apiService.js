import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.37:8000/api'; // replace with your backend's API URL

// Create an instance of axios with common headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an Authorization header to requests if the token is available
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const storeUserData = async (token, username) => {
    await AsyncStorage.setItem('jwt_token', token); // store the token
    await AsyncStorage.setItem('username', username); // store the token
}

// Handle API requests
const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username:username, password:password });
    await storeUserData(response.data.token, username)
    return true; // returns the data from the response
  } catch (error) {
    console.error('Login error', error);
    throw error;
  }
};

const signup = async (username, password) => {
  try {
    const response = await api.post('/auth/register', { username:username, password:password  });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Signup error', error);
    throw error;
  }
};

const getUserData = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error('Get user data error', error);
    throw error;
  }
};

const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwt_token'); // Remove the JWT token
      return true; // Logout success
    } catch (error) {
      console.error('Error during logout:', error);
      return false; // Logout failed
    }
  };

  const createGroup = async (title) => {
    try {
      const response = await api.post('/groups', { title });
      return response.data; // the created group
    } catch (error) {
      console.error('Create group error', error);
      throw error;
    }
  };

  const getGroups = async () => {
    try {
      const response = await api.get('/groups');
      return response.data; // array of groups
    } catch (error) {
      console.error('Get groups error', error);
      throw error;
    }
  };

// Join a group using a group code
const joinGroupByCode = async (code) => {
    try {
      const response = await api.post(`/groups/join/${code}`);
      return response.data; // Contains joined group info
    } catch (error) {
      console.error("Join group error", error.response?.data || error.message);
      throw error;
    }
  };
  
// Add a task to a group
const addTaskToGroup = async (groupId, taskTitle) => {
    try {
      // Step 1: Create the task and add it to the group
      const taskResponse = await api.post('/tasks', { 
        title: taskTitle, 
        groupId: groupId // Pass the groupId to add the task to the correct group
      });
  
      // Return the task data
      return taskResponse.data; // The response will contain the created task
    } catch (error) {
      console.error('Error adding task to group', error);
      throw error;
    }
  };

const getGroupById = async (groupId) => {
    try {
      const response = await api.get(`/groups/${groupId}`);
      return response.data; // Return the group data with tasks
    } catch (error) {
      console.error('Error fetching group by ID', error);
      throw error;
    }
  };
  

export {
    login,
    signup,
    getUserData,
    logout,
    createGroup,
    getGroups,
    joinGroupByCode,
    addTaskToGroup,
    getGroupById
  };
  