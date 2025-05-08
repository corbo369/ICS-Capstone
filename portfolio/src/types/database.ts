export interface Asset {
    AssetID: number;
    Name: string;
    Symbol: string;
    ChainID: string;
    ContractAddress: string;
    ImagePath: string;
}

export interface Holding {
    Name: string;
    Amount: number;
    Symbol: string;
    ImagePath: string;
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
    ImagePath: string;
    Price: number;
    Date: string;
}

export interface BalanceChangeReport {
    FirstTransactionDate: string;
    LastTransactionDate: string;
    Name: string;
    Symbol: string;
    ImagePath: string;
    BalanceChange: number;
}

export interface RealizedProfitReport {
    FirstTransactionDate: string;
    LastTransactionDate: string;
    Name: string;
    Symbol: string;
    ImagePath: string;
    RealizedProfit: number;
}

export interface TaxInformationReport {
    AssetID: number;
    Name: string;
    Symbol: string;
    ImagePath: string;
    TotalLongTermEligibleAmount: number;
    TotalLongTermCapitalGains: number;
    TotalShortTermEligibleAmount: number;
    TotalShortTermCapitalGains: number;
}

export interface CompleteTaxReport extends TaxInformationReport {
    ShortTermGains: number;
    LongTermGains: number;
}