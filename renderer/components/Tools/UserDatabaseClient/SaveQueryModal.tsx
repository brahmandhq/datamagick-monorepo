import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Modal } from "@nextui-org/react";
import Button from "../../Button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { getSavedQuery } from ".";

export default function SaveQueryModal(props) {
  const {
    open,
    setOpen,
    tabName,
    currentTabId,
    tabs,
    setTabs,
    savedQueryTabs,
    setSavedQueryTabs,
    targetTabId,
    setTargetTabId,
    setTabIds,
    setCurrentTabId,
  } = props;
  console.log(tabs)
  const handleClose = () => {
    setOpen(false);
  };
  const { data } = useSession()
  function deepMerge(target, source) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          typeof source[key] === "object" &&
          !Array.isArray(source[key]) &&
          source[key] !== null
        ) {
          // If the property is an object, merge it recursively
          target[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          // Otherwise, simply assign the value
          target[key] = source[key];
        }
      }
    }
    return target;
  }
  const createSavedQuery = async (updatedTabData, createdBy) => {
    try {
      const response = await axios.post('/api/user/create-savedQuery', { ...updatedTabData, createdBy });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error('Error creating saved query:', error);
      throw new Error('Failed to create saved query');
    }
  };
  const onSubmit = async (e) => {
    setQuery(tabs[targetTabId]?.["query"]);
    await createSavedQuery(tabs[targetTabId], data?.user?.email);
    getSavedQuery(setSavedQueryTabs, data?.user?.email);

    toast.success("Query Saved Successfully");
    handleClose();
  }
  const setQuery = (query) => {
    setSavedQueryTabs((prevTabs) => {
      const updatedTabs = { ...prevTabs };
      if (updatedTabs[currentTabId]) {
        updatedTabs[currentTabId] = deepMerge(
          updatedTabs[currentTabId],
          tabs[currentTabId]
        );
        updatedTabs[currentTabId].query = query;
      } else {
        updatedTabs[currentTabId] = {
          ...tabs[currentTabId],
          query,
        };
      }
      return updatedTabs;
    });
  };

  return (
    <React.Fragment>
      <Modal
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        style={{ background: "#202020" }}
      >
        <Modal.Header>
          <h1
            style={{ color: "white" }}
            className="mb-2 text-2xl font-bold mr-auto tracking-normal text-white"
          >
            Save Query
          </h1>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Modal.Header>
        <Modal.Body className="inline">
          This tab{" "}
          <span className="inline font-semibold">
            {tabName ? tabName : null}
          </span>{" "}
          has unsaved changes which will be lost if you choose to close it. Save
          these changes to avoid losing your work.
        </Modal.Body>
        <Modal.Footer className="flex items-center justify-between">
          <Button
            size="md"
            color="primary"
            className="bg-[#3f3f46]"
            onClick={() => {
              setTabs((currentTabs) => {
                const currentTabsCopy = { ...currentTabs };
                delete currentTabsCopy[targetTabId];

                const newTabIds = Object.keys(currentTabsCopy);
                setTabIds(newTabIds);

                setCurrentTabId((currentTabId) => {
                  if (newTabIds.length === 0) return "";
                  if (currentTabId === targetTabId)
                    return newTabIds[newTabIds.length - 1];
                  return currentTabId;
                });

                return currentTabsCopy;
              });
              handleClose();
            }}
          >
            {`Don't Save`}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              size="md"
              color="primary"
              className="bg-[#3f3f46]"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              size="md"
              type="submit"
              color="primary"
              className="bg-[#0070ef]"
              onClick={onSubmit}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
