import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import router from "next/router";

import Layout from "@/components/DashboardLayout";

import Cover from "@/components/dashboard/Cover";

import Input from "@/components/Input";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Button from "@/components/Button";

export default function Dashboard() {
  const { data: session, status } = useSession();

  const [isGeneratingStripePortalLink, setIsGeneratingStripePortalLink] =
    useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  // @ts-ignore
  const { name, email, subName } = session?.user || {};
  console.log(session?.user);
  const goToStripeCustomerPortal = async () => {
    setIsGeneratingStripePortalLink(true);
    try {
      const response = await axios.post("/api/stripe/create-portal-link");
      const { url } = response.data;
      setIsGeneratingStripePortalLink(false);

      window.open(url);
    } catch (e) { }
    setIsGeneratingStripePortalLink(false);
  };

  return (
    <div>
      <Cover imagePath={'/images/dashboard-cover.jpg'} title="Profile" />
      {email && (
        <div className="flex flex-col gap-6 px-8 text-white">
          <div>
            <h2 className="text-xl font-bold tracking-normal">Name</h2>
            <Input value={name} disabled />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-normal">Email</h2>
            <Input value={email} disabled />
          </div>
          <div>
            <h2 className="mb-1 text-xl font-bold tracking-normal">
              Subscription
            </h2>
            <div className="opacity-90">{subName || "Inactive"}</div>
            {subName && (
              <Button
                onClick={() => goToStripeCustomerPortal()}
                className="mt-2"
                shadow
                size="sm"
                loading={isGeneratingStripePortalLink}
                style={{
                  padding: isGeneratingStripePortalLink ? "8px 24px" : "",
                }}
              >
                Manage Subscription
              </Button>
            )}
          </div>
        </div>
      )}
      {status == "unauthenticated" ||
        (status == "loading" && (
          <div className="flex items-center justify-center px-8">
            <Spinner />
          </div>
        ))}
    </div>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
