export type ModelData = {
    name: string;
    inputCost: number;
    outputCost: number;
    active: boolean;
    color: string;
};

export type Currency = {
    code: string;
    rate: number;
    symbol: string;
};

export interface ChartResult {
    iteration: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    [key: string]: string | number;
}
