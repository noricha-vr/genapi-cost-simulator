<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { AppShell, AppBar, Avatar } from '@skeletonlabs/skeleton';

	let systemTokens = 500;
	let inputTokens = 100;
	let outputTokens = 500;
	let iterations = 10;

	let inputTotalTokens = 0;
	let outputTotalTokens = 0;

	let chart: Chart | undefined;
	let results: any[] = [];
	let chartCanvas: HTMLCanvasElement;

	const modelData = [
		// 費用は100万トークンあたりのUSD価格
		// OpenAI
		{ name: 'gpt-4o-2024-05-13', inputCost: 5.0, outputCost: 15.0 },
		{ name: 'gpt-3.5-turbo-0125', inputCost: 0.5, outputCost: 1.5 },
		{ name: 'gpt-3.5-turbo(fine-tuning)', inputCost: 3.0, outputCost: 6.0 },
		// Anthropic
		{ name: 'claude-3-opus-20240229', inputCost: 15.0, outputCost: 75.0 },
		{ name: 'claude-3-5-sonnet-20240620', inputCost: 3.0, outputCost: 15.0 },
		{ name: 'claude-3-haiku-20240307', inputCost: 0.25, outputCost: 1.25 }
	];

	$: {
		if (
			systemTokens !== undefined &&
			inputTokens !== undefined &&
			outputTokens !== undefined &&
			iterations !== undefined
		) {
			calculateAICosts();
		}
	}

	$: if (results.length > 0 && chartCanvas) {
		updateChart();
	}

	function calculateAICosts() {
		console.log(
			`SystemTokens: ${systemTokens}, inputTokens: ${inputTokens}, outputTokens: ${outputTokens}, iterations: ${iterations}`
		);

		results = [];
		inputTotalTokens = 0;
		outputTotalTokens = 0;

		let cumulativeTokens = 0;
		let previousCost = 0;
		for (let i = 0; i < iterations; i++) {
			const iterationResult: any = {
				iteration: i + 1
			};
			let cumulativeCost = 0;
			modelData.forEach((model) => {
				const inputCost =
					((systemTokens + inputTokens + cumulativeTokens) * model.inputCost) / 1000000;
				const outputCost = (outputTokens * model.outputCost) / 1000000;
				const currentCost = inputCost + outputCost;
				cumulativeCost = currentCost + previousCost;
				iterationResult[`${model.name}`] = cumulativeCost;
			});
			results.push(iterationResult);
			cumulativeTokens += inputTokens + outputTokens;
			previousCost = cumulativeCost;
			inputTotalTokens += systemTokens + inputTokens + cumulativeTokens;
			outputTotalTokens += outputTokens;
		}
		console.log(results);
	}

	function updateChart() {
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
			borderColor: getRandomColor(),
			fill: false
		}));

		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: results.map((result) => result.iteration),
				datasets: datasets
			},
			options: {
				responsive: true,
				scales: {
					x: {
						title: {
							display: true,
							text: 'Iteration'
						}
					},
					y: {
						title: {
							display: true,
							text: 'Cumulative Cost ($)'
						},
						ticks: {
							callback: function (value: number | string) {
								return '$' + Number(value).toFixed(2);
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
		const inputCost = (inputTokens * model.inputCost) / 1000000;
		const outputCost = (outputTokens * model.outputCost) / 1000000;
		const totalCost = inputCost + outputCost;
		return { inputCost, outputCost, totalCost };
	}

	onMount(() => {
		calculateAICosts();
	});
</script>

<header class="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-2 px-4 shadow-lg">
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
				<h1 class="text-4xl font-extrabold tracking-tight">
					<span class="block">AI Cost Calculator</span>
					<span class="block text-yellow-300 text-2xl mt-1">Generative AI API Cost Simulator</span>
				</h1>
			</div>
		</div>
	</div>
</header>

<div class="container mx-auto p-4 space-y-8">
	<div class="card p-4 variant-soft">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<label class="label">
				<span>System Tokens:</span>
				<input type="number" bind:value={systemTokens} min="0" class="input" />
			</label>
			<label class="label">
				<span>Input Tokens:</span>
				<input type="number" bind:value={inputTokens} min="0" class="input" />
			</label>
			<label class="label">
				<span>Output Tokens:</span>
				<input type="number" bind:value={outputTokens} min="0" class="input" />
			</label>
			<label class="label">
				<span>Iterations:</span>
				<input type="number" bind:value={iterations} min="1" class="input" />
			</label>
		</div>
	</div>

	<div class="card p-4 variant-soft">
		<div class="w-full h-96">
			<canvas bind:this={chartCanvas} class="w-full h-full"></canvas>
		</div>
	</div>

	{#if results.length > 0}
		<div class="card p-4 variant-soft">
			<h2 class="h2 mb-4">Final Results</h2>
			<div class="flex flex-wrap gap-4 mb-4">
				<div>
					<span class="font-bold">Total Input Tokens:</span>
					<span>{inputTotalTokens.toLocaleString()}</span>
				</div>
				<div>
					<span class="font-bold">Total Output Tokens:</span>
					<span>{outputTotalTokens.toLocaleString()}</span>
				</div>
			</div>
			<div class="table-container">
				<table class="table table-hover">
					<thead>
						<tr>
							<th class="table-cell-fit">Model Name</th>
							<th class="text-right">Input (USD)</th>
							<th class="text-right">Output (USD)</th>
							<th class="text-right">Total (USD)</th>
						</tr>
					</thead>
					<tbody>
						{#each modelData as model}
							{@const costs = calculateModelCosts(model, inputTotalTokens, outputTotalTokens)}
							<tr class="custom-font-lg">
								<td class="custom-font-lg w-1/2">{model.name}</td>
								<td class="text-right custom-font-lg w-1/6">${costs.inputCost.toFixed(2)}</td>
								<td class="text-right custom-font-lg w-1/6">${costs.outputCost.toFixed(2)}</td>
								<td class="text-right custom-font-lg">${costs.totalCost.toFixed(2)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<style>
	.custom-font-base {
		font-size: 1rem !important;
	}
	.custom-font-lg {
		font-size: 1.125rem !important;
	}
</style>
