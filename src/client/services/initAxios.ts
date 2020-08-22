import axios from "axios"

const port = process.env.SERVER_PORT || 5000;
const url = process.env.HOST_URL || "http://localhost" + port + "/api";

export default () => {
    return axios.create({
        baseURL: url,
        withCredentials: false,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    })
}