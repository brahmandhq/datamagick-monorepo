import React from "react";
import router from "next/router";

import Button from "@/components/Button";
import { signOut, useSession } from "next-auth/react";
import { checkIfFreeUser } from "@/utils/user";

export default function BuySection() {
    const { data: session, status } = useSession();
    const isFreeUser = checkIfFreeUser(status, session);

    return (
        <>
            <div style={{ height: "max-content", background: "#1e1e1e" }}>
                {/* @ts-ignore */}
                {isFreeUser && (
                    <div className="mx-auto p-4 text-center">
                        <Button
                            variant="contained"
                            component="label"
                            size="md"
                            className="mx-auto"
                            onClick={() => router.push("/pricing")}
                        >
                            Buy Pro Now
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
