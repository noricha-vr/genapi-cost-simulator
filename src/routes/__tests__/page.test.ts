import { describe, it, expect } from 'vitest';

function calculateTokens(
    systemTokens: number,
    inputTokens: number,
    outputTokens: number,
    iteration: number
): {
    totalInputTokens: number;
    totalOutputTokens: number;
} {
    let totalInputTokens = 0;
    for (let i = 0; i < iteration; i++) {
        const currentTokens = inputTokens * (i + 1) + outputTokens * i;
        totalInputTokens += currentTokens
    }
    totalInputTokens += systemTokens;
    const totalOutputTokens = outputTokens * iteration;
    return { totalInputTokens, totalOutputTokens };
}

describe('calculateTokens', () => {
    // 100 input tokens, 100 output tokens, 100 system tokens, 1 iteration
    const stepTokens = calculateTokens(100, 100, 100, 1);
    console.log(stepTokens);
    it('should return 200', () => {
        expect(stepTokens.totalInputTokens).toBe(200);
    });

    it('should return 100', () => {
        expect(stepTokens.totalOutputTokens).toBe(100);
    });
    // 100 input tokens, 100 output tokens, 100 system tokens, 2 iterations
    const stepTokens2 = calculateTokens(100, 100, 100, 2);
    console.log(stepTokens2);
    it('should return 300', () => {
        expect(stepTokens2.totalInputTokens).toBe(500);
    });
    it('should return 200', () => {
        expect(stepTokens2.totalOutputTokens).toBe(200);
    });
    // 100 input tokens, 100 output tokens, 100 system tokens, 3 iterations
    const stepTokens3 = calculateTokens(100, 100, 100, 3);
    console.log(stepTokens3);
    it('should return 400', () => {
        expect(stepTokens3.totalInputTokens).toBe(1000);
    });
    it('should return 300', () => {
        expect(stepTokens3.totalOutputTokens).toBe(300);
    });
});
