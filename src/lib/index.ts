export { currencyStore } from '$lib/stores/currencyStore';
const oneMillion = 1000000;

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

export function formatCurrency(amount: number, currencyCode: string): string {
    const formattedAmount = currencyCode === 'JPY' ? Math.round(amount) : amount.toFixed(2);

    switch (currencyCode) {
        case 'USD':
            return `$${formattedAmount}`;
        case 'EUR':
            return `€${formattedAmount}`;
        case 'JPY':
            return `¥${formattedAmount}`;
        case 'GBP':
            return `£${formattedAmount}`;
        default:
            return `${currencyCode} ${formattedAmount}`;
    }
}

export function calculateModelCosts(model: any, inputTokens: number, outputTokens: number) {
    const inputCost = (inputTokens * model.inputCost) / oneMillion;
    const outputCost = (outputTokens * model.outputCost) / oneMillion;
    const totalCost = inputCost + outputCost;
    return { inputCost, outputCost, totalCost };
}
