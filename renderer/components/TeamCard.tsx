import { Delete, ManageAccounts, People } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Modal, useModal, Text, Input } from "@nextui-org/react";
import Button from './Button';
import { useSession } from 'next-auth/react';
import { useLocalStorage } from 'hooks/useLocalStorage';
import axios from 'axios';
import { ToastContainer, toast, ToastPosition } from 'react-toastify';
interface Team {
    id: string;
    name: string;
    members: {
        id: string;
        email: string;
        name: string;
        image: string;
        emailVerified: any;
        createdAt: string;
        updatedAt: string;
    }[];
}

const TeamCard = ({ team, onUpdated }) => {

    const initialMembersState = team.members.map(member => member.email);
    // const initialSelectedConnectionsState = team.connectionInfos.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});

    // const [selectedConnections, setSelectedConnections] = useState(initialSelectedConnectionsState);
    const limitedMembers = team.members.slice(0, 3);
    const { setVisible, bindings } = useModal();
    const { status, data } = useSession();
    const [teamName, setTeamName] = useState(team.name);
    const [members, setMembers] = useState(initialMembersState);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    // const [teams, setTeams] = useState(team)


    const [connections, setConnections] = useLocalStorage(
        {},
        "database-client-connection"
    );

    const handleMemberChange = (index, value) => {
        const updatedMembers = [...members];
        updatedMembers[index] = value;
        setMembers(updatedMembers);
    };
    const removeMemberField = (index) => {
        setMembers(prevMembers => {
            const updatedMembers = [...prevMembers];
            updatedMembers.splice(index, 1);
            return updatedMembers;
        });
    };


    const addMemberField = () => {
        setMembers(prevMembers => {
            return [...prevMembers, ''];
        });
    };
    const handleSubmit = async (e) => {
        try {
            setLoading(true);
            // const connectionIds = Object.keys(selectedConnections)
            const response = await axios.put(`/api/team/update`, { id: team.id, name: teamName, members: members, });
            if (response.status === 200) {
                toast.success("Team Updated successfully", {
                    position: "top-right",
                });
                onUpdated();
            }
        } catch (error) {
            console.log(error, 'error')
            toast.error("Error Updating Team", {
                position: "top-right",
            });
        } finally {
            setVisible(false);
            setLoading(false)
        }
    }
    useEffect(() => {
        if (!bindings.open) {
            resetForm();
        }
    }, [bindings.open])

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            const response = await axios.delete('/api/team/delete', {
                data: { id: team.id, email: data.user.email },
            });
            if (response.status === 200) {
                toast.success("Team Delete successfully", {
                    position: "top-right",
                });
                console.log('Team deleted successfully');
                onUpdated();
            }
        } catch (error) {
            console.log(error, 'error')
            toast.error("Error Deleting Team", {
                position: "top-right",
            });
        } finally {
            setVisible(false);
            setDeleteLoading(false);
        }
    }


    const resetForm = () => {
        setTeamName(team.name);
        setMembers(initialMembersState);
        // setSelectedConnections(initialSelectedConnectionsState);
    }


    return (
        <div className="flex flex-col rounded-md gap-3 bg-[#262728] md:w-[400px] min-w-[250px] py-2 px-4">
            <div className='flex justify-between'>
                <h2 className="text-lg font-semibold text-white ">{team.name}</h2>
                <button disabled={team.createdBy !== data?.user?.email} onClick={(event) => {
                    event.preventDefault();
                    setVisible(true)
                }} className='text-white'>
                    {team.createdBy === data?.user?.email ? <ManageAccounts /> : <People />}

                </button>

                <Modal
                    blur
                    scroll
                    width="600px"
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    style={{ background: "#202020", color: "#fffff" }}
                    {...bindings}
                >
                    <Modal.Header>
                        <Text id="modal-title" color='white' size={18}>
                            Update {team.name}
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        <form className='text-white' >
                            <label className='text-white'>Team Name</label>
                            <Input
                                status='success'
                                bordered
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                fullWidth
                            />
                            <label className='text-white'>Members</label>
                            {members.map((member, index) => (
                                <div className='mb-2 text-white'>
                                    <Input
                                        key={index}
                                        status='success'
                                        bordered
                                        value={member}
                                        onChange={(e) => handleMemberChange(index, e.target.value)}
                                        fullWidth
                                        placeholder="Enter member email"
                                    />
                                    {members.length > 1 ? (
                                        <Button type='button' onClick={() => removeMemberField(index)} style={{ marginTop: '1rem', backgroundColor: "#D30404" }}>
                                            Remove Member
                                        </Button>
                                    ) : null}
                                </div>
                            ))}
                            <Button type='button' onClick={addMemberField} style={{ marginTop: '1rem', backgroundColor: "#0464D3" }}>
                                Add Member
                            </Button>
                            {/* <label>Connections</label>
                            <div className='text-white'>


                                {connections && Object?.entries(connections).map(([id, checked]) => (
                                    <div key={id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={id}
                                            checked={!!selectedConnections[id]}
                                            onChange={(e) => handleCheckboxChange(e, id)}
                                        />
                                        <label htmlFor={id}>{id in connections ? connections[id].name : id}</label>
                                    </div>
                                ))}
                            </div> */}

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button flat auto type='submit' color="error" disabled={deleteLoading} onPress={handleDelete}>
                            {deleteLoading ? 'Deleting Team...' : 'Delete team'}
                        </Button>
                        <Button auto flat color="error" onPress={() => setVisible(false)}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={loading} auto onPress={handleSubmit}>
                            {loading ? 'Updating Team...' : 'Update'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <div className='flex justify-between'>
                {/* members */}
                <div className="flex items-center justify-center ml-3">
                    {limitedMembers.map(member => (
                        <div key={member.id} className="flex relative border-2 border-white rounded-full -ml-3">
                            {member.image ? (
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="h-[30px] w-[30px] rounded-full"
                                />
                            ) : (
                                <img
                                    src="/icons/user.png"
                                    alt="Dummy Profile"
                                    className="h-[30px] w-[30px] rounded-full"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* members counts */}
                <p className="text-white mt-2"> {team.members.length}</p>
            </div>
        </div>
    );

};

export default TeamCard;
