// import script from another file
import axios from './axios.js';

const api  = 'https://google.com';

// // try to request test
// axios.get(api)
//     .then((response) => {
//         // console.log(response);
//     })
//     .catch((error) => {
//         // console.error(error);
//     });
const request = {
    get: (url) => {
        return axios.get(`${api}${url}`);
    },
    post: (url, data) => {
        return axios.post(`${api}${url}`, data);
    },
    put: (url, data) => {
        return axios.put(`${api}${url}`, data);
    },
    delete: (url) => {
        return axios.delete(`${api}${url}`);
    }
};
// export default request;