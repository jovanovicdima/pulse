<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const events = data.events;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="my-4 flex w-full flex-col items-center">
	<div class="mx-2 min-h-screen space-y-4">
		<h1 class="text-center text-3xl font-bold">Upcoming Events</h1>

		{#each events as event}
			<EventCard {event} />
		{/each}
	</div>
</section>

<style>
</style>
