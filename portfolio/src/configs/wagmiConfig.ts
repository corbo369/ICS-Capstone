import { getDefaultConfig } from "@rainbow-me/rainbowkit";

import { mainnet, arbitrum, base } from "wagmi/chains";

export const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [mainnet, arbitrum, base],
    ssr: true,
});