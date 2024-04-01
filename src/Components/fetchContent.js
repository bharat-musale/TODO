import axios from 'axios';

export const fetchContent = async () => {
    try {
      const response = await axios.get('http://localhost:8080/data');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };