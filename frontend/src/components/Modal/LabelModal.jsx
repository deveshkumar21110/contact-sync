import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popover from "@mui/material/Popover";
import { CircularProgress, TextField, Checkbox } from "@mui/material";
import { LabelOutlined, Add } from "@mui/icons-material";
import { fetchLabels, addLabel, STATUSES } from "../../redux/labelSlice";

export default function LabelModal({
  anchorEl,
  open,
  handleClose,
  control,      
  setValue,     
  watch,
}) {
  const dispatch = useDispatch();
  const { data: labels, status,hasFetched } = useSelector((state) => state.label);
  
  const [newLabelName, setNewLabelName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Watch the current form value for labels
  const currentLabels = watch("labels") || [];

  // Load labels on mount
  useEffect(() => {
    if (!hasFetched && status === STATUSES.IDLE) {
      dispatch(fetchLabels());
    }
  }, [dispatch, hasFetched, status]);

  // Handle label selection toggle
  const handleLabelToggle = (labelId) => {
    const isCurrentlySelected = currentLabels.some(label => 
      typeof label === 'object' ? label.id === labelId : label === labelId
    );

    let updatedLabels;
    if (isCurrentlySelected) {
      // Remove label
      updatedLabels = currentLabels.filter(label => 
        typeof label === 'object' ? label.id !== labelId : label !== labelId
      );
    } else {
      // Add label - store as object with id and name for easier handling
      const labelToAdd = labels.find(l => l.id === labelId);
      updatedLabels = [...currentLabels, { id: labelId, name: labelToAdd.name }];
    }

    setValue("labels", updatedLabels, { shouldValidate: true });
  };

  // Create new label
  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;
    
    setIsCreating(true);
    try {
      const result = await dispatch(addLabel({ name: newLabelName.trim() })).unwrap();
      setNewLabelName("");
      
      // Auto-select the newly created label
      const newLabel = { id: result.id, name: result.name };
      const updatedLabels = [...currentLabels, newLabel];
      setValue("labels", updatedLabels, { shouldValidate: true });
    } catch (error) {
      console.error("Failed to create label:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateLabel();
    }
  };

  // Check if a label is selected
  const isLabelSelected = (labelId) => {
    return currentLabels.some(label => 
      typeof label === 'object' ? label.id === labelId : label === labelId
    );
  };

  if (status === STATUSES.LOADING) {
    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <div className="flex justify-center items-center p-8">
          <CircularProgress size={24} />
        </div>
      </Popover>
    );
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <div className="w-72 max-h-80 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900">Select Labels</h3>
        </div>

        {/* Labels List */}
        <div className="max-h-48 overflow-y-auto">
          {labels.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No labels yet. Create your first label below.
            </div>
          ) : (
            labels.map((label) => (
              <div
                key={label.id}
                className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleLabelToggle(label.id)}
              >
                <LabelOutlined 
                  className="mx-2 text-gray-800" 
                  fontSize="small" 
                />
                <span className="text-sm text-gray-700 flex-1">
                  {label.name}
                </span>
                <Checkbox
                  checked={isLabelSelected(label.id)}
                  onChange={() => handleLabelToggle(label.id)}
                  size="small"
                  color="primary"
                />
              </div>
            ))
          )}
        </div>

        {/* Create New Label */}
        <div className="border-t bg-gray-50 px-4 py-3">
          <div className="flex items-center space-x-2">
            <TextField
              size="small"
              placeholder="Create new label"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isCreating}
              sx={{ flexGrow: 1 }}
            />
            <button
              type="button"
              onClick={handleCreateLabel}
              disabled={!newLabelName.trim() || isCreating}
              className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Add fontSize="small" />
              )}
            </button>
          </div>
        </div>

        {/* Selected Count */}
        {/* {currentLabels.length > 0 && (
          <div className="px-4 py-2 bg-blue-50 border-t text-xs text-blue-600">
            {currentLabels.length} label{currentLabels.length !== 1 ? 's' : ''} selected
          </div>
        )} */}
      </div>
    </Popover>
  );
}