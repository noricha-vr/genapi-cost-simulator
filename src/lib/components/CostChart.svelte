<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { ModelData, Currency, ChartResult } from '$lib/types';

	export let results: ChartResult[];
	export let selectedCurrency: Currency;
	export let modelData: ModelData[];

	let chart: Chart | undefined;
	let chartCanvas: HTMLCanvasElement;
	let colors: { [key: string]: string } = {};

	onMount(() => {
		modelData.forEach((model) => {
			colors[model.name] = getRandomColor();
		});
		updateChart();
		return () => {
			if (chart) {
				chart.destroy();
			}
		};
	});

	$: if (results.length > 0 && selectedCurrency && chartCanvas) {
		updateChart();
	}

	function getRandomColor() {
		return '#' + Math.floor(Math.random() * 16777215).toString(16);
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
			borderColor: colors[model.name],
			backgroundColor: colors[model.name],
			fill: false,
			hidden: !model.active
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
							text: 'Iteration',
							font: { size: 14 }
						},
						ticks: { font: { size: 12 } }
					},
					y: {
						title: {
							display: true,
							text: `Cumulative Cost (${selectedCurrency.symbol})`,
							font: { size: 14 }
						},
						ticks: {
							callback: function (value: number | string) {
								return selectedCurrency.symbol + Number(value).toFixed(2);
							},
							font: { size: 14 }
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
							font: { size: 14 }
						}
					}
				}
			}
		});
	}
</script>

<div class="w-full h-96 md:h-128 flex justify-center items-center">
	<canvas bind:this={chartCanvas}></canvas>
</div>
