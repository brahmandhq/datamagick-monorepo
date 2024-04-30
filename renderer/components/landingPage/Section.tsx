import React from "react";

import Feature from "@/components/landingPage/Feature";

export default function Section({ name, description, features }) {
  return (
    <div className="my-40">
      <div
        className="z-10 mx-auto p-6 text-white xl:p-0"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="z-10 text-center text-4xl font-bold xl:text-5xl">
          {name}
        </div>
        <div className="mt-4 max-w-2xl text-center text-lg tracking-normal opacity-80 xl:w-10/12 xl:text-xl">
          {description}
        </div>
      </div>

      <section className="mx-auto mt-12 flex max-w-6xl flex-col">
        {features.map(
          //@ts-ignore
          (feature, index) => {
            //@ts-ignore
            const { image = "", video = "", heading, description } = feature;
            return (
              <Feature
                image={image}
                video={video}
                heading={heading}
                key={index}
                {...feature}
              />
            );
          }
        )}
      </section>
    </div>
  );
}
