<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../app.css';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Header {data} />

	<div class="flex flex-1 justify-center">
		<main class="box-border flex w-full max-w-5xl flex-1 flex-col p-1">
			{@render children()}
		</main>
	</div>
</div>
