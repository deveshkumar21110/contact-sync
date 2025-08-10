import { labelService } from "../Services/labelService";
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
};

// Thunks

export const fetchLabels = createAsyncThunk("labels/fetch", async () => {
  return await labelService.getLabels();
});

export const addLabel = createAsyncThunk("labels/add", async (data) => {
  return await labelService.createLabel(data);
});

// export const updateContact = createAsyncThunk(
//   "contact/update",
//   async (data) => {
//     return await contactService.updateContact(data);
//   }
// );


const labelSlice = createSlice({
  name: "label",
  initialState: initialState,

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabels.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchLabels.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(fetchLabels.rejected, (state) => {
        state.status = STATUSES.ERROR;
      })

      .addCase(addLabel.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // .addCase(updateContact.fulfilled, (state, action) => {
      //   const updatedContact = action.payload;
      //   const index = state.data.findIndex((c) => c.id === updatedContact.id);
      //   if (index !== -1) {
      //     state.data[index] = updatedContact;
      //   }
      // })

      
      // .addCase(toggleFavourite.pending, (state, action) => {
      //   const { contactId, newFavouriteStatus } = action.meta.arg;
      //   const contact = state.data.find((c) => c.id === contactId);
      //   if (contact) {
      //     contact.isFavourite = newFavouriteStatus; // instant change
      //   }
      // })
      // .addCase(toggleFavourite.rejected, (state, action) => {
      //   const { contactId, newFavouriteStatus } = action.meta.arg;
      //   const contact = state.data.find((c) => c.id === contactId);
      //   if (contact) {
      //     contact.isFavourite = !newFavouriteStatus; // revert if failed
      //   }
      // })
      // .addCase(toggleFavourite.fulfilled, (state, action) => {
      //   // Optional: trust server and re-sync in case of mismatch
      //   const { contactId, newFavouriteStatus } = action.payload;
      //   const contact = state.data.find((c) => c.id === contactId);
      //   if (contact) {
      //     contact.isFavourite = newFavouriteStatus;
      //   }
      // });
  },
});

export const { setContacts, setStatus } = labelSlice.actions;
export default labelSlice.reducer;
