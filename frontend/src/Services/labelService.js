import api from "../api/api";

export const labelService = {

    getLabels: async () => {
        try {
            const response = await api.get("/api/v1/label/all");
            return response.data;
        } catch (error) {
            console.error("Error fetching labels: " , error)
            throw error;
        }
    },
    
    createLabel : async (data) => {
        try {
            const response = await api.post("/api/v1/label/add",data);
            return response.data;
        } catch (error) {
            console.error("Error in adding labels: " , error)
            throw error;
        }
    }
}