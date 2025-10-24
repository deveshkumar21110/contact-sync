import { useSnackbar } from "../../index";
import { deleteContact, recoverContact } from "../../redux/contactSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function DeleteRecover({ contact }) {
  let deletedDate = "";
  if (contact?.isDeleted) {
    const dateObj = new Date(contact.deletedAt.replace(" ", "T"));
    deletedDate = dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleDeleteForever = () => {
    dispatch(deleteContact(contact));
    showSnackbar("Deleted", {
      severity: "info",
      autoHideDuration: 2000,
    });
    navigate(-1);
  };
  const handleRecover = () => {
    dispatch(recoverContact(contact.id));
    showSnackbar("Recovering contact...", {
      severity: "info",
      autoHideDuration: 2000,
    });
    navigate(-1);
  };

  return (
    <div className="p-4 mb-4 bg-gray-100 md:h-2/4 md:w-2/5 rounded-3xl mt-4">
      <div className="flex flex-col  ">
        <div className="text-lg font-medium">Why in Trash?</div>

        <div className="text-gray-800">Deleted in Contact Sync (web)</div>
        {deletedDate && (
          <div className=" text-sm text-gray-800">{deletedDate}</div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <div
          onClick={() => handleDeleteForever()}
          className="text-blue-600 text-base text-center font-medium px-4 py-2 cursor-pointer hover:bg-blue-100 rounded-lg"
        >
          Delete forever
        </div>
        <div
          onClick={() => handleRecover()}
          className="text-blue-600 text-base font-medium px-4 py-2 cursor-pointer hover:bg-blue-100 rounded-lg"
        >
          Recover
        </div>
      </div>
    </div>
  );
}

export default DeleteRecover;
