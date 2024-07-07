<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

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

<main class="max-w-3xl mx-auto p-5 font-sans">
	<h1 class="text-2xl font-bold mb-4">AI Cost Calculator</h1>

	<div class="grid gap-4 mb-5 text-gray-400">
		<label class="flex justify-between items-center">
			System Tokens:
			<input type="number" bind:value={systemTokens} min="0" class="w-24 p-1 border rounded" />
		</label>
		<label class="flex justify-between items-center">
			Input Tokens:
			<input type="number" bind:value={inputTokens} min="0" class="w-24 p-1 border rounded" />
		</label>
		<label class="flex justify-between items-center">
			Output Tokens:
			<input type="number" bind:value={outputTokens} min="0" class="w-24 p-1 border rounded" />
		</label>
		<label class="flex justify-between items-center">
			Iterations:
			<input type="number" bind:value={iterations} min="1" class="w-24 p-1 border rounded" />
		</label>
	</div>

	<div class="mb-5">
		<canvas bind:this={chartCanvas} id="costChart"></canvas>
	</div>

	<div class="mb-5">
		{#if results.length > 0}
			<h2 class="text-xl font-semibold">Final Results</h2>
			<div class="flex mb-2 text-gray-200">
				<div class="mr-2">
					<span class="text-sm">Total Input Tokens:</span>
					<span class="text-base font-medium">{inputTotalTokens.toLocaleString()}</span>
				</div>
				<div>
					<span class="text-sm">Total Output Tokens:</span>
					<span class="text-base font-medium">{outputTotalTokens.toLocaleString()}</span>
				</div>
			</div>
			<table class="w-full border-collapse border border-gray-3000">
				<thead>
					<tr class="">
						<th class="border border-gray-300 p-2">Model Name</th>
						<th class="border border-gray-300 p-2">Input Cost (USD)</th>
						<th class="border border-gray-300 p-2">Output Cost (USD)</th>
						<th class="border border-gray-300 p-2">Total Cost (USD)</th>
					</tr>
				</thead>
				<tbody>
					{#each modelData as model}
						{@const costs = calculateModelCosts(model, inputTotalTokens, outputTotalTokens)}
						<tr>
							<td class="border border-gray-300 p-2">{model.name}</td>
							<td class="border border-gray-300 p-2">{costs.inputCost.toFixed(2)}</td>
							<td class="border border-gray-300 p-2">{costs.outputCost.toFixed(2)}</td>
							<td class="border border-gray-300 p-2">{costs.totalCost.toFixed(2)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</main>
