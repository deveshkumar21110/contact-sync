import api from "../api/api"

export const contactService = {


    getContacts: async () =>{
        try{
            const response = await api.get("/api/v1/contact/all");
            // console.log("Contact Response: "+ response);
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
    },

    toggleFavourite: async (contactId,newFavoriteStatus) => {
        try {
            const response = await api.patch(`/api/v1/contact/${contactId}/favourite`,
                {
                    isFavourite: newFavoriteStatus
                }
            )
            return response.data;
        } catch (error) {
            console.error('Error toggling favourite: ' , error);
            throw error;
        }
    }
    
}