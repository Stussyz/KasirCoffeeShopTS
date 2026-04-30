import { api } from "./api";

export const createTransaction = async (payload: any) => {
    const response = await api.post("/transactions", payload);
    return response.data;
};