export interface Holding {
    name: string;
    symbol: string;
    chainId: string;
    address: string;
    amount: number;
    price: number;
}

export interface DexHolding {
    name: string;
    symbol: string;
    chainId: string;
    address: string;
    amount: number;
    price: number;
}

export interface DexTransaction {
    name: string; // Remove with SQL integration
    symbol: string; // Remove with SQL integration (ADD TIMESTAMP FOR SORTING)
    chainId: string;
    address: string;
    amount: number;
    price: number;
    type: boolean;
}