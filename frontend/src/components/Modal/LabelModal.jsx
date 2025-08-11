import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import LabelIcon from "@mui/icons-material/Label";
import { LabelOutlined } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { fetchLabels, addLabel, toggleLabelSelection, STATUSES } from "../../redux/labelSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useCallback } from "react";

export default function LabelModal({
  anchorEl,
  open,
  handleClose,
  register,
  setValue,
  contactId, // Added missing contactId prop
}) {
  const id = open ? "simple-popover" : undefined;

  const [selectedLabels, setSelectedLabels] = useState([]);

  const dispatch = useDispatch();
  const { data: labels, status } = useSelector((state) => state.label);

  useEffect(() => {
    if (labels.length === 0 && status === STATUSES.IDLE) {
      dispatch(fetchLabels());
    }
  }, [dispatch, labels.length, status]);

  // Fixed: Proper label selection handler
  const handleSelectedLabel = useCallback(
    (labelId) => {
      // Update local state for instant UI feedback
      setSelectedLabels(prev => {
        const isSelected = prev.includes(labelId);
        if (isSelected) {
          return prev.filter(id => id !== labelId);
        } else {
          return [...prev, labelId];
        }
      });

      // Dispatch proper action for label toggle
      dispatch(toggleLabelSelection({ 
        contactId, 
        labelId,
        isSelected: !selectedLabels.includes(labelId)
      }));

      // Update form value if using react-hook-form
      if (setValue) {
        setValue('labels', selectedLabels.includes(labelId) 
          ? selectedLabels.filter(id => id !== labelId)
          : [...selectedLabels, labelId]
        );
      }
    },
    [dispatch, contactId, selectedLabels, setValue]
  );

  const handleCreateLabel = useCallback(() => {
    // Handle label creation
    const labelName = prompt("Enter label name:");
    if (labelName?.trim()) {
      dispatch(addLabel({ name: labelName.trim() }));
    }
  }, [dispatch]);

  if (status === STATUSES.LOADING) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transitionDuration={200}
      disableAutoFocus
      disableEnforceFocus
    >
      <div className="w-64 max-h-64 overflow-y-auto p-3 bg-gray-100 text-gray-700 font-normal">
        <div className="pb-3 text-sm font-medium">Manage labels</div>
        <div className="flex-col">
          {labels.map((label, index) => {
            const isSelected = selectedLabels.includes(label.id);
            
            return (
              <button
                key={label.id || index}
                onClick={() => handleSelectedLabel(label.id)} // ✅ Pass labelId
                className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-200 text-left ${
                  isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`} // ✅ Visual feedback for selection
              >
                <LabelOutlined
                  sx={{ 
                    backgroundColor: "transparent",
                    color: isSelected ? 'blue' : 'inherit' // ✅ Selected state styling
                  }}
                  fontSize="small"
                />
                <span className={`text-sm font-medium ${
                  isSelected ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {label.name || label} {/* Handle both object and string labels */}
                </span>
              </button>
            );
          })}
          
          {/* Hidden input for form integration */}
          <input 
            type="hidden" 
            value={selectedLabels.join(',')} 
            {...(register && register('labels'))}
          />
        </div>
        
        <div className="border-t border-t-gray-300 p-1">
          <button 
            onClick={handleCreateLabel}
            className="text-sm font-medium rounded-sm text-gray-900 flex px-2 py-1 items-center hover:bg-gray-200 w-full"
          >
            <span className="pr-4 text-xl">+</span>
            Create label
          </button>
        </div>
      </div>
    </Popover>
  );
}