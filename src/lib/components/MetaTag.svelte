<script>
	import { page } from '$app/stores';
	export let title = '';
	export let description = '';
	let canonical = $page.url.href;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta property="og:description" content={description} />
</svelte:head>
