import React from "react";

import Layout from "../components/Layout";

export default function PrivacyPolicy() {
  const heading = "Refund Policy for DataMagick";
  const content = `In case you aren't satisfied with the product, you can raise a
  refund request by sending an email to harsh@getdevkit.com.
  Refund requests must take place within 14 days of the purchase. Any
  requests after 14 days of the purchase will be considered invalid. For
  all valid refund requests, we will refund the deducted amount (except
  payment gateway fees) in 7-14 business days.`;

  return (
    <div className="m-auto w-9/12 p-20">
      <div className="mb-4">
        <p className="text-center text-3xl font-semibold">{heading}</p>
      </div>

      <p className="text-justify">{content}</p>
    </div>
  );
}

PrivacyPolicy.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
