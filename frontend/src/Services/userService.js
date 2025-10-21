import api from "../api/api";
import { authService } from "./authService";

export const userService = {
    getCurrentUserDetails: authService.getCurrentUser,
    updateUserDetails : async (data) => {
        try {
            const response = await api.post("/api/v1/user/update", data)
            
            return response.data;
        } catch (error) {
            console.log("Error in updating your details");
            throw error;
        }
    }
}
