/**
 * @file Main Navbar Component
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import React, { useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";

// Import Components
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    // Authenticate account by signing a message
    const authenticateAccount = async () => {
      // Message content
      const message = "Signature Required for Login";

      try {
        // Send message to wallet extension
        const signature = await signMessageAsync({ message });

        // Pass address, message, and signature to auth route
        const res = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address, message, signature }),
        });

        const data = await res.json();

        // Store session data
        // @ts-ignore
        localStorage.setItem("address", address.toString());
        localStorage.setItem("userId", data.userId.toString());
        localStorage.setItem("token", data.token);

        // Reload window once session is updated
        window.location.reload();
      } catch (error) {
        console.error("Authentication error", error);
      }
    }

    const storedToken = localStorage.getItem("token");
    const storedAddress = localStorage.getItem("address");

    // Checks if user changed accounts
    if (address && storedAddress && address !== storedAddress) {
      localStorage.clear();
      window.location.reload();
    }

    // Authenticate only if current session is destroyed
    if (isConnected && address && !storedToken) {
      authenticateAccount();
    }
  }, [isConnected, address]);

  return (
        <nav className="w-full bg-gray-900 text-white p-3 fixed top-0 left-0 z-1">
            <div className="w-full flex justify-between items-center px-4">
                <div className="text-xl font-bold">PORTFOLIO</div>
                <ConnectButton />
            </div>
        </nav>
    );
};

export default Navbar;