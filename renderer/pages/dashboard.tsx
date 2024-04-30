import { useEffect } from 'react';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import router from 'next/router';

import { Card } from '@nextui-org/react';
import Layout from '@/components/DashboardLayout';

import { groupedLinks } from '@/utils/dashboard-links';
import Cover from '@/components/dashboard/Cover';


export default function Dashboard() {
    const { status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status]);

    const items = groupedLinks[1].tools.slice(1);

    return (
        <div>
            <Cover imagePath={'/images/dashboard-cover.jpg'} title="Home" />
            <div className="px-8">
                <div className="mb-4 text-2xl font-semibold text-white">
                    Welcome
                </div>
                <div className="flex flex-col gap-4">
                    {items.map((item, index: any) => (
                        <Card
                            bordered
                            hoverable
                            shadow
                            style={{ background: '#1e1e1e' }}
                            key={index}
                        >
                            <div className="flex gap-4">
                                <div className="tool-icon-lg">{item.icon}</div>
                                <div className="flex flex-col">
                                    <h1 className="text-lg font-semibold">
                                        <Link
                                            href={
                                                item.isExternal
                                                    ? item.slug
                                                    : '/' + item.slug
                                            }
                                            target={
                                                item.isExternal ? '_blank' : ''
                                            }
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            {item.label}
                                        </Link>
                                    </h1>
                                    <h2 className="text-md max-w-md tracking-normal">
                                        {item.description}
                                    </h2>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            {/* {status == "unauthenticated" || (status == "loading" && <Spinner />)}
          {status == "authenticated" && <div></div>} */}
        </div>
    );
}

Dashboard.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
