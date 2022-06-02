import axios from "axios";
import { apiUrl } from "./config"

const httpClient = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json"
    }
});

export default httpClient;