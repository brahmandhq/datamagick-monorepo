import React from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";

import Layout from "@/components/marketing/Layout";

import { ProductWithPrice } from "../types";

const productsList: ProductWithPrice[] = [
  {
    id: "123",
    active: true,
    name: "DataMagick Annual Subscription",
    description: "The Essential Developer Toolkit",
    image: "https://getdevkit.com/logo.png",
    //@ts-ignore
    metadata: "",
    prices: [
      {
        id: "123",
        product_id: "123",
        active: true,
        description: "product",
        unit_amount: 12000,
        currency: "usd",
        type: "recurring",
        interval: "year",
        interval_count: 1,
        trial_period_days: 0,
        //@ts-ignore
        metadata: "",
      },
    ],
  },
];

export default function PricingPage({ products = productsList }) {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
        <title>Pricing | DataMagick</title>
      </Head>

      <div className=" mx-auto max-w-6xl px-4 py-8 pb-2 sm:px-6 sm:py-24 sm:pb-8 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Pricing
          </h1>
          <p className="m-auto mt-5 max-w-3xl text-xl tracking-normal text-zinc-200 sm:text-center sm:text-2xl">
            Start using DataMagick for free, and then pick a paid plan to unlock
            tons of amazing features to boost your productivity to the moon 🚀
          </p>
        </div>
        <div className="mx-auto mb-2 mt-6 max-w-max text-lg tracking-tight text-zinc-200 sm:text-center">
          <b>Special Offer: </b>
          Grab the annual $120 subscription at just $60! <br />
          We are celebrating the success of our Product Hunt launch of DevGPT{" "}
          <br />
          It received <b>300+</b> upvotes and made it the <b>Top 10</b> list 🥳
          <br />
          Here is your 50% off coupon:{" "}
          <b className="text-zinc-100">LAUNCHMONTH50</b>
        </div>
      </div>
      {/* {status == "unauthenticated" && <Pricing products={products} />}
      {status == "authenticated" && (
        //  @ts-ignore
        <stripe-pricing-table
          pricing-table-id={process.env.NEXT_PUBLIC_PRICING_TABLE_ID}
          publishable-key={
            process.env.NEXT_PUBLIC_PRICING_TABLE_PUBLISHABLE_KEY
          }
        />
      )}
      {status == "loading" && (
        <div className="mt-20 mb-60 flex justify-center">
          <Spinner />
        </div>
      )} */}
      {/* @ts-ignore */}
      <stripe-pricing-table
        pricing-table-id={process.env.NEXT_PUBLIC_PRICING_TABLE_ID}
        publishable-key={process.env.NEXT_PUBLIC_PRICING_TABLE_PUBLISHABLE_KEY}
      />

      <div className="mb-32"></div>
    </>
  );
}

PricingPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
