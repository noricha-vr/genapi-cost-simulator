<script lang="ts">
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import type { SupportedLang } from '$lib/stores/langStore';
	import { updateLang } from '$lib/stores/langStore';
	import { page } from '$app/stores';
	export let lang: SupportedLang = $page.params.lang as SupportedLang;
	if (lang === 'en' || lang === 'ja') {
		updateLang(lang);
	}
</script>

<AppShell>
	<slot />
</AppShell>
