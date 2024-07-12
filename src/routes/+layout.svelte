<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, Avatar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { setLanguageTag } from '$paraglide/runtime';
	import { onMount } from 'svelte';

	onMount(() => {
		const lang = $page.params.lang;
		if (lang) {
			setLanguageTag(lang);
		}
	});
</script>

<AppShell>
	<slot />
</AppShell>
