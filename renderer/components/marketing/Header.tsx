import React from 'react';


import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@nextui-org/react';

import { signOut, useSession } from 'next-auth/react';
import { getStartedLink } from 'data/links';

export default function Header() {
    const { data: session, status } = useSession();
    return (
        <section className="z-10 mx-auto mb-0 max-w-6xl p-8 xl:mb-20 xl:p-0">
            <div className="z-10 flex flex-col flex-wrap items-center justify-between py-1 md:flex-row">
                <Link href="/?f=t">
                    <div className="title-font mb-6 flex cursor-pointer items-center font-medium md:mb-0">
                        <img
                            src="/logo.png"
                            className="z-10 w-16"
                            alt="DataMagic Logo"
                        />
                        <span className="z-10 ml-1 text-xl font-semibold text-white">
                            DataMagic
                        </span>
                    </div>
                </Link>
                <div className="relative z-10 flex items-center space-x-3 md:ml-5 lg:justify-end">
                    <Link href="/pricing">
                        <span className="whitespace-no-wrap inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-base font-medium leading-6 text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2">
                            Pricing
                        </span>
                    </Link>
                    <span className="inline-flex rounded-md shadow-sm">
                        {status != 'authenticated' && (
                            <Link href={getStartedLink}>
                                <Button
                                    className="nextui-blue-btn mx-auto"
                                    shadow
                                    auto
                                >
                                    Login
                                </Button>
                            </Link>
                        )}
                        {status == 'authenticated' && (
                            <>
                            
                            
                            
                            <Link href="/dashboard">
                                <Button
                                    className="nextui-blue-btn mx-auto"
                                    shadow
                                    auto
                                >
                                    Dashboard
                                </Button>
                            </Link>
                           
                            </>
                        )}
                    </span>
                </div>
            </div>
        </section>
    );
}
