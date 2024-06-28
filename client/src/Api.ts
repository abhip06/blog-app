import axios from "axios";
import {SERVER_ORIGIN} from "./constants";

const API = axios.create({
    baseURL: SERVER_ORIGIN,
    withCredentials: true
});

export default API;