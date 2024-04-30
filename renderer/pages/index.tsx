import * as React from 'react';
import { Tweet } from 'react-tweet';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { Button, Collapse, Text } from '@nextui-org/react';
import { discordLink, getStartedLink } from 'data/links';
import { tweetIds } from 'data/twitter';
import { motion } from 'framer-motion';

import Section from '@/components/landingPage/Section';
import Layout from '@/components/marketing/Layout';
import faqs from 'data/faqs';
import { useSession } from 'next-auth/react';
import router from 'next/router';

const uniqueVisitorsCount = '40,000';

export default function Home({ tweets = [] }) {

  const { status } = useSession();

  React.useEffect(() => {
      if (status === 'authenticated') {
          router.push('/dashboard');
      }
  }, [status]);
  const [heroSectionVisible, _] = React.useState(true);

  const logos = [
    '/images/logos/amazon.png',
    '/images/logos/microsoft.png',
    '/images/logos/uber.png',
    '/images/logos/avalara.png',
    '/images/logos/skyscanner.png',
    '/images/logos/resend.png',
    '/images/logos/bolt.png',
    '/images/logos/workos.png',
  ];

  const devgptFeatures = [

    {
      image: '/recordings/3.gif',
      heading: 'Query Postgres Databases with Plain English',
      body: 'Reduce SQL writing time by 90% and get results in seconds',
      items: [
        'Generate SQL in seconds',
        'Plot results',
        'MySQL and SQL Server support coming soon',
      ],
    },

  ];

  const exclusiveCommunityFeatures = [
    {
      image: '/images/exclusive-community.png',
      heading: 'Tens of curated experts',
      body: 'Our exclusive community is a diverse group: From high-achieving students to FAANG Engineers to startup founders',
      items: [
        'Virtual meetup once every 2 months',
        'Exclusive Q&A Forum',
        'Prioritized responses',
      ],
    },
    // {
    //   image: "/screenshots/code-generator-v2.png",
    //   heading: "Lightning-fast developement",
    //   description: (
    //     <>
    //       {"Don't"} spend a day configuring a new project, use our{" "}
    //       <span className="font-semibold text-white">Code Generator</span> to
    //       boostrap your project in minutes
    //       {/* Ship
    //       <span className="font-bold text-white"> in hours not days.</span> */}
    //     </>
    //   ),
    // },
    // {
    //   video: "/recordings/components.mp4",
    //   heading: "Build interfaces rapidly",
    //   body: "Build new interfaces in minutes by using our collection of Tailwind Components",
    //   items: ["200+ Components", "10+ Categories"],
    // },
  ];

  const developerToolsFeatures = [
    {
      // image: "/screenshots/responsive-design-v2.png",
      video: '/recordings/editors-utilities.mp4',
      heading: 'Beautiful and fast utilities',
      body: 'Test snippets, write docs, transform data, and perform other common tasks with our Editors and Utilities with blazing-fast speed ⚡',
      items: ['7 Editors', '10+ Utilities'],
    },
    {
      video: '/recordings/api-database-clients.mp4',
      heading: 'Test APIs and Manage Databases with ease',
      body: 'Test APIs. Query and visualize data. All within your browser ✨',
      items: ['API Client', 'Database Client'],
    },
    // {
    //   image: "/screenshots/code-generator-v2.png",
    //   heading: "Lightning-fast developement",
    //   description: (
    //     <>
    //       {"Don't"} spend a day configuring a new project, use our{" "}
    //       <span className="font-semibold text-white">Code Generator</span> to
    //       boostrap your project in minutes
    //       {/* Ship
    //       <span className="font-bold text-white"> in hours not days.</span> */}
    //     </>
    //   ),
    // },
    // {
    //   video: "/recordings/components.mp4",
    //   heading: "Build interfaces rapidly",
    //   body: "Build new interfaces in minutes by using our collection of Tailwind Components",
    //   items: ["200+ Components", "10+ Categories"],
    // },
  ];

  const learningToolsFeatures = [
    {
      image: '/screenshots/courses.png',
      // video: "/recordings/components.mp4",
      heading: 'Structured learning',
      body: 'Learn Computer Science, Programming, AI, and many more subjects with our curated courses',
      items: ['25+ Courses', '5+ Categories'],
    },
    {
      image: '/screenshots/tech-talks.png',
      // video: "/recordings/api-database-clients.mp4",
      heading: 'Be on the bleeding edge',
      body: (
        <>
          Stay ahead of the curve by learning new technologies and
          advanced concepts from experts anywhere anytime
        </>
      ),
      items: ['1K+ Tech Talks', '10+ Conferences'],
    },
    {
      // image: "/screenshots/responsive-design-v2.png",
      video: '/recordings/editors-utilities.mp4',
      heading: 'Opportunities',
      body: 'Find OSS programs, bootcamps, and startup programs',
      items: ['20+ OSS Programs', '5+ Bootcamps', '5+ Startup Programs'],
    },
  ];

  const sections = [
    {
      name: 'DataMagic',
      description:
        `The Essential AI Assistant for Developers. QueryDB uses natural language and AI to query databases in seconds. Cut SQL writing time by 90%. Unlock insights faster with auto-generated SQL. Intuitive plain English interface makes querying easy. The future of SQL is here with QueryDB's AI assistant`,
      features: devgptFeatures,
    },
    {
      name: 'Exclusive Community',
      description:
        'While we have an amazing free community of 250+ developers on Discord, we have an even more amazing exclusive sub-community for our Pro users.',
      features: exclusiveCommunityFeatures,
    },

  ];

  const testimonials = [
    {
      content:
        "To every dev out there! @getdevkit team is building an amazing tool to make a dev's life easier. Has an all-in-one package of features a dev uses on a daily basis running on a well-crafted UI.",
      name: 'Tomás Healy',
      title: 'Software Engineer, Skyscanner',
      image: '/images/tomas.png',
    },
    {
      content:
        "I’m glad we invested in DevKit. It paced up productivity by a large factor. It makes every developer look good. One of our Leads quoted that “it’d be every developer's bookmark”",
      name: 'Prabhu M C',
      title: 'Founder & Product Architect, Datadrone',
      image: '/images/prabhu.png',
    },
  ];

  const tagline = (
    <>
      The Essential <br />
      Database Tool
    </>
  );
  const subTagline = 'Powerful tools for everyday developer needs';

  return (
    <>
      <Head>
        <title>DataMagic | The Essential Database Tool</title>
      </Head>
      {heroSectionVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-12 p-6 xl:p-0">
            <div className="col-span-12 py-12 pt-0 text-center">
              <div className="mx-auto mb-6 w-min">
                <a
                  className="inline-block flex h-6 w-min cursor-pointer items-center whitespace-nowrap rounded-full border border-solid border-white bg-white bg-opacity-[0.1] px-3 py-0 align-baseline text-xs font-medium leading-7 hover:cursor-pointer hover:bg-white hover:bg-opacity-[0.2] hover:text-white"
                  rel="noopener"
                  href="https://getdevkit.com/blog/we-raised-10k-from-zfellows"
                  style={{
                    textDecoration: 'none',
                    transition:
                      'background 260ms ease 0s, width 0s ease 0s',
                    outline: 'none',
                    animation:
                      '1200ms ease 0ms 1 normal backwards running gisjuz',
                    borderColor:
                      'rgba(255, 255, 255, 0.05)',
                    fontSize: '13px',
                    height: '28px',
                  }}
                >
                  <div className="m-0 border-0 p-0 align-baseline">
                    We Raised $10K from ZFellows 🥳
                  </div>
                </a>
              </div>
              <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-bold leading-none tracking-tight sm:text-4xl lg:text-7xl">
                {tagline}
              </h1>
              <h2 className="mx-auto mb-6 w-full text-xl tracking-normal opacity-80 lg:w-full lg:text-2xl">
                {subTagline}
              </h2>
              <div className="mb-8 mt-8 xl:mb-0">
                <div className="flex justify-center gap-4">
                  <Link href={getStartedLink}>
                    <Button
                      className="nextui-blue-btn mx-auto"
                      shadow
                      size="lg"
                      auto
                      style={{ padding: '20px 24px' }}
                    >
                      Get Started
                    </Button>
                  </Link>
                  <a
                    href={discordLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="next-ui-gradient-btn mx-auto"
                      color="gradient"
                      shadow
                      size={'lg'}
                      auto
                      style={{ padding: '20px 24px' }}
                    >
                      Join our Community
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div
              className="col-span-12 mt-0 text-center"
              style={{ position: 'relative' }}
            >
              <img
                src="/screenshots/datamagic.png"
                className="shadow-2xl shadow-white/20"
                alt="screenshot"
              />
            </div>
          </div>
        </motion.div>
      )}

      <div className="mx-auto my-60 max-w-6xl px-6 xl:p-0">
        <h2 className="mx-auto mb-12 max-w-3xl text-center text-3xl font-semibold tracking-normal text-white">
          Over {uniqueVisitorsCount} developers have already used
          DevKit
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-3 flex-wrap items-center justify-center gap-4 gap-y-3 text-center sm:grid-cols-6 md:grid-cols-6 xl:grid-cols-12">
          {logos.map((logo) => (
            <div
              key={`${logo}`}
              className="col-span-3 flex items-center justify-center sm:col-span-2 xl:col-span-3"
            >
              {logo === '/images/logos/bolt.png' ? (
                <img
                  src={logo}
                  alt="Company Logo"
                  className="mx-auto aspect-video object-contain p-3"
                  style={{
                    maxHeight: '100px',
                    minWidth: '100px',
                  }}
                />
              ) : (
                <img
                  src={logo}
                  alt="Company Logo"
                  className="mx-auto aspect-video object-contain p-3"
                  style={{
                    maxWidth: '160px',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {sections.map((section, index) => (
        <Section {...section} key={index} />
      ))}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="https://www.producthunt.com/posts/devkit-4?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-devkit-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=326758&theme=light"
            alt={`DevKit - The Ultimate Developer Toolkit | Product Hunt`}
            style={{ width: '250px', height: '54px' }}
            width="250"
            height="54"
          />
        </a>
      </div>

      <div
        className="z-10 mx-auto my-40 max-w-6xl px-6 text-white xl:p-0"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="mb-12 text-center text-4xl font-semibold">
          What our users are saying
        </div>
        {/* <div className="grid max-w-6xl grid-cols-6 gap-y-8 xl:grid-cols-12 xl:gap-x-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial testimonial={testimonial} key={index} />
          ))}
        </div> */}

        {/* <div className="py-6"> */}
        {/* <h2 className="mb-6 text-2xl font-bold tracking-normal">
          What people are saying
        </h2> */}
        <div className="grid max-w-6xl grid-cols-1 xl:grid-cols-2 xl:gap-x-8">
          {tweetIds.map((tweetId, index) => (
            <Tweet key={tweetId} id={tweetId} />
          ))}
        </div>
        {/* </div> */}
      </div>

      <section className="my-20 mb-40">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 xl:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl xl:text-4xl">
            Skyrocket your productivity{' '}
            <img
              className="inline"
              src={'/images/rocket-apple.png'}
              style={{ height: '80px', width: '80px' }}
              alt="rocket-apple"
            />{' '}
          </h2>
          <div className="mt-8 flex justify-center space-x-3">
            <Link href={getStartedLink}>
              <Button
                className="nextui-blue-btn mx-auto"
                shadow
                size="lg"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-40 mt-60">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 xl:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl xl:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-8 flex justify-center space-x-3">
            <Collapse.Group>
              {faqs.map((faq, index) => (
                <div key={index}>
                  <Collapse
                    className="text-lg font-bold"
                    style={{
                      letterSpacing: '0.5px',
                    }}
                    title={faq.question}
                  >
                    <Text className="text-left tracking-normal">
                      {faq.answer}
                    </Text>
                  </Collapse>
                </div>
              ))}
            </Collapse.Group>
          </div>
        </div>
      </section>
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getStaticProps() {
  return { props: {} };
}
