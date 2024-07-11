import { writable } from 'svelte/store';
import type { Currency } from '$lib/types';

const initialCurrencies: Currency[] = [
    { code: 'USD', rate: 1, symbol: '$' },
    { code: 'EUR', rate: 0.92, symbol: '€' },
    { code: 'JPY', rate: 160, symbol: '¥' },
    { code: 'GBP', rate: 0.77, symbol: '£' }
];

export const currencyStore = writable(initialCurrencies);
