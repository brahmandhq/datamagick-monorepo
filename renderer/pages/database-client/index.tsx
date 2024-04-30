import dynamic from 'next/dynamic';
const DevTool = dynamic(() => import('@/components/Tools/UserDatabaseClient'), { ssr: false });
export default function Tool() {
  return <DevTool />;
}
