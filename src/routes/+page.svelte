<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	let systemTokens = 500;
	let inputTokens = 1000;
	let outputTokens = 500;
	let iterations = 10;

	let inputTotalTokens = 0;
	let outputTotalTokens = 0;

	let chart: Chart | undefined;
	let results: any[] = [];
	let chartCanvas: HTMLCanvasElement;

	const modelData = [
		{ name: 'GPT-3.5-turbo', inputCost: 0.00005, outputCost: 0.00015 },
		{ name: 'GPT-4', inputCost: 0.00003, outputCost: 0.00006 },
		{ name: 'Claude 3 Opus', inputCost: 0.000015, outputCost: 0.000045 }
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
		let cumulativeTokens = 0;
		let previousCost = 0;
		for (let i = 0; i < iterations; i++) {
			const iterationResult: any = {
				iteration: i + 1
			};
			modelData.forEach((model) => {
				const inputCost = (systemTokens + inputTokens + cumulativeTokens) * model.inputCost;
				const outputCost = outputTokens * model.outputCost;
				const currentCost = inputCost + outputCost;
				const cumulativeCost = currentCost + previousCost;
				previousCost = cumulativeCost;
				iterationResult[`${model.name}`] = cumulativeCost;
			});
			results.push(iterationResult);
			cumulativeTokens += inputTokens + outputTokens;
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

	onMount(() => {
		calculateAICosts();
	});
</script>

<main class="max-w-3xl mx-auto p-5 font-sans">
	<h1 class="text-2xl font-bold mb-4">AI Cost Calculator</h1>

	<div class="grid gap-4 mb-5 text-gray-400">
		<label class="flex justify-between items-center">
			Initial Tokens:
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
			<h2 class="text-xl font-semibold mb-2">Final Results:</h2>
			<p>Input Total Tokens: {inputTotalTokens}</p>
			<p>Output Total Tokens: {outputTotalTokens}</p>
			{#each modelData as model}
				<p>
					{model.name} Cumulative Cost: ${results[results.length - 1][`${model.name}`].toFixed(2)}
				</p>
			{/each}
		{/if}
	</div>
</main>
