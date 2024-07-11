import { writable } from 'svelte/store';
import type { ModelData } from '$lib/types';

const initialModelData: ModelData[] = [
    // 費用は100万トークンあたりのUSD価格
    // OpenAI
    { name: 'gpt-4o', inputCost: 5.0, outputCost: 15.0, active: true },
    { name: 'gpt-3.5-turbo', inputCost: 0.5, outputCost: 1.5, active: true },
    { name: 'gpt-3.5-turbo(fine-tuning)', inputCost: 3.0, outputCost: 6.0, active: false },
    // Anthropic
    { name: 'claude-3-opus', inputCost: 15.0, outputCost: 75.0, active: false },
    { name: 'claude-3-5-sonnet', inputCost: 3.0, outputCost: 15.0, active: true },
    { name: 'claude-3-haiku', inputCost: 0.25, outputCost: 1.25, active: true },
    // Google
    {
        name: 'gemini-1.5-pro',
        inputCost: 3.5,
        outputCost: 7.0,
        active: true
    },
    {
        name: 'gemini-1.5-flash',
        inputCost: 0.35,
        outputCost: 0.7,
        active: true
    }
];

export const modelStore = writable(initialModelData);
