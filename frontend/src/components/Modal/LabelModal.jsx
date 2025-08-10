import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import LabelIcon from "@mui/icons-material/Label";
import { LabelOutlined } from "@mui/icons-material";
import { fetchLabels, addLabels, STATUSES } from "../redux/labelSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function LabelModal({
  anchorEl,
  open,
  handleClose,
  register,
  setValue,
}) {
  const id = open ? "simple-popover" : undefined;

  const [selectedLabels, setSelectedLabels] = useState([]);

  const dispatch = useDispatch();
  const {data: labels, status} = useSelector((state) => state.label);
  
  useEffect(() => {
    if(labels.length === 0 || status === STATUSES.IDLE) {
      dispatch(fetchLabels());
    }
  },[dispatch,labels,status])

  const handleSelectedLabel = async

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
          {labels.map((label, index) => (
            <button
              key={index}
              onClick={handleSelectedLabel}
              className=" w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-200 text-left"
            >
              <LabelOutlined sx={{backgroundColor:"transparent"}} fontSize="small" />
              <span className="text-sm text-gray-900 font-medium">{label}</span>
            </button>
          ))}
          <input 
            type="hidden"
            value={}
          />
        </div>
        <div className="border-t border-t-gray-300 p-1 ">
            <button className="text-sm font-medium rounded-sm text-gray-900 flex px-2 py-1 items-center hover:bg-gray-200 w-full ">
                <span className="pr-4 text-xl">+</span>
                Create label
            </button>
        </div>
      </div>
    </Popover>
  );
}
