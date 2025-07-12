<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Ticket } from '$lib/models/Ticket';
	import { slide } from 'svelte/transition';
	import Spinner from './Spinner.svelte';

	let expanded = $state(false);

	type TicketCardProps = {
		ticket: Ticket;
		onTicketPurchase: () => void;
	};

	let { ticket, onTicketPurchase }: TicketCardProps = $props();

	let isPurchaseLoading = $state(false);
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
			{#if ticket.available > 0}
				<span class="text-lg font-medium">${ticket.price}</span>
			{/if}
			<form action="?/tempReserve" method="POST" use:enhance>
				<input type="hidden" name="name" value={ticket.name} />
				<button
					disabled={ticket.available <= 0}
					class="{ticket.available
						? 'bg-primary-500 hover:bg-primary-400 cursor-pointer'
						: ' bg-primary-700 cursor-not-allowed'} rounded px-4 py-2 font-semibold text-black"
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
			<form
				class="text-text space-y-6 text-sm"
				method="POST"
				action="?/buy"
				use:enhance={() => {
					isPurchaseLoading = true;
					return async ({ update }) => {
						await update();
						onTicketPurchase();
						isPurchaseLoading = false;
						expanded = false;
					};
				}}
			>
				<input type="hidden" name="name" value={ticket.name} />
				<div>
					<span class="mb-1 block">Card Type</span>
					<select class="bg-background2-800 text-text w-full cursor-pointer rounded px-3 py-2">
						<option>Visa</option>
						<option>Mastercard</option>
						<option>American Express</option>
						<option>Discover</option>
						<option>JCB</option>
					</select>
				</div>

				<div class="space-y-3">
					<label class="block">
						<span>Card Number</span>
						<input
							type="text"
							inputmode="numeric"
							placeholder="1234 5678 9012 3456"
							class="bg-background2-800 text-text w-full rounded px-3 py-2"
						/>
					</label>

					<div class="flex flex-col sm:flex-row sm:gap-3">
						<label class="flex-1">
							<span>Expiration Date</span>
							<input
								type="text"
								placeholder="MM/YY"
								class="bg-background2-800 text-text w-full rounded px-3 py-2"
							/>
						</label>

						<label class="mt-3 sm:mt-0 sm:w-32">
							<span>Security Code</span>
							<input
								type="text"
								placeholder="CVC"
								class="bg-background2-800 text-text w-full rounded px-3 py-2"
							/>
						</label>
					</div>
				</div>

				<div>
					<h2 class="mb-2 text-base font-semibold">Billing Information</h2>

					<div class="mb-3 flex flex-col sm:flex-row sm:gap-3">
						<input
							type="text"
							placeholder="First name"
							class="bg-background2-800 text-text w-full rounded px-3 py-2"
						/>
						<input
							type="text"
							placeholder="Last name"
							class="bg-background2-800 text-text mt-3 w-full rounded px-3 py-2 sm:mt-0"
						/>
					</div>

					<div class="mb-3 flex flex-col sm:flex-row sm:gap-3">
						<input
							type="text"
							placeholder="City"
							class="bg-background2-800 text-text w-full rounded px-3 py-2"
						/>
						<input
							type="text"
							placeholder="Zip or postal code"
							class="bg-background2-800 text-text mt-3 w-full rounded px-3 py-2 sm:mt-0"
						/>
					</div>

					<input
						type="text"
						placeholder="Billing address"
						class="bg-background2-800 text-text mb-3 w-full rounded px-3 py-2"
					/>

					<input
						type="text"
						placeholder="Billing address, line 2 (optional)"
						class="bg-background2-800 text-text mb-3 w-full rounded px-3 py-2"
					/>

					<div class="mb-3 flex flex-col sm:flex-row sm:gap-3">
						<input
							type="text"
							placeholder="Country"
							class="bg-background2-800 text-text w-full rounded px-3 py-2"
						/>
						<input
							type="text"
							placeholder="Phone number"
							class="bg-background2-800 text-text mt-3 w-full rounded px-3 py-2 sm:mt-0"
						/>
					</div>
				</div>

				{#if isPurchaseLoading}
					<div class="flex w-full justify-center">
						<Spinner />
					</div>
				{:else}
					<button
						type="submit"
						class="w-full cursor-pointer rounded bg-green-500 py-2 font-bold text-black hover:bg-green-400"
					>
						Confirm Purchase
					</button>
				{/if}
			</form>
		</div>
	{/if}
</div>
