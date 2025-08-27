<script lang="ts">
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import type { PageProps } from './$types';
	import { onDestroy, onMount } from 'svelte';
	import type { Ticket } from '$lib/models/Ticket';
	import type { Event } from '$lib/models/Event';
	import { goto, invalidateAll } from '$app/navigation';
	import TicketCard from '$lib/components/TicketCard.svelte';

	dayjs.extend(relativeTime);

	const { data }: PageProps = $props();
	const event: Event = $derived(data.event!);
	let tickets: Ticket[] = $derived(data.tickets!);
	const recommendedEvents: Event[] = $derived(data.recommendedEvents!);

	let isTicketPurchased = $derived.by(() => {
		for (const ticket of tickets) {
			if (ticket.userBought) {
				return true;
			}
		}
		return false;
	});

	let eventSource: EventSource | null = null;

	let showDeleteModal = $state(false);
	let isDeleting = $state(false);

	onMount(() => {
		eventSource = new EventSource(`/api/sse/ticket-realtime?id=${event.id}`);

		eventSource.onmessage = async (event) => {
			await invalidateAll();
			tickets = data.tickets ?? [];
		};

		eventSource.onerror = (error) => {
			if (eventSource != null) {
				console.error('SSE Error:', error);
				eventSource.close();
			}
		};
	});

	onDestroy(() => {
		if (eventSource != null) {
			eventSource.close();
			eventSource = null;
		}
	});
</script>

<div class="mx-2 flex flex-col gap-12 px-1 py-2 sm:py-4 lg:px-4">
	<div class="max-w-screen-xl gap-4 sm:grid sm:grid-cols-2 md:gap-8 xl:gap-16">
		{#if event.image}
			<div class="h-96 w-full overflow-hidden rounded-md">
				<img
					aria-hidden="true"
					class="h-full w-full object-cover"
					src={`/eventImages/${event.image}`}
					alt="event image preview"
				/>
			</div>
		{:else}
			<div class="h-96 w-full overflow-hidden rounded-md">
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
								d="M19.5 10c0 7.5-7.5 11.25-7.5 11.25S4.5 17.5 4.5 10a7.5 7.5 0 1115 0z"
							/>
						</svg>

						{event.location}
					</p>
				</div>
				<p class="mb-6 line-clamp-9 font-light text-gray-400 md:text-lg">
					{event.description}
				</p>
			</div>

			{#if event.postedBy === data.userEmail}
				<div class="flex w-full items-end justify-around gap-4">
					<button
						type="button"
						class="text-primary-500 hover:text-primary-800 border-primary-500 flex w-full flex-1 cursor-pointer items-center justify-center rounded-lg border-1 py-2"
						onclick={() => {
							goto(`/edit-event/${event.id}`);
						}}>Edit</button
					>
					<button
						type="button"
						class="flex w-full flex-1 cursor-pointer items-center justify-center rounded-lg border-1 border-red-500 py-2 text-red-500 hover:text-red-800"
						onclick={() => {
							showDeleteModal = true;
						}}>Delete</button
					>
				</div>
			{/if}
		</div>
	</div>

	{#if isTicketPurchased}
		<div class="text-primary-500 flex w-full justify-center">
			<p>You already purchased ticket for this event.</p>
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			{#each tickets as ticket}
				<TicketCard
					{ticket}
					onTicketPurchase={() => {
						isTicketPurchased = true;
					}}
				/>
			{/each}
		</div>
	{/if}

	{#if recommendedEvents && recommendedEvents.length > 0}
		<h2 class="mt-8 text-center text-3xl">Recommended Events</h2>
		<div
			class="mb-14 grid grid-cols-1 gap-4 lg:[grid-template-columns:repeat(3,minmax(300px,1fr))]"
		>
			{#each recommendedEvents as event}
				<button
					class="border-background2-600 cursor-pointer rounded-lg border"
					onclick={() => {
						goto(`/event/${event.id}`, { invalidateAll: true });
					}}
				>
					<div
						class="bg-background2-800 hover:bg-background2-700 flex h-full flex-col items-start p-4 transition"
					>
						{#if event.image}
							<div class="h-48 w-full overflow-hidden rounded-md">
								<img
									aria-hidden="true"
									class="h-full w-full object-cover"
									src={`/eventImages/${event.image}`}
									alt="event image preview"
								/>
							</div>
						{:else}
							<div class="h-48 w-full overflow-hidden rounded-md">
								<img
									aria-hidden="true"
									class="h-full w-full object-cover"
									src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"
									alt="event image preview"
								/>
							</div>
						{/if}

						<div class="my-2 flex w-full flex-col items-start">
							<div class="flex flex-col gap-4">
								<div class="flex flex-col gap-2">
									<h2 class="text-text text-left text-xl font-extrabold tracking-tight">
										{event.title}
									</h2>
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
											>w-fill grid justify-center
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M19.5 10c0 7.5-7.5 11.25-7.5 11.25S4.5 17.5 4.5 10a7.5 7.5 0 1115 0z"
											/>
										</svg>

										{event.location}
									</p>
								</div>
								<p class="line-clamp-4 text-left font-light text-gray-400 md:text-lg">
									{event.description}
								</p>
							</div>
						</div>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>

{#if showDeleteModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="bg-background w-full max-w-sm rounded-lg p-6 shadow-lg">
			<h2 class="mb-4 text-xl font-bold">Confirm Deletion</h2>
			<p class="mb-6 text-gray-400">
				Are you sure you want to delete this event? This action cannot be undone.
			</p>
			<div class="flex justify-end gap-4">
				<button
					class="bg-primary-500 hover:bg-primary-600 cursor-pointer rounded px-4 py-2 text-black"
					onclick={() => {
						showDeleteModal = false;
					}}
				>
					Cancel
				</button>
				<form
					action="?/delete"
					method="POST"
					use:enhance={() => {
						isDeleting = true;

						return async ({ update }) => {
							await update();
							isDeleting = false;
							goto('/');
						};
					}}
				>
					<button
						class="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
						type="submit"
					>
						Delete
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
