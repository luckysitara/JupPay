'use client'
import React from "react";
import Image from "next/image";
import logo1 from "../public/images/logo2.png";
import { Button } from "./ui/button";
import bg from "../public/images/tropic.png";
import orbit from "../public/images/orbit.png";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const GetStarted = () => {
  const handleRoute = () => {
    console.log("Route to merchant registration");
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${bg.src})`,
      }}
      className="w-full h-[100vh] flex flex-col justify-between items-center"
    >
      <nav className="flex w-full px-4 items-center justify-between">
        <Image
          src={logo1}
          alt="Get Started"
          width={100}
          height={100}
          className=""
        />

        <Button className="bg-gradient-to-r from-gradientOne to-gradientTwo hover:bg-gradient-to-r hover:from-gradientTwo hover:to-gradientOne transition-all duration-300 ease-in-out">
          Connect Wallet
        </Button>
      </nav>
      <div className="w-full h-auto flex flex-col items-center justify-center text-white px-4">
        <Image
          src={orbit}
          alt="Get Started"
          width={100}
          height={100}
          className="w-[60%] md:w-[18%]"
        />

        <p className="text-lg md:text-xl text-center">
          Your Crypto Payment Gateway <br /> Accept Any Token, Get Settled in USDC.
        </p>

        <Button
          className={`
        group relative bg-zinc-800/80 hover:bg-zinc-800 text-white rounded-full pr-1 pl-6
        transition-all duration-200 ease-in-out mt-4 border border-gradientOne/20`}
          onClick={handleRoute}
        >
          Get started
          <span
            className="
        ml-2 p-1.5 rounded-full bg-emerald-400 
        group-hover:bg-emerald-500 transition-colors
      "
          >
            <ArrowRight className="w-4 h-4 text-black" />
          </span>
        </Button>
      </div>
      <p className="text-center text-white pb-4 hover:underline">
        Powered by
        <Link
          href={"https://x.com/JupiterExchange"}
          className="text-gradientOne pl-1"
        >
          Jupiter
        </Link>
      </p>
    </div>
  );
};

export default GetStarted;
