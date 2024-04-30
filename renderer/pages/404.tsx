import Head from 'next/head';
import Link from 'next/link';

import Layout from '@/components/Layout';
import Header from '@/components/marketing/Header';

export default function Status() {
    return (
        <div className="mx-auto max-w-7xl grid-cols-12 p-6 xl:p-0">
            <Head>
                <title>404 | Page Not Found</title>
            </Head>
            <Header />
            <div className="-mt-20">
                <div className="body-font overflow-hidden text-white">
                    <div className="container mx-auto px-5 py-8 pt-0">
                        <div className="flex content-center ">
                            <img
                                src={'/images/Oops-robot-cuate.png'}
                                alt="Illustration"
                                style={{ minWidth: '350px' }}
                                className="mx-auto "
                            />
                        </div>
                        <div className="text-center">
                            <h1 className=" text-5xl font-bold max-sm:text-3xl ">
                                {`404: Page Not Found ⚠️`}
                            </h1>
                            <h1 className=" text-5xl font-bold pb-5 max-sm:text-3xl ">
                                {`Beyond the Developer's Control 🚧`}
                            </h1>

                            <h1 className="font-light text-lg  max-sm:hidden ">
                                {`Oops! It appears you've reached a page that
                                doesn't exist 😮`}
                            </h1>

                            <h1 className="font-light text-lg max-sm:hidden">
                                {`We're sorry for the inconvenience, but this
                                error is beyond our control. 🙇‍♂️`}
                            </h1>

                            <h1 className="font-light text-lg max-sm:hidden">
                                {`Please feel free to go back to the home page and
                                explore our other sections, making the most of
                                our developer tools. 🚀`}
                            </h1>

                            <h1 className="font-light text-lg max-sm:hidden ">
                                {`Thank you for your understanding and patience 🙏`}
                            </h1>
                            <h1 className="sm:hidden font-light text-md">
                                {`We apologize for the inconvenience. This error
                                is beyond our control. Feel free to go back to
                                the home page and explore our other sections and
                                make the most of our developer tools. Thank you
                                for your understanding. 🙏`}
                            </h1>
                            <Link
                                href="/"
                                className=" justify-center flex pt-5 mb-12 "
                            >
                                <button className=" bg-gradient-to-r from-[#BA57D7] to-[#0070F3] hover:brightness-75 flex  items-center px-5 py-2 rounded-2xl text-lg gap-2">
                                    Home
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Status.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
