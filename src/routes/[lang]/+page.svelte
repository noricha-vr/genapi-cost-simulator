<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { modelStore } from '$lib/models';
	import type { ModelData, Currency, ChartResult } from '$lib/types';
	import { calculateTokens, formatCurrency } from '$lib/index';
	import CostChart from '$lib/components/CostChart.svelte';
	import HowTo from '$lib/components/HowTo.svelte';
	import * as m from '$paraglide/messages';
	import type { SupportedLang } from '$lib/stores/langStore';
	import langStore from '$lib/stores/langStore';

	let systemTokens = 500;
	let inputTokens = 100;
	let outputTokens = 500;
	let iterations = 10;

	let totalInputTokens = 0;
	let totalOutputTokens = 0;

	let chart: Chart | undefined;
	let results: any[] = [];
	let chartCanvas: HTMLCanvasElement;

	const oneMillion = 1000000;

	const currencies: Currency[] = [
		{ code: 'USD', rate: 1, symbol: '$' },
		{ code: 'EUR', rate: 0.92, symbol: '€' },
		{ code: 'JPY', rate: 160, symbol: '¥' },
		{ code: 'GBP', rate: 0.77, symbol: '£' }
	];
	let selectedCurrency = currencies[0];

	// 色を保持するための状態変数
	let colors: { [key: string]: string } = {};

	// modelStoreを購読
	let modelData: ModelData[];
	const unsubscribe = modelStore.subscribe((value: ModelData[]) => {
		modelData = value;
	});

	// langStoreを購読
	let lang: SupportedLang;
	const unsubscribeLang = langStore.subscribe((value: SupportedLang) => {
		lang = value;
	});

	// コンポーネントのアンマウント時にunsubscribe
	onMount(() => {
		return () => {
			unsubscribe();
			unsubscribeLang();
		};
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

	$: if (selectedCurrency !== undefined && results.length > 0 && chartCanvas) {
		updateChart(results, selectedCurrency);
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

	function updateChart(results: any[], selectedCurrency: Currency) {
		console.log('updateChart');

		if (!chartCanvas) {
			console.error('Chart canvas is not initialized');
			return;
		}

		if (chart) {
			chart.destroy();
		}

		const ctx = chartCanvas.getContext('2d');
		if (!ctx) {
			console.error('Failed to get 2D context from canvas');
			return;
		}

		const datasets = modelData.map((model) => ({
			label: model.name,
			data: results.map((result) => result[model.name]),
			borderColor: colors[model.name],
			backgroundColor: colors[model.name],
			fill: false,
			hidden: !model.active // ここで初期表示状態を設定
		}));

		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: results.map((result) => result.iteration),
				datasets: datasets
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						title: {
							display: true,
							text: m.iterations(),
							font: {
								size: 14 // フォントサイズを大きくする
							}
						},
						ticks: {
							font: {
								size: 12 // 軸のラベルのフォントサイズを大きくする
							}
						}
					},
					y: {
						title: {
							display: true,
							text: `${m.cumulativeCost()} (${selectedCurrency.symbol})`,
							font: {
								size: 14 // フォントサイズを大きくする
							}
						},
						ticks: {
							callback: function (value: number | string) {
								return selectedCurrency.symbol + Number(value).toFixed(2);
							},
							font: {
								size: 14 // 軸のラベルのフォントサイズを大きくする
							}
						}
					}
				},
				plugins: {
					legend: {
						position: 'top',
						labels: {
							boxWidth: 12,
							usePointStyle: true,
							pointStyle: 'circle',
							font: {
								size: 14 // 凡例のフォントサイズを大きくする
							}
						}
					}
				}
			}
		});
	}

	function getRandomColor() {
		return '#' + Math.floor(Math.random() * 16777215).toString(16);
	}

	function calculateModelCosts(model: any, inputTokens: number, outputTokens: number) {
		const inputCost = (inputTokens * model.inputCost) / oneMillion;
		const outputCost = (outputTokens * model.outputCost) / oneMillion;
		const totalCost = inputCost + outputCost;
		return { inputCost, outputCost, totalCost };
	}

	function toggleModelVisibility(modelName: string) {
		const modelIndex = modelData.findIndex((m) => m.name === modelName);
		if (modelIndex !== -1) {
			modelData[modelIndex] = { ...modelData[modelIndex], active: !modelData[modelIndex].active };
			modelData = [...modelData]; // Trigger reactivity
			results = results.map((result) => {
				result[modelName] = modelData[modelIndex].active ? result[modelName] : null;
				return result;
			});
		}
	}

	function handleLangChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const selectedLang = target.value || 'en';
		window.location.href = '/' + selectedLang;
	}

	onMount(() => {
		// 初回読み込み時に色を生成し、状態変数に保存
		modelData.forEach((model) => {
			colors[model.name] = getRandomColor();
		});
	});
</script>

<header
	class="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-2 px-4 shadow-lg relative"
>
	<div class="container mx-auto">
		<div class="flex items-center space-x-4">
			<svg
				class="w-12 h-12 text-yellow-300"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M13 7H7v6h6V7z" />
				<path
					fill-rule="evenodd"
					d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
					clip-rule="evenodd"
				/>
			</svg>
			<div>
				<h1 class="text-4xl font-extrabold tracking-tight">{m.aiCostSimulator()}</h1>
				<h2 class="block text-yellow-300 text-2xl mt-1">{m.generativeAiApiCostSimulation()}</h2>
			</div>
			<select
				class="select select-sm absolute bg-blue-700 right-4 bottom-2 w-32"
				on:change={handleLangChange}
				bind:value={lang}
			>
				<option value="en">English</option>
				<option value="ja">日本語</option>
			</select>
		</div>
	</div>
</header>

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
								<td class="custom-font-lg　text-center">{model.active ? '✔' : ''}</td>
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
