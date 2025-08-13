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
  contactLabels: {}, 
  hasFetched: false,
};

// Existing Thunks
export const fetchLabels = createAsyncThunk("labels/fetch", async () => {
  return await labelService.getLabels();
});

export const addLabel = createAsyncThunk("labels/add", async (data) => {
  return await labelService.createLabel(data);
});

// New Thunk for toggling label assignment to contacts
export const toggleLabelForContact = createAsyncThunk(
  "labels/toggleForContact",
  async ({ contactId, labelId, isSelected }) => {
    // Call your API to assign/unassign label to contact
    const response = await contactService.toggleContactLabel({
      contactId,
      labelId,
      isSelected
    });
    return { contactId, labelId, isSelected, ...response };
  }
);

// New Thunk to fetch contact labels (if needed separately)
export const fetchContactLabels = createAsyncThunk(
  "labels/fetchContactLabels",
  async (contactId) => {
    const labels = await contactService.getContactLabels(contactId);
    return { contactId, labels };
  }
);

const labelSlice = createSlice({
  name: "label",
  initialState: initialState,

  reducers: {
    // Synchronous action for instant UI updates
    toggleLabelSelection: (state, action) => {
      const { contactId, labelId, isSelected } = action.payload;
      
      if (!state.contactLabels[contactId]) {
        state.contactLabels[contactId] = [];
      }
      
      if (isSelected) {
        // Add label to contact
        if (!state.contactLabels[contactId].includes(labelId)) {
          state.contactLabels[contactId].push(labelId);
        }
      } else {
        // Remove label from contact
        state.contactLabels[contactId] = state.contactLabels[contactId].filter(
          id => id !== labelId
        );
      }
    },

    // Set contact labels (useful for initialization)
    setContactLabels: (state, action) => {
      const { contactId, labelIds } = action.payload;
      state.contactLabels[contactId] = labelIds;
    },

    // Clear contact labels when needed
    clearContactLabels: (state, action) => {
      const { contactId } = action.payload;
      delete state.contactLabels[contactId];
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLabels.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchLabels.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
        state.hasFetched = true;
      })
      .addCase(fetchLabels.rejected, (state) => {
        state.status = STATUSES.ERROR;
        state.hasFetched = true;
      })

      .addCase(addLabel.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // New cases for label toggling
      .addCase(toggleLabelForContact.pending, (state, action) => {
        // Optimistic update already done by synchronous action
        // This ensures the change persists during API call
        const { contactId, labelId, isSelected } = action.meta.arg;
        
        if (!state.contactLabels[contactId]) {
          state.contactLabels[contactId] = [];
        }
        
        if (isSelected) {
          if (!state.contactLabels[contactId].includes(labelId)) {
            state.contactLabels[contactId].push(labelId);
          }
        } else {
          state.contactLabels[contactId] = state.contactLabels[contactId].filter(
            id => id !== labelId
          );
        }
      })

      .addCase(toggleLabelForContact.fulfilled, (state, action) => {
        // API call successful - state should already be correct from pending
        // Optional: sync with server response if needed
        const { contactId, labelId, isSelected } = action.payload;
        // Trust the optimistic update unless server returns different state
      })

      .addCase(toggleLabelForContact.rejected, (state, action) => {
        // Revert the optimistic update on failure
        const { contactId, labelId, isSelected } = action.meta.arg;
        
        if (state.contactLabels[contactId]) {
          if (isSelected) {
            // Remove the label that failed to be added
            state.contactLabels[contactId] = state.contactLabels[contactId].filter(
              id => id !== labelId
            );
          } else {
            // Re-add the label that failed to be removed
            if (!state.contactLabels[contactId].includes(labelId)) {
              state.contactLabels[contactId].push(labelId);
            }
          }
        }
      })

      .addCase(fetchContactLabels.fulfilled, (state, action) => {
        const { contactId, labels } = action.payload;
        state.contactLabels[contactId] = labels.map(label => label.id);
      });
  },
});

export const { 
  toggleLabelSelection, 
  setContactLabels, 
  clearContactLabels 
} = labelSlice.actions;

export default labelSlice.reducer;

// Selectors for easy access
export const selectContactLabels = (state, contactId) => 
  state.label.contactLabels[contactId] || [];

export const selectIsLabelAssigned = (state, contactId, labelId) => 
  state.label.contactLabels[contactId]?.includes(labelId) || false;