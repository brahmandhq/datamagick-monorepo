import React from "react";
import Link from "next/link";


export default function GroupedTools({ groupedTools, currentTool }) {

    return (
        <div
            style={{ overflowY: "scroll", height: "calc(100%)" }}
            className="hide-scrollbar m-2 mt-1"
        >
            {groupedTools.map((group, index) => (
                <div className="mb-4 border-b border-white/10 pb-2" key={index}>
                    <h1 className="text-md my-2 px-3 py-0 font-semibold tracking-wide text-gray-100 text-white">
                        {group.name}
                    </h1>
                    {group.tools.map((details, index) => (
                        <div
                            className="sidenav-item mx-auto my-1 px-2 py-0"
                            data-selected={details.location === currentTool}
                            key={index}
                        >
                            {!details.isExternal && (
                                <Link legacyBehavior href={details.location}>
                                    <a className="flex items-center">
                                        <div id="tool-icon">
                                            {details.icon !== undefined && details.icon}
                                        </div>
                                        <span id="tool-name" className="py-1 pl-1">
                                            {details.label}
                                        </span>
                                    </a>
                                </Link>
                            )}
                            {details.isExternal && (
                                <a
                                    className="flex items-center"
                                    href={details.slug}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div id="tool-icon">
                                        {details.icon !== undefined && details.icon}
                                    </div>
                                    <span id="tool-name" className="py-1 pl-1">
                                        {details.label}
                                    </span>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
