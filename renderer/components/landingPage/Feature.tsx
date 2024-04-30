import React from "react";

export default function Feature({
  heading,
  body = "",
  items = [],
  image = "",
  video = "",
}: {
  heading?: any;
  body?: any;
  items?: any;
  image?: any;
  video?: any;
}) {
  return (
    <div
      className="mx-8 mb-8 max-w-6xl rounded-xl px-4 py-4 xl:mx-0 xl:px-8"
      style={{
        background: "#262626",
        boxShadow: "0 5px 14px 0 rgb(0 0 0 / 10%)",
      }}
    >
      <div className="relative mx-auto grid grid-cols-12 gap-6 py-4 text-white xl:py-12">
        <div
          className="z-10 col-span-12 flex flex-col justify-center
         xl:col-span-5 xl:mt-0"
        >
          <h1 className="w-full pr-8 text-3xl font-semibold tracking-normal xl:text-4xl">
            {heading}
          </h1>
          <h2 className="w-10/12 py-4 text-base tracking-normal text-gray-400">
            {body}
          </h2>
          <div>
            {items.map((item, index) => (
              <h3 className="flex gap-2 text-base tracking-wide" key={index}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#109e72"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>{" "}
                {item}
              </h3>
            ))}
          </div>
        </div>
        <div className={`z-10 col-span-12 h-full w-full xl:col-span-7`}>
          {image && (
            <img
              src={image}
              className="rounded-lg shadow-2xl shadow-black/20"
              alt="Feature Image"
            />
          )}
          {video && (
            <video
              src={video}
              className="w-full rounded-lg shadow-2xl shadow-black/20"
              autoPlay
              loop
              muted
            >
              <source src={video} type="video/mp4" />
            </video>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "50%",
            zIndex: 0,
            opacity: 0.1,
          }}
          className="gradient"
        ></div>
      </div>
    </div>
  );
}
