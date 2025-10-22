import { moveToTrash } from "../redux/contactSlice";
import api from "../api/api";

export const contactService = {
  getContacts: async () => {
    try {
      const response = await api.get("/api/v1/contact/all");
      // console.log("Contact Response: "+ response);
      return response.data;
    } catch (error) {
      console.log("Error fetching contacts: ", error);
      throw error;
    }
  },
  getContactsPreview: async () => {
    try {
      const response = await api.get("/api/v1/contact/preview/all");
      // console.log("Contact Response: "+ response);
      return response.data;
    } catch (error) {
      console.log("Error fetching contacts: ", error);
      throw error;
    }
  },
  getContactById: async (id) => {
    try {
      const response = await api.get(`/api/v1/contact/${id}`);
      console.log("Person Response: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Error fetching person: ", error);
      throw error;
    }
  },

  addContact: async (data) => {
    try {
      const response = await api.post("/api/v1/contact/add", data);
      return response.data;
    } catch (error) {
      console.log("Error in adding contact: ", error);
      throw error;
    }
  },

  updateContact: async (data) => {
    try {
      const response = await api.post("/api/v1/contact/update", data);
      return response.data;
    } catch (error) {
      console.log("Error in updating contact: ", error);
      throw error;
    }
  },

  deleteContact: async (contact) => {
    try {
      const response = await api.delete(`/api/v1/contact/${contact.id}`);
      return response.data;
    } catch (error) {
      console.log("Error in deleting contact: ", error);
      throw error;
    }
  },

  moveToTrash: async(contactId) => {
    try {
      const response = await api.post(`/api/v1/contact/moveToTrash/${contactId}`);
      return response.data;
    } catch (error) {
      console.log("Error in moving to trash: ",error);
      throw error;
    }
  },

  recoverContact: async(contactId) => {
    try {
      const response = await api.post(`/api/v1/contact/restore/${contactId}`);
      return response.data;
    } catch (error) {
      console.log("Error in recovering the contact");
      throw error;
    }
  },

  toggleFavourite: async (contactId, newFavoriteStatus) => {
    try {
      const response = await api.patch(
        `/api/v1/contact/${contactId}/favourite`,
        {
          isFavourite: newFavoriteStatus,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling favourite: ", error);
      throw error;
    }
  },
  updateLabels: async (contactId, labels) => {
    try {
      const response = await api.put(
        `/api/v1/contact/label/update/${contactId}`,
        labels
      );
      return response.data;
    } catch (error) {
      console.log("Error in updating labels:", error);
      throw error;
    }
  },
};
