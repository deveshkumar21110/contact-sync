import api from "../api/api"

export const contactService = {


    getContacts: async () =>{
        try{
            const response = await api.get("/api/v1/contact/all");
            return response.data;
        } catch(error){
            console.log("Error fetching contacts: " , error);
            throw error;
        }
    },
    
}