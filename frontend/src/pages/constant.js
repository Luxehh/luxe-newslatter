let apiUrl = process.env.REACT_APP_API_URL;
if (process.env.REACT_APP_ENV === 'development') {
    apiUrl = 'http://localhost:5000';
}
export { apiUrl };