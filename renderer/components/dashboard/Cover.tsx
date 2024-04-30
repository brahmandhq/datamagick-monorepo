import React from "react";

export default function Cover({ title = "Home", description = "", imagePath }) {
    const backgroundStyle = imagePath ? {
        backgroundImage: `linear-gradient(rgba(47, 39, 42, 0.7), rgba(47, 39, 42, 0.8)), url("${imagePath}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
    } : {};
    return (
        <div className="w-100 break-words leading-5 text-zinc-800">
            <div className="break-words">
                <form
                    className="relative mb-6 overflow-hidden rounded-md bg-white p-4"
                    style={{ zIndex: 1 }}
                    data-turbo="false"
                    action="/settings/dismiss-notice/dashboard_promo_codespaces_ga"
                    acceptCharset="UTF-8"
                    method="post"
                >
                    <input
                        type="hidden"
                        name="authenticity_token"
                        defaultValue="S7XEdWJhHkGLn_bvTZdaaCPJsjpICXG80slx43G6srVKEpYwmY5gIm1uBvCsEYYt9FkiOGDvH8zm74sN_F8oAg"
                        className="m-0 cursor-default overflow-visible text-black outline-offset-2"
                    />
                    <picture className="text-zinc-800">
                        <div
                            className="overlayed-thumbnail pointer-events-none absolute top-0 left-0 h-full w-full border-none object-cover"
                            style={{
                                pointerEvents: "none",
                                zIndex: -1,
                                height: "100%",
                                objectFit: "cover",
                                ...backgroundStyle
                            }}
                        // id="dashboard-cover"
                        />
                    </picture>

                    <h4
                        className="py-20 text-center text-2xl font-bold leading-6 tracking-normal text-white"
                        style={{ color: "#ffffff !important" }}
                    >
                        {title}
                    </h4>
                    <p
                        className="mt-2 mb-6 w-2/3 text-xs leading-4 text-white"
                        style={{ color: "rgba(255, 255, 255, 0.67) !important" }}
                    >
                        {description}
                    </p>
                </form>
            </div>
        </div>
    );
}