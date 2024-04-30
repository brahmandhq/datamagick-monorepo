import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import Storage from "@mui/icons-material/Storage";
import Logout from '@mui/icons-material/Logout';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PersonIcon from '@mui/icons-material/Person';
import { Groups } from '@mui/icons-material';
const baseLocation = '/';
function MUIIcon({ icon: Icon }) {
    return <Icon fontSize={'smallest'} />;
}
export const groupedLinks = [
    {
        name: 'Premium',
        tools: [
            {
                slug: 'pricing',
                label: 'Buy Pro',
                icon: <MUIIcon icon={AutoAwesomeRoundedIcon} />,
                description: 'Purchase the pro version of our tools',
                color: 'bg-indigo-700',
                textColor: 'text-gray-900',
            },
            // {
            //   isExternal: true,
            //   slug: discordLink,
            //   label: "Exclusive Community",
            //   icon: <MUIIcon icon={AutoAwesomeRoundedIcon} />,
            //   description: "Exclusive community of experts for our paid users",
            //   color: "bg-indigo-700",
            //   textColor: "text-gray-900",
            // },
        ],
    },
    {
        name: 'Dashboard',
        tools: [
            {
                slug: 'dashboard',
                label: 'Home',
                icon: <MUIIcon icon={HomeIcon} />,
                description: '',
                color: 'bg-indigo-700',
                textColor: 'text-gray-900',
            },
            {
                slug: "database-client",
                label: "Database Client",
                icon: <MUIIcon icon={Storage} />,
                description: "Query Postgres databases",
                color: "bg-indigo-700",
                textColor: "text-gray-900",

            },
            {
                slug: "teams",
                label: "Teams",
                icon: <MUIIcon icon={Groups} />,
                description: "Share data and insights with your team",
                color: "bg-indigo-700",
                textColor: "text-gray-900",

            },
            {
                isExternal: true,
                slug: 'https://devkit.substack.com/',
                label: 'Newsletter',
                icon: <MUIIcon icon={NewspaperIcon} />,
                description:
                    'Weekly newsletter with the latest developer-focused news',
                color: 'bg-indigo-700',
                textColor: 'text-gray-900',
            }


        ],
    },
    {
        name: 'Account',
        tools: [
            {
                slug: 'profile',
                label: 'Profile',
                icon: <MUIIcon icon={PersonIcon} />,
                description: 'Your personal information and billing details',
                color: 'bg-indigo-700',
                textColor: 'text-gray-900',
            },
            {
                slug: 'logout',
                label: 'Logout',
                icon: <MUIIcon icon={Logout} />,
                description: 'Logout',
                color: 'bg-indigo-700',
                textColor: 'text-gray-900',
            },
        ],
    }
].map((group: any) => {
    return {
        ...group,
        tools: group.tools.map((tool) => ({
            ...tool,
            location: baseLocation + tool.slug,
        })),
    };
});

