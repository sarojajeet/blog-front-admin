import React from "react";
import { Outlet } from "react-router-dom"; // ✅ import this

import Sidebar from "./Sidebar";
import Footer from "../../common/Footer";
import Header from "../../common/Header";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <div className="hidden md:block md:w-[25%] lg:w-[20%]">
        <div className="md:w-[25%] lg:w-[20%] fixed">
          <Sidebar />
        </div>
      </div>

      <div className="md:w-[75%] lg:w-[80%] w-full flex flex-col justify-between">
        <div>
          <div className="sticky top-0 z-10">
            <Header />
          </div>
          <div className="p-6">
            <main>
              <Outlet /> {/* ✅ Renders child route components here */}
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
