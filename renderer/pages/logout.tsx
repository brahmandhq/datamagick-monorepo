import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

import Layout from "@/components/marketing/Layout";
import Spinner from "@/components/Spinner";
import { useRouter } from 'next/router';
import Head from "next/head";

export default function SignOut() {

    const router = useRouter();
    useEffect(() => {
        console.log("Logging out...");
        signOut(
            { callbackUrl: "/", redirect: false }

        )
            .then(() => {
                localStorage.clear();
                console.log("Logout successful")
                router.push('/');
            })
            .catch((error) => console.error("Logout error:", error));
    }, []);

    return (
        <>
            <Head>
                <title>Logout | DataMagic</title>
            </Head>
            <div className="p-8 text-white">
                <section className="body-font overflow-hidden text-gray-200">
                    <div className="container mx-auto py-12 pb-80 text-center">
                        <h1 className="mb-8 text-4xl text-white">Logout</h1>
                        {true && (
                            <div className="flex items-center justify-center">
                                <Spinner size="40px" />
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

SignOut.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
