<script lang="ts">
	import { onDestroy } from 'svelte';
	import { modelStore } from '$lib/models';
	import type { ModelData, Currency, ChartResult } from '$lib/types';
	import { calculateTokens, formatCurrency, calculateModelCosts } from '$lib/index';
	import CostChart from '$lib/components/CostChart.svelte';
	import HowTo from '$lib/components/HowTo.svelte';
	import * as m from '$paraglide/messages';
	import { currencyStore } from '$lib/stores/currencyStore';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import MetaTag from '$lib/components/MetaTag.svelte';
	let systemTokens = 500;
	let inputTokens = 100;
	let outputTokens = 500;
	let iterations = 10;

	let totalInputTokens = 0;
	let totalOutputTokens = 0;
	let results: any[] = [];

	const oneMillion = 1000000;

	let selectedCurrency: Currency;
	let currencies: Currency[];
	let modelData: ModelData[];

	const unsubscribers = [
		modelStore.subscribe((value: ModelData[]) => {
			modelData = value;
		}),
		currencyStore.subscribe((value: Currency[]) => {
			currencies = value;
			selectedCurrency = currencies[0];
		})
	];

	onDestroy(() => {
		unsubscribers.forEach((unsubscribe) => unsubscribe());
	});

	$: {
		if (
			systemTokens !== undefined &&
			inputTokens !== undefined &&
			outputTokens !== undefined &&
			iterations !== undefined
		) {
			const { results, totalInputTokens, totalOutputTokens } = calculateAPICosts(
				systemTokens,
				inputTokens,
				outputTokens,
				iterations
			);
		}
	}

	function calculateAPICosts(
		systemTokens: number,
		inputTokens: number,
		outputTokens: number,
		iterations: number
	): {
		results: any[];
		totalInputTokens: number;
		totalOutputTokens: number;
	} {
		results = [];
		totalInputTokens = 0;
		totalOutputTokens = 0;

		for (let i = 0; i < iterations; i++) {
			const tokens = calculateTokens(systemTokens, inputTokens, outputTokens, i + 1);
			console.debug('Iteration: ' + (i + 1));
			console.debug('Total Input Tokens: ' + tokens.totalInputTokens);
			console.debug('Total Output Tokens: ' + tokens.totalOutputTokens);
			totalInputTokens = tokens.totalInputTokens;
			totalOutputTokens = tokens.totalOutputTokens;
			let result: ChartResult = {
				iteration: i + 1,
				totalInputTokens: tokens.totalInputTokens,
				totalOutputTokens: tokens.totalOutputTokens
			};
			modelData.forEach((model) => {
				const inputCost =
					((tokens.totalInputTokens * model.inputCost) / oneMillion) * selectedCurrency.rate;
				const outputCost =
					((tokens.totalOutputTokens * model.outputCost) / oneMillion) * selectedCurrency.rate;
				const totalCost = inputCost + outputCost;
				result[`${model.name}`] = totalCost.toFixed(3);
				console.debug('Total Cost: ' + totalCost);
			});
			results.push(result);
		}

		return { results, totalInputTokens, totalOutputTokens };
	}

	function toggleModelVisibility(modelName: string) {
		const modelIndex = modelData.findIndex((model) => model.name === modelName);
		if (modelIndex !== -1) {
			modelData[modelIndex] = { ...modelData[modelIndex], active: !modelData[modelIndex].active };
			modelData = [...modelData]; // Trigger reactivity
			results = results.map((result) => {
				result[modelName] = modelData[modelIndex].active ? result[modelName] : null;
				return result;
			});
		}
	}
</script>

<Header />
<MetaTag
	title={m.generativeAiApiCostSimulation() + ' - ' + m.aiCostSimulator()}
	description={m.description()}
