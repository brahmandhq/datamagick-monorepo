import React, { useEffect, useState } from "react";

import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";

import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Button } from "@nextui-org/react";

import Spinner from "@/components/Spinner";
import Input from "@/components/Input";
import { ToastContainer, toast, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Email } from "@mui/icons-material";

export default function Login() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);

    try {
      const signinResult = await signIn("email", {
        email,
        redirect: false,
      });
      setLoading(true);
      console.log(signinResult);
      console.log(status);
      if (signinResult.ok) {
        toast.success("Check your email and verify to login", {
          position: "top-right",
        });
      } else {
        console.error(signinResult.error);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  // const [isJoiningNewsletter, setIsJoiningNewsletter] = useState(true);

  // useEffect(() => {
  //   console.log({ isJoiningNewsletter });
  // }, [isJoiningNewsletter]);

  useEffect(() => {
    if (status == "authenticated") {
      router.push("/dashboard");
    }
  }, [status]);

  const shouldShowSpinner = status === "loading" || status == "authenticated";

  return (
    <div className="md:justify-left flex h-screen flex-col justify-center break-words border-0 border-solid border-white leading-6 text-white md:flex-row">
      <div
        className="login-left-side flex flex-1 flex-col break-words border-0 border-solid border-white bg-cover bg-no-repeat p-10 text-center md:flex-shrink md:text-left"
        style={{
          backgroundImage: 'url("/images/login.png")',
          backgroundPosition: "center center",
        }}
      >
        <div className="flex justify-center text-center md:mb-36 md:block md:text-left">
          <Link href="/">
            <div className="title-font mb-6 flex cursor-pointer items-center font-medium md:mb-0">
              <img src="/logo.png" className="z-10 w-16" alt="logo" />
              <span className="z-10 ml-1 text-xl font-semibold text-white">
                DataMagick
              </span>
            </div>
          </Link>
        </div>
        <p className="mt-12 text-center text-4xl font-bold sm:text-6xl md:text-left md:font-extrabold lg:pr-10">
          Making <br />
          Developers <br />
          Great <br />
          Again.
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center border-0 border-solid border-white px-8 py-6 text-white md:px-20">
        <div className="flex flex-col items-center break-words border-0 border-solid border-white">
          <div className="w-128 flex flex-col items-center border-0 border-solid border-white">
            <div className="w-128 flex flex-col items-center border-0 border-solid border-white">
              <h2 className="text-center text-2xl font-bold sm:text-4xl md:font-extrabold">
                {"Let's build something great!"}
              </h2>
            </div>
            <h2 className="mt-2 hidden max-w-lg p-0 text-center tracking-tight sm:mt-4 sm:text-lg md:block">
              Join our community to get access to cutting-edge tools and
              collaborate with like-minded developers
            </h2>
            <div className="my-4 w-full border-t border-white"></div>
          </div>
          {shouldShowSpinner && (
            <div className="flex items-center justify-center">
              <Spinner size="40px" />
            </div>
          )}
          {!shouldShowSpinner && (
            <div>
              <Button
                className="next-ui-gradient-btn mx-auto mb-3 w-9/12"
                color="gradient"
                shadow
                size={"lg"}
                auto
                style={{ padding: "20px 24px" }}
                onClick={() => signIn("google")}
              >
                <GoogleIcon className="mr-4" />
                Login with Google
              </Button>
              {/* <Button
                                className="next-ui-gradient-btn mx-auto mb-3 w-9/12"
                                color="gradient"
                                shadow
                                size={'lg'}
                                auto
                                style={{ padding: '20px 24px' }}
                                onClick={() => signIn('github')}
                            >
                                <GitHubIcon className="mr-4" />
                                Login with GitHub
                            </Button> */}
              {/* <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="w-9/12">
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    placeholder="Enter your email address"
                    className="w-full"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="next-ui-gradient-btn w-9/12 "
                  color="gradient"
                  disabled={loading}
                  size={"lg"}
                >
                  <Email className="mr-4" /> Login with Email
                </Button>
              </form> */}
              <div className="mx-auto w-9/12 text-left">
                {/* <div className="mt-4">
                <input
                  type="checkbox"
                  checked={isJoiningNewsletter}
                  onChange={(e) => setIsJoiningNewsletter(e.target.checked)}
                />
                <span className="ml-2 text-xs">
                  Join our{" "}
                  <a
                    href="https://devkit.substack.com"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Substack newsletter
                  </a>
                </span>
              </div> */}
                <div className="mt-4 border-0 border-solid border-white">
                  <p className="border-0 border-solid border-white text-left text-xs text-neutral-400">
                    By logging in, you acknowledge that you have read,
                    understood, and agree to our&nbsp;
                    <a
                      href="https://getdevkit.com/terms-of-service"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "underline",
                      }}
                      className="text-neutral-400"
                    >
                      Terms of Service
                    </a>
                    &nbsp;and&nbsp;
                    <a
                      href="https://getdevkit.com/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "underline",
                      }}
                      className="text-neutral-400"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
