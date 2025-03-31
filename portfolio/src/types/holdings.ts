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

export interface Transaction {
    TransactionID: number;
    UserID: number;
    AssetID: number;
    Amount: number;
    Price: number;
    Type: boolean;
    Date: string;
    Asset?: {
        Name: string;
        Symbol: string;
    };
}