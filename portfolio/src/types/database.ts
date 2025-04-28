export interface Asset {
    AssetID: number;
    Name: string;
    Symbol: string;
    ChainID: string;
    ContractAddress: string;
}

export interface Holding {
    Name: string;
    Amount: number;
    Symbol: string;
    ChainID: string;
    ContractAddress: string;
    AveragePrice: number;
    Price: number;
    PNL: number;
}

export interface Transaction {
    TransactionID: number;
    Type: boolean;
    Name: string;
    Amount: number;
    Symbol: string;
    Price: number;
    Date: string;
}