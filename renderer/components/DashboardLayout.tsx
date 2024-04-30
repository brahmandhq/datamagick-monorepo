import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { KBarProvider } from "kbar";
import { ToastContainer } from "react-toastify";
import { createTheme } from "@mui/material/styles";

import CommandBar from "components/CommandBar";
import GroupedTools from "components/GroupedTools";
import DrawerBasedLayout from "components/DrawerBasedLayout";



import { groupedLinks as allGroupedLinks } from "@/utils/dashboard-links";
import BuySection from "./BuySection";
import { checkIfFreeUser } from "@/utils/user";

export default function ToolsLayout(props) {
    const {
        children,
        enableHead = true,

    } = props;

    const { data: session, status } = useSession();
    const isFreeUser = checkIfFreeUser(status, session);

    const router = useRouter();
    const pathname = router.pathname;


    const [mode, setMode] = React.useState<"light" | "dark">("dark");

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode]
    );


    const pageTitle = "DataMagic";

    const allGroupedTools = isFreeUser
        ? allGroupedLinks
        : allGroupedLinks.filter((group) => group.name !== "Premium");

    return (
        <>
            <KBarProvider
                options={{
                    enableHistory: true,
                }}
            // actions={initialActions}
            >
                <CommandBar />
                {enableHead && (
                    <Head>
                        {router.pathname !== "/app" && <title>{pageTitle}</title>}
                    </Head>
                )}
                <DrawerBasedLayout
                    theme={theme}
                    DrawerBody={
                        <div
                            className="hide-scrollbar"
                            style={{
                                height: "75vh",
                                flex: 1,
                                background: "rgb(32, 32, 32)",
                            }}
                        >
                            <div className="">
                                <GroupedTools
                                    groupedTools={allGroupedTools}
                                    currentTool={router.pathname}
                                />
                            </div>
                        </div>
                    }
                    DrawerFooter={<BuySection />}
                    MainSection={
                        <>
                            <ToastContainer
                                position="top-right"
                                autoClose={5000}
                                hideProgressBar={true}
                                newestOnTop={false}
                                theme="dark"
                            />
                            <div className="z-0 text-black" style={{ overflowX: "hidden" }}>
                                {children}
                            </div>
                        </>
                    }
                //   tool={tool}
                />
            </KBarProvider>
        </>
    );
}
