import React from "react";

import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";

export default function Layout({ children }) {
  return (
    <div className="text-gray-300">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
