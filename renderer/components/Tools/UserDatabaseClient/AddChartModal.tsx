import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Button, Modal } from "@nextui-org/react";
import * as z from "zod";

import Select from "../../Select";
import { toast } from "react-toastify";
import axios from "axios";
import { getDashboard } from ".";
import { useSession } from "next-auth/react";

const queryTabSchema = z.object({
  queryTab: z.string(),
});

export default function AddChartModal(props) {
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
  const {
    handleSubmit,
    watch,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof queryTabSchema>>({
    resolver: zodResolver(queryTabSchema),
    defaultValues: {
      queryTab: "",
    },
  });
  const [names, setNames] = React.useState([]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const { data } = useSession();

  const updateDashboardTab = async (tabId: string, savedQueryId: string) => {
    try {
      const response = await axios.put('/api/user/update-dashboard', {
        tabId,
        savedQueryId,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update dashboard tab');
    }
  };
  const onSubmit = async (values: z.infer<typeof queryTabSchema>) => {
    try {
      const selectedQueryTab = savedQueryTabs[values.queryTab];
      if (selectedQueryTab) {
        await updateDashboardTab(currentTabId, selectedQueryTab.id);
        getDashboard(setSavedDashboardTabs, data?.user?.email);
        // setSavedDashboardTabs((prevTabs) => {
        //   const updatedTabs = { ...prevTabs };
        //   if (updatedTabs[currentTabId]) {
        //     const updatedData = updatedTabs[currentTabId].updatedData || [];
        //     updatedTabs[currentTabId] = {
        //       ...updatedTabs[currentTabId],
        //       updatedData: [...updatedData, selectedQueryTab],
        //     };
        //   } else {
        //     updatedTabs[currentTabId] = {
        //       updatedData: [selectedQueryTab],
        //     };
        //   }
        //   return updatedTabs;
        // });
      }
      handleClose();
      reset({ queryTab: "" });
    } catch (e) {
      console.log("Error connecting to database: ", e);
      toast.error("Something went wrong!");
    }
  };

  React.useEffect(() => {
    function mapConnectionsToArrays(connections) {
      const names = [];

      Object.entries(connections).forEach(([key, value]: [string, any]) => {
        if (
          typeof value === "object" &&
          "name" in value &&
          "chartType" in value &&
          "chartX" in value &&
          "chartY" in value &&
          "connectResponse" in value
        ) {
          names.push({
            label: value.name,
            value: key,
          });
        }
      });

      console.log(names, 'names')
      setNames(names);
    }

    mapConnectionsToArrays(savedQueryTabs);
  }, [savedQueryTabs]);
  console.log(names, 'names')
  console.log(savedQueryTabs, 'savedQueryTabs')
  return (
    <React.Fragment>
      <Button
        color="primary"
        className="bg-[#0070ef] ml-auto"
        onClick={(event) => {
          event.stopPropagation();
          handleClickOpen();
        }}
      >
        Add Chart
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
            Add Chart
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
              name="queryTab"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { label: "Select Query Tabs", value: "" },
                    ...names,
                  ]}
                  style={{ color: "#D7D8DB" }}
                />
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
              Create
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </React.Fragment>
  );
}
