<script lang="ts">
	import type { Event } from '$lib/models/Event';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	type EventCardProps = {
		event: Event;
	};

	let { event }: EventCardProps = $props();
</script>

<div class="border-background2-600 bg-background2-800 hover:bg-background2-700 rounded-lg border">
	<div
		class="mx-2 h-96 max-w-screen-xl gap-8 px-1 py-2 sm:py-4 md:grid md:grid-cols-2 lg:px-4 xl:gap-16"
	>
		{#if event.image && event.image !== ''}
			<div class="w-full overflow-hidden rounded-md">
				<img
					aria-hidden="true"
					class="h-full w-full object-cover"
					src={`/eventImages/${event.image}`}
					alt="event image preview"
				/>
			</div>
		{:else}
			<div class="w-full overflow-hidden rounded-md">
				<img
					aria-hidden="true"
					class="h-full w-full object-cover"
					src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"
					alt="event image preview"
				/>
			</div>
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
				<p class="mb-6 line-clamp-4 font-light text-gray-400 md:text-lg">
					{event.description}
				</p>
			</div>

			<a
				href={`event/${event.id}`}
				class="bg-primary-500 hover:bg-primary-600 focus:ring-primary-300 inline-flex w-fit items-center rounded-lg px-5 py-2.5 text-center text-sm font-bold text-black focus:ring-4"
			>
				View details
				<svg
					class="-mr-1 ml-2 h-5 w-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
						clip-rule="evenodd"
					></path></svg
				>
			</a>
		</div>
	</div>
</div>
