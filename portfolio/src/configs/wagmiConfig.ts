/**
 * @file WAGMI Configuration File
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

// Import Configurations
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";

export const config = getDefaultConfig({
    appName: 'corfolio',
    projectId: '2223b57bf6bce08513c61b3eb06018f0',
    appUrl: 'https://corfolio.netlify.app',
    chains: [mainnet],
    ssr: true,
});