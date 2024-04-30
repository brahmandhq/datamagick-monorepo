import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Button, Modal } from "@nextui-org/react";
import * as z from "zod";

import { toast } from "react-toastify";
import Input from "@/components/Input";
import { Edit } from "@mui/icons-material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { getSavedQuery } from ".";

const formSchema = z.object({
  name: z.string(),
});

export default function EditTabNameModal(props) {
  const {
    tabs,
    setTabs,
    savedQueryTabs,
    setSavedQueryTabs,
    currentTabId,
    setCurrentTabId,
    connections,
    currentConnectionId,
    savedDashboardTabs,
    setSavedDashboardTabs,
  } = props;
  const [open, setOpen] = React.useState(false);
  const { data } = useSession()
  const {
    handleSubmit,
    watch,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tabs[currentTabId]?.["name"] || "",
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function deepMerge(target, source) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          typeof source[key] === "object" &&
          !Array.isArray(source[key]) &&
          source[key] !== null
        ) {
          target[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    return target;
  }
  const createSavedQuery = async (updatedTabData, createdBy, name) => {
    try {
      const response = await axios.post('/api/user/create-savedQuery', { ...updatedTabData, createdBy, name });
      if (response.status === 200) {
        console.log('Saved query created successfully');
        return response.data;
      }
    } catch (error) {
      console.error('Error creating saved query:', error);
      throw new Error('Failed to create saved query');
    }
  };
  const setName = (name) => {
    setSavedQueryTabs((prevTabs) => {
      const updatedTabs = { ...prevTabs };
      if (updatedTabs[currentTabId]) {
        updatedTabs[currentTabId] = deepMerge(
          updatedTabs[currentTabId],
          tabs[currentTabId]
        );
        updatedTabs[currentTabId].name = name;
      } else {
        updatedTabs[currentTabId] = {
          ...tabs[currentTabId],
          name,
        };
      }
      console.log('updatedTabs', updatedTabs);
      return updatedTabs;
    });
    setTabs((prevTabs) => {
      const updatedTabs = { ...prevTabs };
      updatedTabs[currentTabId].name = name;
      return updatedTabs;
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const updatedTabs = tabs;
      // setName(values.name);
      await createSavedQuery(updatedTabs[currentTabId], data?.user?.email, values.name);
      getSavedQuery(setSavedQueryTabs, data?.user?.email);

      toast.success("Tab Name Edited!");
      handleClose();
      reset({ name: "" });
    } catch (e) {
      console.log("Error connecting to database: ", e);
      toast.error("Something went wrong!");
    }
  };

  return (
    <React.Fragment>
      <Button
        color="primary"
        className="bg-[#0070ef] w-fit"
        onClick={(event) => {
          event.stopPropagation();
          handleClickOpen();
        }}
      >
        Edit Tab Name
      </Button>
      <Modal
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        onClick={(event) => {
          event.stopPropagation();
        }}
        style={{ background: "#202020" }}
      >
        <Modal.Header>
          <h1
            style={{ color: "white" }}
            className="mb-8 text-2xl font-bold mr-auto tracking-normal text-white"
          >
            Edit Tab Name
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
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className="w-full flex flex-col gap-3">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input name="name" placeholder="Tab Name" {...field} />
              )}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              size="md"
              type="submit"
              color="primary"
              className="bg-[#0070ef]"
            >
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </React.Fragment>
  );
}
