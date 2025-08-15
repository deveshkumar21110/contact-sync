import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const { data: labels, status, hasFetched } = useSelector((state) => state.label);
  
  const [newLabelName, setNewLabelName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const textFieldRef = useRef(null);

  // Watch the current form value for labels
  const currentLabels = watch("labels") || [];

  // Calculate position based on anchor element
  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [open, anchorEl]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        anchorEl && 
        !anchorEl.contains(event.target)
      ) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, handleClose, anchorEl]);

  // Load labels on mount
  useEffect(() => {
    if (!hasFetched && status === STATUSES.IDLE) {
      dispatch(fetchLabels());
    }
  }, [dispatch, hasFetched, status]);

  // Focus text field when modal opens
  useEffect(() => {
    if (open && textFieldRef.current) {
      setTimeout(() => {
        textFieldRef.current?.focus();
      }, 100);
    }
  }, [open]);

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
    if (e.key === "Escape") {
      handleClose();
    }
  };

  // Check if a label is selected
  const isLabelSelected = (labelId) => {
    return currentLabels.some(label => 
      typeof label === 'object' ? label.id === labelId : label === labelId
    );
  };

  if (!open) return null;

  return (
    <div 
      ref={dropdownRef}
      className="fixed bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden"
      style={{
        top: position.top,
        left: position.left,
        width: '288px',
        maxHeight: '320px',
        zIndex: 9999,
      }}
    >
      {status === STATUSES.LOADING ? (
        <div className="flex justify-center items-center p-8">
          <CircularProgress size={24} />
        </div>
      ) : (
        <>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleLabelToggle(label.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Toggle ${label.name} label`}
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
                    tabIndex={-1}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ))
            )}
          </div>

          {/* Create New Label */}
          <div className="border-t bg-gray-50 px-4 py-3">
            <div className="flex items-center space-x-2">
              <TextField
                ref={textFieldRef}
                size="small"
                placeholder="Create new label"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isCreating}
                sx={{ flexGrow: 1 }}
                autoComplete="off"
                inputProps={{
                  'aria-label': 'New label name'
                }}
              />
              <button
                type="button"
                onClick={handleCreateLabel}
                disabled={!newLabelName.trim() || isCreating}
                className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                aria-label="Create new label"
              >
                {isCreating ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Add fontSize="small" />
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}