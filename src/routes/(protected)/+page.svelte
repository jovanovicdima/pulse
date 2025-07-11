<script lang="ts">
	import EventCard from '$lib/components/EventCard.svelte';
	import type { Event } from '$lib/models/Event';
	import type { PageProps } from './$types';

	const events: Event[] = [
		{
			id: '1',
			title: 'Tech Meetup: AI & Web',
			description: 'Join us for a night of AI talks, networking, and pizza.',
			image:
				'https://images.unsplash.com/photo-1581091870622-2c4d1f06b683?auto=format&fit=crop&w=800&q=80', // tech event
			location: 'Belgrade, Serbia',
			datetime: '2025-07-05T18:00',
			postedBy: 'dimi_dev',
			postedAt: '2h ago'
		},
		{
			id: '2',
			title: 'Outdoor Movie Night',
			description: 'Bring a blanket and enjoy a classic film under the stars.',
			image:
				'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=800&q=80', // movie night
			location: 'Novi Sad, Serbia',
			datetime: '2025-07-01T20:30',
			postedBy: 'film_fanatic',
			postedAt: '4h ago'
		},
		{
			id: '3',
			title: 'Live Jazz in the Park',
			description: 'Relax and enjoy smooth jazz performances in the city park.',
			image:
				'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=800&q=80', // music
			location: 'Niš, Serbia',
			datetime: '2025-07-08T19:00',
			postedBy: 'jazzlover',
			postedAt: '1d ago'
		}
	];

	let { data }: PageProps = $props();

	events.push(...data.event);
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
