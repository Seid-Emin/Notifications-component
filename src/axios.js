import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://notifications-7fe85.firebaseio.com/'
});

export default instance;