"use client";
import React from "react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

const HeaderAuthen = () => {
  const router = useRouter();
  const [userData, setUserData] = React.useState<any | null>(null);
  const pathName = usePathname();

  return (
    <div className="container-background pb-7">
      <div className="container relative top-0 z-10 bg-white general-header-container flex items-center justify-between rounded-lg shadow-md">
        <Link
          href="/"
          className="mr-4 cursor-pointer py-1.5 font-medium brand-name flex items-center gap-2"
        >
          <img src="/images/logo_with_line_text.png" alt="logo" />
        </Link>
        <div className="flex items-center gap-4"></div>
      </div>
    </div>
  );
};

export default HeaderAuthen;
