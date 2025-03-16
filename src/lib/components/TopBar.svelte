<script>
	import { MessagesSquare, Settings } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	export let new_messages = false;
	export const iconsSize = 25;
	export const logoSize = '1.65rem';
	export const iconsStroke = 1.75;
</script>

<div class="topBar">
	<button on:click={() => goto('/auth/settings')}>
		<Settings size={iconsSize} strokeWidth={iconsStroke} />
	</button>

	<p class="logo" style="font-size: {logoSize}">LINK6</p>

	<button on:click={() => goto('/auth/listaChats')}>
		{#if new_messages}
			<!-- versione con alert badge -->

			<div class="relative inline-block">
				<div
					class="absolute -end-2 -top-2 inline-flex h-2 w-2 items-center justify-center rounded-full bg-red-600 text-xs font-bold"
				></div>
				<MessagesSquare size={iconsSize} strokeWidth={iconsStroke} />
			</div>
		{:else}
			<MessagesSquare size={iconsSize} strokeWidth={iconsStroke} />
		{/if}
	</button>
</div>

<style>
	.topBar {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		font-weight: 900;
		font-style: normal;
		font-stretch: expanded;
	}
</style>
