import axios from "axios";

const instance = axios.create({
	baseURL: "/api/v2/",
	timeout: 5000,
});
export const Get = async (url, params) => {
	try {
		const response = await instance.get(url, { params });
		return response.data;
	} catch (error) {
		return error.message || "error";
	}
};
export const Post = async (url, data) => {
	try {
		const response = await instance.post(url, data);
		return response.data;
	} catch (error) {
		return error.message || "error";
	}
};
