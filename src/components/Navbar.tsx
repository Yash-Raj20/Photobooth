"use client";

import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";

function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
      <ul className="menu menu-horizontal bg-base-200/90 backdrop-blur-md border border-base-content/10 rounded-full shadow-lg pointer-events-auto px-2 py-1 gap-1">
        <li>
          <Link className="tooltip tooltip-bottom rounded-full" data-tip="Home" href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
        </li>
        <li>
          <Link
            className="tooltip tooltip-bottom rounded-full"
            data-tip="Details"
            href="#"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Link>
        </li>
        <li>
          <Link
            className="tooltip tooltip-bottom rounded-full"
            data-tip="Gallery"
            href="#"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </Link>
        </li>

        <li className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="tooltip tooltip-bottom rounded-full"
            data-tip="Themes"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
              />
            </svg>
          </div>

          <div
            tabIndex={0}
            className="dropdown-content z-[1] w-40 p-2 shadow bg-base-100 rounded-box mt-4"
          >
            <ThemeSwitcher />
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
