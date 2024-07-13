<script lang="ts">
	import * as m from '$paraglide/messages';
	import type { SupportedLang } from '$lib/stores/langStore';
	import langStore from '$lib/stores/langStore';
	import { onDestroy } from 'svelte';
	let lang: SupportedLang;
	const unsubscribeLang = langStore.subscribe((value: SupportedLang) => {
		lang = value;
	});

	function handleLangChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const selectedLang = target.value || 'en';
		window.location.href = '/' + selectedLang;
	}

	onDestroy(() => {
		unsubscribeLang();
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
				class="select select-sm absolute bg-blue-700 right-4 top-2 w-32"
				on:change={handleLangChange}
				bind:value={lang}
			>
				<option value="en">English</option>
				<option value="ja">日本語</option>
			</select>
		</div>
	</div>
</header>

<style>
	/* Add any specific styles for the header here */
</style>
