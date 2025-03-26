interface TokenInfo {
    address: string;
    name: string;
    symbol: string;
}

// ✅ Transaction Data for Different Time Frames
interface TxnData {
    buys: number;
    sells: number;
}

interface TxnHistory {
    m5: TxnData;
    h1: TxnData;
    h6: TxnData;
    h24: TxnData;
}

// ✅ Volume and Price Change Data
interface VolumeData {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
}

interface PriceChangeData {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
}

// ✅ Social & Website Information
interface WebsiteLink {
    label: string;
    url: string;
}

interface SocialLink {
    type: string;
    url: string;
}

interface InfoData {
    imageUrl: string;
    header: string;
    openGraph: string;
    websites: WebsiteLink[];
    socials: SocialLink[];
}

// ✅ Main API Data Structure
export interface PairData {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: TokenInfo;
    quoteToken: TokenInfo;
    priceNative: string;
    priceUsd: string;
    txns: TxnHistory;
    volume: VolumeData;
    priceChange: PriceChangeData;
    fdv: number;
    marketCap: number;
    pairCreatedAt: number;
    info: InfoData;
}

// ✅ Define the API Response Format
export type DexscreenerResponse = PairData[];