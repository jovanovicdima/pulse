<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Ticket } from '$lib/models/Ticket';
	import { slide } from 'svelte/transition';

	let expanded = $state(false);

	type TicketCardProps = {
		ticket: Ticket;
	};

	let { ticket }: TicketCardProps = $props();
</script>

<div class="border-background2-600 rounded-lg border">
	<div
		class="bg-background2-800 hover:bg-background2-700 flex items-center justify-between p-4 transition"
	>
		<div class="flex flex-col">
			<span class="text-lg font-semibold">{ticket.name}</span>
			<span class="text-sm text-gray-400">{ticket.available} tickets left</span>
		</div>
		<div class="flex items-center gap-4">
			<span class="text-lg font-medium">${ticket.price}</span>
			<form action="?/tempReserve" method="POST" use:enhance>
				<input type="hidden" name="name" value={ticket.name} />
				<button
					class="bg-primary-500 hover:bg-primary-400 cursor-pointer rounded px-4 py-2 font-semibold text-black"
					onclick={(e) => {
						if (expanded) {
							e.preventDefault();
						}
						expanded = !expanded;
					}}
				>
					Buy
				</button>
			</form>
		</div>
	</div>

	{#if expanded}
		<div class="bg-gray-900 p-4" transition:slide>
			<!-- Replace with your form or purchase logic -->
			<form class="space-y-3">
				<label class="block">
					<span class="text-sm text-gray-300">Your Email</span>
					<input type="email" class="text-text bg-background2-800 w-full rounded px-3 py-2" />
				</label>

				<label class="block">
					<span class="text-sm text-gray-300">Quantity</span>
					<input
						type="number"
						min="1"
						max={ticket.count}
						value="1"
						class="bg-background2-800 text-text w-20 rounded px-3 py-2"
					/>
				</label>

				<button
					type="submit"
					class="mt-2 w-full rounded bg-green-500 py-2 font-bold text-black hover:bg-green-400"
				>
					Confirm Purchase
				</button>
			</form>
		</div>
	{/if}
</div>
