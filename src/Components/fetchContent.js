import axios from "axios";

export const fetchContent = async () => {
  try {
    const response = await axios.get("https://todo-xwvz.onrender.com/data");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
