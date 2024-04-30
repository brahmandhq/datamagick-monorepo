import { useEffect, useState } from 'react';
import { Modal, useModal, Text, Input } from "@nextui-org/react";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import router from 'next/router';
import Button from "@/components/Button";
import { Card } from '@nextui-org/react';
import Layout from '@/components/DashboardLayout';

import { groupedLinks } from '@/utils/dashboard-links';
import Cover from '@/components/dashboard/Cover';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { set } from 'zod';
import axios from 'axios';
import TeamCard from '@/components/TeamCard';
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
const SkeletonTeamCard = () => (
    <div className="flex flex-col rounded-md gap-3 bg-[#262728] md:w-[400px] min-w-[250px] py-2 px-4 animate-pulse">
        <div className='flex justify-between'>
            <div className="animate-pulse bg-gray-300 h-6 w-48 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-6 w-6 rounded"></div>
        </div>
        <div className='flex justify-between'>
            <div className="flex flex-wrap items-center">
                <div className="w-8 h-8 rounded-full -mr-3 mb-3 animate-pulse bg-gray-300"></div>
                <div className="w-8 h-8 rounded-full -mr-3 mb-3 animate-pulse bg-gray-300"></div>
                <div className="w-8 h-8 rounded-full -mr-3 mb-3 animate-pulse bg-gray-300"></div>
            </div>
            <p className="text-white mt-2 animate-pulse">...</p>
        </div>
    </div>
);
export default function Teams() {
    const { status, data } = useSession();
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState(['']);
    const [teams, setTeams] = useState<Team[] | undefined>();
    const { setVisible, bindings } = useModal();
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [connections, setConnections] = useLocalStorage(
        {},
        "database-client-connection"
    );
    const [selectedConnectionIds, setSelectedConnectionIds] = useState([]);


    const handleCheckboxChange = (event, connectionId) => {

        const updatedConnections = {
            ...connections,
            [connectionId]: event.target.checked
        };

        if (event.target.checked) {
            setSelectedConnectionIds([...selectedConnectionIds, connectionId]);
        } else {
            setSelectedConnectionIds(selectedConnectionIds.filter(id => id !== connectionId));
        }
    };
    const handleMemberChange = (index, value) => {
        const updatedMembers = [...members];
        updatedMembers[index] = value;
        setMembers(updatedMembers);
    };



    const addMemberField = () => {
        setMembers(prevMembers => {
            return [...prevMembers, ''];
        });
    };



    const handleSubmit = async (e) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/team/create', { name: teamName, members, connectionInfo: selectedConnectionIds, createdBy: data.user.email })
            if (response.status === 200) {
                console.log('team created successfully')
                toast.success("Team Created successfully", {
                    position: "top-right",
                });
                getTeams();
            }
            // console.log({
            //     teamName,
            //     members,
            //     selectedConnectionIds,
            // });

        } catch (error) {
            const errorMessage = error.response ? error.response.data : error.message;
            console.error('error message', errorMessage)
            toast.error('Error Creating Team', {
                position: "top-right",
            });


        } finally {
            setLoading(false);
            setTeamName('');
            setMembers(['']);
            setSelectedConnectionIds([])
            setVisible(false);
        }
    };
    const getTeams = async () => {
        try {
            setIsFetching(true);
            const response = await axios.post(`/api/team/getTeams`, { userEmail: data?.user?.email });
            if (response && response.data && response.data.teams) {
                setTeams(response.data.teams);
                setIsFetching(false);
            }
        } catch (error) {
            console.log("Error fetching teams: ", error);
        }
    }
    useEffect(() => {
        getTeams();
    }, [])

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status]);
    useEffect(() => {
        if (!bindings.open) {
            resetForm();
        }
    }, [bindings.open])

    const resetForm = () => {
        setTeamName('');
        setMembers(['']);
        setSelectedConnectionIds([])
    }
    const items = groupedLinks[1].tools.slice(1);
    return (
        <div>
            <Cover imagePath='/images/teams.jpg' title="Teams" />
            <div className="px-8">
                <div className="mb-4 text-2xl font-semibold text-white">
                    <Button variant='contained' size='md' auto shadow color="primary" onPress={() => setVisible(true)}>
                        Create Team
                    </Button>
                    <Modal
                        blur
                        scroll
                        width="600px"
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                        style={{ background: "#202020" }}

                        {...bindings}
                    >
                        <Modal.Header>
                            <Text id="modal-title" color='white' size={18}>
                                Create a team
                            </Text>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                <label className='my-2 text-white'>Team Name</label>

                                <Input

                                    color='success'
                                    status='primary'
                                    bordered
                                    required
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    fullWidth
                                />
                                <label className='my-2 text-white'>Members</label>
                                {members.map((member, index) => (
                                    <div className='mb-2'>
                                        <Input
                                            key={index}
                                            color='success'
                                            status='primary'
                                            bordered
                                            type='email'
                                            value={member}
                                            onChange={(e) => handleMemberChange(index, e.target.value)}
                                            fullWidth
                                            placeholder="Enter member email"
                                        />
                                    </div>
                                ))}
                                <Button type='button' onClick={addMemberField} style={{ marginTop: '1rem', backgroundColor: "#0464D3" }}>
                                    Add Member
                                </Button>

                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button auto flat color="error" onPress={() => setVisible(false)}>
                                Cancel
                            </Button>
                            <Button type='submit' disabled={loading} auto onPress={handleSubmit}>
                                {loading ? 'Creating Team...' : 'Create'}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="flex flex-col md:flex-row flex-wrap  gap-4">

                    {/* {teams && teams.map(team => (
                        <TeamCard onUpdated={getTeams} key={team.id} team={team} />
                    ))} */}
                    {isFetching ? (
                        <>
                            <SkeletonTeamCard />
                            <SkeletonTeamCard />
                            <SkeletonTeamCard />
                        </>
                    ) : (
                        teams.map((team) => (
                            <Link href={`database-client/team/${team.id}`} key={team.id}>
                                <TeamCard onUpdated={getTeams} key={team.id} team={team} />
                            </Link>
                        ))
                    )}

                </div>
            </div>

        </div >
    );
}

Teams.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
