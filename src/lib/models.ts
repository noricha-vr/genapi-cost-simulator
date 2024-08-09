import { writable } from 'svelte/store';
import type { ModelData } from '$lib/types';

const initialModelData: ModelData[] = [
    // 費用は100万トークンあたりのUSD価格
    // OpenAI
    { name: 'gpt-4o', inputCost: 2.5, outputCost: 10.0, active: true, color: '#006400' },
    { name: 'gpt-4o-mini', inputCost: 0.15, outputCost: 0.6, active: true, color: '#007600' },
    // Anthropic
    { name: 'claude-3-opus', inputCost: 15.0, outputCost: 75.0, active: false, color: '#B08600' },
    { name: 'claude-3-5-sonnet', inputCost: 3.0, outputCost: 15.0, active: true, color: '#DAA520' },
    { name: 'claude-3-haiku', inputCost: 0.25, outputCost: 1.25, active: true, color: '#FFC700' },
    // Google
    {
        name: 'gemini-1.5-pro',
        inputCost: 3.5,
        outputCost: 7.0,
        active: true,
        color: '#4169E1'  // Royal Blue
    },
    {
        name: 'gemini-1.5-flash',
        inputCost: 0.075,
        outputCost: 0.3,
        active: true,
        color: '#1E90FF'  // Dodger Blue
    }
];

export const modelStore = writable(initialModelData);
