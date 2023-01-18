import axios from 'axios';

export const endpoints = {
    baseURL: 'https://notifications-7fe85.firebaseio.com/',
    files: {
        notificationsJSON: '.json'
    }
} ;

export const axiosInstance = axios.create({
    baseURL: endpoints.baseURL
});
