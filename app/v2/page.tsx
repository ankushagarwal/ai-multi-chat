"use client";

import Header from "@/components/header";
import LeftSidebar from "@/components/leftsidebar";
export default function Home() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex flex-row w-full">
        <LeftSidebar />
        <div className="w-[calc(100dvw-56px)] bg-red-500">
          <main className="flex overflow-hidden h-[calc(100svh-57px)]"></main>
        </div>
      </div>
    </div>
  );
}
