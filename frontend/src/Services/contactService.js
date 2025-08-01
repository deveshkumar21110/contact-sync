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

    addContact : async (data) => {
        try {
            const response = await api.post("/api/v1/contact/add",data);
            return response.data;
        } catch (error) {
            console.log("Error in adding contact: " , error)
            throw error;
        }
    },

    updateContact : async (data) => {
        try {
            const response = await api.post("/api/v1/contact/update",data);
            return response.data;
        } catch (error) {
            console.log("Error in updating contact: ", error)
            throw error;
        }
    }
    
}