import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MenuItem, ListItemText, TextField, IconButton } from "@mui/material";
import { Modal } from "@nextui-org/react";
import CloseIcon from "@mui/icons-material/Close";
import Input from "../../Input";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@nextui-org/react';
import { toast } from "react-toastify";
import axios from "axios";
import { getDashboard } from ".";

const dashboardSchema = z.object({
    name: z.string().min(1, "Name is required"),

});

export default function CreateDashboardModal({
    setCurrentTabId,
    setTabs,
    setSavedDashboardTabs,
}) {
    const { data } = useSession();
    const [status, setStatus] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [dashboardName, setDashboardName] = useState("");
    const [open, setOpen] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<z.infer<typeof dashboardSchema>>({
        resolver: zodResolver(dashboardSchema),
        defaultValues: {
            name: "",

        },
    });
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };



    const onSubmit = async (values: z.infer<typeof dashboardSchema>) => {
        try {
            const response = await axios.post("/api/user/create-dashboard", { name: values.name, userEmail: data.user.email })
            if (response.status == 200) {
                toast.success("Dashboard added in Database", {
                    position: "top-right",
                });
                getDashboard(setSavedDashboardTabs, data?.user?.email);

            }

            handleClose();
            toast.success(`${values.name} created successfully`, {
                position: "top-right",
            });
        } catch (error) {
            handleClose();
            toast.error("", {
                position: "top-right",
            });
        }


    };

    return (
        <React.Fragment>
            <ListItemText
                className="text-white"
                onClick={(event) => {
                    event.stopPropagation();
                    handleClickOpen();
                }}
            >
                Create Dashboard
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
                        Create Dashboard
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

                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            size="md"
                            type="submit"
                            color="primary"
                            className="bg-[#0070ef] text-white"
                        >
                            {loading ? status : 'Connect'}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </React.Fragment>
    );
}
