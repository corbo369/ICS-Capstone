/**
 * @file WAGMI Configuration File
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Configurations
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";

export const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [mainnet],
    ssr: true,
});