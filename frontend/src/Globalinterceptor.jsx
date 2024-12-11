import axios from "axios";
import { useNavigate } from "react-router-dom";

const setupAxiosInterceptors = () => {
  const navigate = useNavigate();

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token"); 
        navigate("/signin");
      }
      return Promise.reject(error); 
    }
  );
};

export default setupAxiosInterceptors;
