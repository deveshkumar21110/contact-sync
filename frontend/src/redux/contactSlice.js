import { contactService } from "../Services/contactService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

const initialState = {
  data: [],
  status: STATUSES.IDLE,
  hasFetched: false,
  error: null,
};

// Thunks

export const fetchContacts = createAsyncThunk("contact/fetch", async () => {
  return await contactService.getContacts();
});

export const addContact = createAsyncThunk("contact/add", async (data) => {
  return await contactService.addContact(data);
});

export const updateContact = createAsyncThunk(
  "contact/update",
  async (data) => {
    console.log("Payload being sent:", data);
    return await contactService.updateContact(data);
  }
);

export const deleteContact = createAsyncThunk(
  "contact/delete",
  async (contact) => {
    return await contactService.deleteContact(contact);
  }
);

export const toggleFavourite = createAsyncThunk(
  "contact/toggleFavourite",
  async ({ contactId, newFavouriteStatus }) => {
    console.log("PATCH Favourite:", contactId, newFavouriteStatus);
    await contactService.toggleFavourite(contactId, newFavouriteStatus);
    return { contactId, newFavouriteStatus };
  }
);

export const updateContactLabels = createAsyncThunk(
  "contact/updateLabels",
  async ({ contactId, labels }) => {
    const updatedContact = await contactService.updateLabels(contactId, labels);
    return updatedContact; // should return full updated contact from backend
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: initialState,

  reducers: {
    resetContacts: (state) => {
      state.data = [];
      state.status = STATUSES.IDLE;
      state.hasFetched = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
        state.hasFetched = true;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
        state.hasFetched = true;
        state.error = action.error.message || "Failed to fetch contacts";
      })

      .addCase(addContact.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.hasFetched = true;
        state.status = STATUSES.IDLE;
      })
      .addCase(addContact.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
        state.error = action.error.message || "Failed to add contact";
      })
      .addCase(addContact.pending, (state) => {
        state.status = STATUSES.LOADING;
      })

      .addCase(updateContact.fulfilled, (state, action) => {
        const updatedContact = action.payload;
        const index = state.data.findIndex((c) => c.id === updatedContact.id);
        if (index !== -1) {
          state.data[index] = updatedContact;
        }
      })

      .addCase(toggleFavourite.pending, (state, action) => {
        const { contactId, newFavouriteStatus } = action.meta.arg;
        const contact = state.data.find((c) => c.id === contactId);
        if (contact) {
          contact.isFavourite = newFavouriteStatus; // instant change
        }
      })
      .addCase(toggleFavourite.rejected, (state, action) => {
        const { contactId, newFavouriteStatus } = action.meta.arg;
        const contact = state.data.find((c) => c.id === contactId);
        if (contact) {
          contact.isFavourite = !newFavouriteStatus; // revert if failed
        }
      })
      .addCase(toggleFavourite.fulfilled, (state, action) => {
        // Optional: trust server and re-sync in case of mismatch
        const { contactId, newFavouriteStatus } = action.payload;
        const contact = state.data.find((c) => c.id === contactId);
        if (contact) {
          contact.isFavourite = newFavouriteStatus;
        }
      })
      // update contact's label
      .addCase(updateContactLabels.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(updateContactLabels.fulfilled, (state, action) => {
        state.status = STATUSES.IDLE;
        const updatedContact = action.payload;
        const index = state.data.findIndex((c) => c.id === updatedContact.id);
        if (index !== -1) {
          state.data[index] = updatedContact;
        }
      })
      .addCase(updateContactLabels.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
        state.error = action.error.message || "Failed to update contact labels";
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.status = STATUSES.IDLE;
        const deletedContact = action.payload;
        state.data = state.data.filter((c) => c.id !== deletedContact.id);
      })
      .addCase(deleteContact.pending, (state, action) => {
        const deletedContact = action.meta.arg;
        state.data = state.data.filter((c) => c.id !== deletedContact.id);
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
        const deletedContact = action.meta.arg; // full contact
        state.data.push(deletedContact); 
      });
  },
});

export default contactSlice.reducer;

export const selectHasFetched = (state) => state.contact.hasFetched;
export const selectContacts = (state) => state.contact.data;
export const selectFavouriteContacts = (state) =>
  state.contact.data.filter((contact) => contact.isFavourite);
export const selectContactsStatus = (state) => state.contact.status;
export const selectContactById = (state, contactId) =>
  state.contact.data.find((c) => c.id === contactId);
export const { resetContacts } = contactSlice.actions;
