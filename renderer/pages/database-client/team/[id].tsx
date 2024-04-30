import dynamic from 'next/dynamic';
const DevTool = dynamic(() => import('@/components/Tools/TeamDatabaseClient'), { ssr: false });

export default function Tool() {
    return <DevTool />;
}