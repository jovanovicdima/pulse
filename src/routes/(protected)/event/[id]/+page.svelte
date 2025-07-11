<script lang="ts">
	import TicketCard from './../../../../lib/components/TicketCard.svelte';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import type { PageProps } from './$types';

	dayjs.extend(relativeTime);

	const { data }: PageProps = $props();
	const event = data.event;
	const tickets = data.tickets;
</script>

<div class="mx-2 flex flex-col gap-12 px-1 py-2 sm:py-4 lg:px-4">
	<div class="max-w-screen-xl gap-4 sm:grid sm:grid-cols-2 md:gap-8 xl:gap-16">
		{#if event.image}
			<img
				aria-hidden="true"
				class="w-full rounded-md"
				src={event.image}
				alt="event image preview"
			/>
		{:else}
			<img
				aria-hidden="true"
				class="w-full rounded-md"
				src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"
				alt="event image preview"
			/>
		{/if}

		<div class="my-2 flex flex-col justify-between">
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<h2 class="text-text text-4xl font-extrabold tracking-tight">
						{event.title}
					</h2>
					<p class="ml-1 text-xs font-light text-gray-500">
						Posted by {event.postedBy}
						{dayjs().to(dayjs(event.postedAt))}
					</p>
					<p class="flex items-center gap-1 text-sm font-light text-gray-400">
						<svg
							class="h-4 w-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6v6l4 2m4-2a8 8 0 11-16 0 8 8 0 0116 0z"
							/>
						</svg>

						{dayjs(event.datetime)}
					</p>
					<p class="flex items-center gap-1 text-sm font-light text-gray-400">
						<svg
							class="h-4 w-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 10a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.5 10c0 7.5-7.5 11.25-7.5 11.25S4.5 17.5 4.5 10a7.5 7.5 0 1115 0z"
							/>
						</svg>

						{event.location}
					</p>
				</div>
				<p class="mb-6 font-light text-gray-400 md:text-lg">
					{event.description}
				</p>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		{#each tickets as ticket}
			<TicketCard {ticket} />
		{/each}
	</div>
</div>
