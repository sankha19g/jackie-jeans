"use client";
import Link from "next/link";
import Button from "./components/button";
import Logo from "./components/logo";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Logo />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h1 className="text-4xl font-bold text-center">Welcome to Jackie Jeans</h1>
        <div className="flex flex-row gap-5 justify-center">
          <Link href="/manual-quiz" className="mt-4 block text-center">
            <Button text="Fill Manually" onClick={() => { localStorage.removeItem("fitProfile"); }} />
          </Link>
          <Link href="/ai-quiz" className="mt-4 block text-center">
            <Button text="Start with AI" onClick={() => { localStorage.removeItem("fitProfile"); }} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
