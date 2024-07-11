import { writable } from 'svelte/store';

export interface Currency {
    code: string;
    rate: number;
    symbol: string;
}

const initialCurrencies: Currency[] = [
    { code: 'USD', rate: 1, symbol: '$' },
    { code: 'EUR', rate: 0.92, symbol: '€' },
    { code: 'JPY', rate: 160, symbol: '¥' },
    { code: 'GBP', rate: 0.77, symbol: '£' }
];

export const currencyStore = writable(initialCurrencies);
