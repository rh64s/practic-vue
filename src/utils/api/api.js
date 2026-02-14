// const API = import.meta.env.VUE_APP_API;
//
// export const loginRequest = (user) => {
//   return new Promise ((resolve, reject) => {
//     fetch(`${API}/login`, {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(user),
//     })
//       .then((response) => response.json())
//       .then((result) => resolve(result.data.user_token))
//       .catch((error) => reject(error));
//   });
// }
import axios from 'axios';

const ApiStatus= {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === ApiStatus.UNAUTHORIZED) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  })
