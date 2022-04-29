import axios from "axios";

const API_URL = process.env.REACT_APP_API_SARK || "http://localhost:4300/api";
let GET_USER_PUBLIC_DETAILS_URL = `${API_URL}/users/`;
export const GetUserPublicInformation = async (id) => {
    GET_USER_PUBLIC_DETAILS_URL=GET_USER_PUBLIC_DETAILS_URL+id;
    const data = await axios.get(GET_USER_PUBLIC_DETAILS_URL);
    return data.data.user;
}