/**
 * @file Vite Application Root
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Libraries
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

// Import CSS
import "@rainbow-me/rainbowkit/styles.css";

// Import Configurations
import { config } from "./configs/wagmiConfig.ts";

// Import Application
import App from "./App.tsx";

// Create Query Client
const queryClient = new QueryClient();

// Create Root
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>
                  <App />
              </RainbowKitProvider>
          </QueryClientProvider>
      </WagmiProvider>
  </StrictMode>,
)
