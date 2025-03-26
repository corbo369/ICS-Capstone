import React from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar: React.FC = () => {
    return (
        <nav className="w-full bg-blue-600 text-white p-3 fixed top-0 left-0 z-1">
            <div className="w-full flex justify-between items-center px-4">
                <div className="text-xl font-bold">Portfolio App</div>
                <ConnectButton />
            </div>
        </nav>
    );
};

export default Navbar;