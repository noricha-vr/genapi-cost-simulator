export function calculateTokens(
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
