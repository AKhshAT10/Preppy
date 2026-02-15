import axiosInstance from '../utils/axiosInstance';
import {API_PATHS} from '../utils/apiPaths';

const login = async (email,password) => {
    try{
       const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password,
       });
       return response.data;
    }catch(error){
       throw error.response?.data || {message: 'an unknown error occured'};
    }
};

const register = async (username,email,password) => {
    try{
       const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
          username,
          email,
          password,
       });
       return response.data;
    }catch(error){
       throw error.response?.data || {message: 'an unknown error occured'};
    }
};

const getProfile = async () => {
    try{
       const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
       return response.data;
    }catch(error){
       throw error.response?.data || {message: 'an unknown error occured'};
    }
};

const updateProfile = async () => {
    try{
       const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
       return response.data;
    }catch(error){
       throw error.response?.data || {message: 'an unknown error occured'};
    }
};

const changePassword = async (passwords) => {
    try{
       const response = await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD,passwords);
       return response.data;
    }catch(error){
       throw error.response?.data || {message: 'an unkown error occured'};
    }
};

const authService = {
    login,register,getProfile,updateProfile,changePassword
};

export default authService;