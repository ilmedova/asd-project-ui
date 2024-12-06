import React from "react";
import {Link, useNavigate} from "react-router-dom";

const Navbar = ({ isAuthenticated, handleLogout }) => {
    const navigate = useNavigate();

    return (
        <nav className="bg-gray-100 p-6">
            <ul className="flex space-x-4 justify-end">
                {isAuthenticated ? (
                    <>
                        <li className="space-x-3 font-bold">
                            <Link className="font-bold" to="/dashboard"></Link>
                        </li>
                        <li className="space-x-3 font-bold">
                            <button
                                onClick={() => {
                                    handleLogout();
                                    navigate("/login"); // Use navigate inside this component
                                }}
                                className="hover:text-red-700 flex items-center"
                            >
                                Logout &nbsp;
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
                                </svg>
                            </button>
                        </li>
                    </>
                    ) : (
                    <>
                    </>
                    )}
                    </ul>
                    </nav>
                    );
                };

                export default Navbar;
