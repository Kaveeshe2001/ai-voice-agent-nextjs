"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <div>
      <h2 className="text-yellow-200">Hello</h2>
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  );
}
