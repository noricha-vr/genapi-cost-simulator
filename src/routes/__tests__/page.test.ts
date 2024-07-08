import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';

function calculateAPICosts(systemTokens: number, inputTokens: number, outputTokens: number, selectedCurrency: any, iteration: number) {
    return 100;
}

describe('calculateAPICosts', () => {
    it('should return 100', () => {
        const result = calculateAPICosts(100, 100, 100, { rate: 1 }, 1);
        expect(result).toBe(100);
        console.log(result);
    });
});