/>
<div class="container mx-auto p-4 space-y-8">
	<div class="card p-4 variant-soft">
		<div class="grid grid-cols-1 md:grid-cols-5 gap-4">
			<label class="label">
				<span>{m.systemTokens()}</span>
				<input type="number" bind:value={systemTokens} min="0" class="input" />
			</label>
			<label class="label">
				<span>{m.inputTokens()}</span>
				<input type="number" bind:value={inputTokens} min="0" class="input" />
			</label>
			<label class="label">
				<span>{m.outputTokens()}</span>
				<input type="number" bind:value={outputTokens} min="0" class="input" />
			</label>
			<label class="label">
				<span>{m.iterations()}</span>
				<input type="number" bind:value={iterations} min="1" max="9999" class="input" />
			</label>
			<label class="label">
				<span>{m.currency()}</span>
				<select bind:value={selectedCurrency} class="input">
					{#each currencies as currency}
						<option value={currency}>{currency.code}</option>
					{/each}
				</select>
			</label>
		</div>
		<div class="mt-3">
			{m.verifyTokenCount()}
			<a href="https://platform.openai.com/tokenizer" class="anchor" target="_blank"
				>{m.openAiTokenizer()}</a
			>
			or
			<a href="https://lunary.ai/anthropic-tokenizer" class="anchor" target="_blank"
				>{m.anthropicTokenizer()}</a
			>
		</div>
	</div>

	<div class="card p-4 variant-soft">
		<CostChart {results} {selectedCurrency} {modelData} />
	</div>

	{#if results.length > 0}
		<div class="card p-4 variant-soft">
			<h2 class="h2 mb-4">{m.finalResults()}</h2>
			<div class="flex flex-wrap gap-4 mb-4">
				<div>
					<span class="font-bold">{m.totalInputTokens()}</span>
					<span class="text-2xl font-semibold text-primary-500"
						>{totalInputTokens.toLocaleString()}</span
					>
				</div>
				<div>
					<span class="font-bold">{m.totalOutputTokens()}</span>
					<span class="text-2xl font-semibold text-primary-500"
						>{totalOutputTokens.toLocaleString()}</span
					>
				</div>
			</div>
			<div class="table-container">
				<table class="table table-hover">
					<thead>
						<tr>
							<th class="py-1"></th>
							<th class="py-1 table-cell-fit">{m.modelName()}</th>
							<th class="py-1 text-right">{m.inputCost()}</th>
							<th class="py-1 text-right">{m.outputCost()}</th>
							<th class="py-1 text-right">{m.totalCost()}</th>
						</tr>
					</thead>
					<tbody>
						{#each modelData as model}
							{@const costs = calculateModelCosts(model, totalInputTokens, totalOutputTokens)}
							<tr class="custom-font-lg" on:click={() => toggleModelVisibility(model.name)}>
								<td class="custom-font-lg text-center">{model.active ? '✔' : ''}</td>
								<td class="custom-font-lg w-1/3">{model.name}</td>
								<td class="text-right custom-font-lg w-1/6">
									{formatCurrency(costs.inputCost * selectedCurrency.rate, selectedCurrency.code)}
								</td>
								<td class="text-right custom-font-lg w-1/6">
									{formatCurrency(costs.outputCost * selectedCurrency.rate, selectedCurrency.code)}
								</td>
								<td class="text-right custom-font-lg">
									{formatCurrency(costs.totalCost * selectedCurrency.rate, selectedCurrency.code)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="mt-3">{m.selectModelCost()}</div>
			<div class="mt-3">
				<h3>{m.pricingSource()}</h3>
				<p>
					{m.pricingBasedOn()}
					<a href="https://openai.com/api/pricing/" class="anchor" target="_blank"
						>{m.openAiPricing()}</a
					>
					<a href="https://www.anthropic.com/pricing#anthropic-api" class="anchor" target="_blank"
						>{m.claudePricing()}</a
					>
					<a href="https://ai.google.dev/pricing?hl" class="anchor" target="_blank"
						>{m.geminiPricing()}</a
					>
				</p>
			</div>
		</div>
	{/if}
	<HowTo />
</div>
<Footer />

<style>
	.custom-font-lg {
		font-size: 1.125rem;
	}
	.table thead th {
		padding: 0.8rem;
	}
	.btn {
		background-color: #1d4ed8;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		cursor: pointer;
	}
	.btn:hover {
		background-color: #2563eb;
	}
</style>
