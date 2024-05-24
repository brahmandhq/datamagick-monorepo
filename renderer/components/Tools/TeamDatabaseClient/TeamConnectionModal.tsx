import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Modal } from "@nextui-org/react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";
import Input from "../../Input";
import Select from "../../Select";
import { getDbInfo } from ".";
import { toast } from "react-toastify";
import { ListItemText } from "@mui/material";

const dbOpions = [
  {
    label: "MongoDB",
    value: "mongodb",
  },
  {
    label: "PostgreSQL",
    value: "postgresql",
  },
];

const connectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dbConnectionString: z.string().min(1, "Connection string is required"),
  db: z.enum(["mongodb", "postgresql"]),
  teamId: z.string().min(1, "Team ID is required"),
});

export default function TeamConnectionModal(props) {
  const { data } = useSession();
  const router = useRouter();
  const { id } = router.query;
  console.log("Team ID: ", id);
  const {
    connections,
    setConnections,
    currentConnectionId,
    setCurrentConnectionId,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [teamsData, setTeamsData] = React.useState([]);
  const [status, setStatus] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const {
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<z.infer<typeof connectionSchema>>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      name: "",
      dbConnectionString: "",
      db: "mongodb",
      teamId: id as string,
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function getUniqueTableNames(data) {
    const tableNames = data.reduce((acc, item) => {
      acc[item.table_name] = true;
      return acc;
    }, {});

    return Object.keys(tableNames);
  }
  const storeDbInfo = async (
    name: string,
    db: string,
    dbData: string[],
    teamId: string,
    email: string
  ) => {
    setStatus("Creating Connection...");
    try {
      const response = await axios.post(
        "/api/team/create-connectionInfo",
        { name, db, dbData, teamId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response) {
        return response.data.dbInfo;
      }
    } catch (e) {
      console.log("Error storing DbInfo: ", e);
    }
  };
  const getTeams = async () => {
    try {
      const response = await axios.get(`/api/team/getTeams`);
      if (response) {
        console.log("Teams: ", response.data);
        const filteredTeams = response.data.teams.filter((team) =>
          team.members.some((member) => member.email === data?.user?.email)
        );

        setTeamsData(filteredTeams);
      }
    } catch (error) {
      console.log("Error fetching teams: ", error);
    }
  };
  const teamsOptions = teamsData.map((team) => ({
    label: team.name,
    value: team.id,
  }));

  const onSubmit = async (values: z.infer<typeof connectionSchema>) => {
    setStatus("Connecting...");
    setLoading(true);
    try {
      console.log(values);
      const response = await axios.post(`/api/database-client/connect`, {
        connectionString: values.dbConnectionString,
      });
      const reqData = response.data;
      const dbdata = getUniqueTableNames(reqData);

      await storeDbInfo(
        values.name,
        values.db,
        dbdata,
        values.teamId,
        data?.user?.email
      );
      getDbInfo(setConnections, id, data?.user?.email);
      handleClose();
      toast.success("Connection with Team created successfully", {
        position: "top-right",
      });
    } catch (e) {
      console.log("Error connecting to database: ", e);
      toast.error("Error occurred while creating Connection with Team", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
      setStatus("");
    }
  };
  React.useEffect(() => {
    getTeams();
  }, []);
  return (
    <React.Fragment>
      <ListItemText
        className="text-white"
        onClick={(event) => {
          event.stopPropagation();
          handleClickOpen();
        }}
      >
        Team Connection
      </ListItemText>
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
          <h1 className="mb-8 text-2xl font-bold mr-auto tracking-normal text-white">
            Create Team Connection
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
            <div className="flex flex-col">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Name"
                    className="zero-radius"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>
            {/* <Controller
                            name="teamId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={teamsOptions}
                                    style={{ color: "#D7D8DB" }}
                                />
                            )}
                        /> */}
            <div className="flex flex-col">
              <Controller
                name="dbConnectionString"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    name="db-connection-string"
                    id="db-connection-string"
                    className="zero-radius"
                    placeholder="postgres://<username>:<password-here>@<hostname>:<port>"
                    type="password"
                  />
                )}
              />
              {errors.dbConnectionString && (
                <p className="text-red-500 text-xs">
                  {errors.dbConnectionString.message}
                </p>
              )}
            </div>
            <Controller
              name="db"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={dbOpions}
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
              className="bg-[#0070ef] text-white"
              disabled={loading}
            >
              {loading ? status : "Connect"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </React.Fragment>
  );
}
