export const interpretationServer = axios.create({
  baseURL: "/interpretation/api",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    "x-access-token": "testing",
  },
});
