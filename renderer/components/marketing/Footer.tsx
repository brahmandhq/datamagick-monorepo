import React from "react";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const companyName = "DataMagick";
  const tagline = "The Essential Database Tool";

  const groups = [
    {
      heading: "Product",
      links: [
        {
          name: "Team",
          href: "https://get-devkit.notion.site/Team-7aa35517bc234cc1aa1d28c28a0977ec",
        },
        {
          name: "Opportunities",
          href: "/opportunities",
        },
        {
          name: "Community",
          href: "https://discord.com/invite/qFaUEhsME8",
        },
        // {
        //   name: "Students Pricing",
        //   href: "/pricing/students",
        // },
      ],
    },
    {
      heading: "Company",
      links: [
        {
          name: "Twitter",
          href: "https://twitter.com/getdevkit",
        },
        {
          name: "GitHub",
          href: "https://github.com/get-devkit",
        },
        {
          name: "Instagram",
          href: "https://instagram.com/getdevkit",
        },
      ],
    },
    {
      heading: "Legal",
      links: [
        {
          name: "Terms",
          href: "/terms-of-service",
        },
        {
          name: "Privacy",
          href: "/privacy-policy",
        },
        {
          name: "Refund",
          href: "/refund-policy",
        },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: <i className="fa-brands fa-twitter"></i>,
      href: "https://twitter.com/getdevkit",
    },
    {
      icon: <i className="fa-brands fa-github"></i>,
      href: "https://github.com/get-devkit",
    },
    {
      icon: <i className="fa-brands fa-instagram"></i>,
      href: "https://instagram.com/getdevkit",
    },
  ];

  return (
    <footer className="body-font bg-neutral-900 text-gray-600">
      <div className="container mx-auto flex max-w-6xl flex-col flex-wrap px-5 py-16 md:flex-row md:flex-nowrap md:items-center lg:items-start">
        <div className="mx-auto w-64 flex-shrink-0 text-center md:mx-0 md:text-left">
          <div className="title-font mb-6 flex cursor-pointer items-center font-medium md:mb-0">
            <div className="mx-auto flex items-center md:mx-0">
              <img src="/logo.png" className="z-10 w-16" alt="DevKit Loo" />
              <span className="z-10 ml-1 text-xl font-semibold text-white">
                {companyName}
              </span>
            </div>
          </div>
          <h4 className="mt-2 text-sm tracking-normal text-gray-400">
            {tagline}
          </h4>
        </div>
        <div className="-mb-10 mt-10 flex flex-grow flex-wrap text-center md:mt-0 md:pl-20 md:text-left">
          <div className="flex-1"></div>
          {groups.map((group, index) => (
            <div className="w-full px-4 md:w-1/2 lg:w-1/4" key={index}>
              <h2 className="mb-3 text-base tracking-normal">
                {group.heading}
              </h2>
              <nav className="mb-10 list-none">
                {group.links.map((link, index) => (
                  <li key={index}>
                    {!link.href.startsWith("http") && (
                      <Link href={link.href} legacyBehavior>
                        <a
                          className="text-sm tracking-normal text-neutral-300 hover:text-neutral-400"
                          href={link.href}
                        >
                          {link.name}
                        </a>
                      </Link>
                    )}
                    {link.href.startsWith("http") && (
                      <a
                        className="text-sm tracking-normal text-neutral-300 hover:text-neutral-400"
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>
      <div
        className="mx-auto max-w-6xl py-4"
        style={{ borderTop: "1px solid #363638" }}
      >
        <div className="container mx-auto flex flex-col flex-wrap px-5 py-4 sm:flex-row">
          <h6
            className="text-center text-sm tracking-normal sm:text-left"
            style={{ color: "#aaaaaa" }}
          >
            Copyright © 2022 - 2023 DevKit. All rights reserved.
          </h6>
          <span className="mt-2 inline-flex justify-center gap-4 sm:ml-auto sm:mt-0 sm:justify-start">
            {socialLinks.map((socialLink, index) => (
              <a
                href={socialLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-gray-500"
                key={index}
              >
                {socialLink.icon}
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
