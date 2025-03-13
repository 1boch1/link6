<script>
	import { MessagesSquare, UserRoundCog } from 'lucide-svelte';

	export let new_messages = true;
	export const iconsSize = 25;
	export const logoSize = '1.65rem';
	export const iconsStroke = 1.75;
</script>

<div class="topBar">
	<UserRoundCog size={iconsSize} strokeWidth={iconsStroke} />

	<p class="logo" style="font-size: {logoSize}">LINK6</p>

	{#if new_messages}
		<!-- versione con alert badge -->
		<div class="relative inline-block">
			<span
				class="badge-icon preset-filled-error-500 absolute -top-3 -right-2 z-10 h-[0.04rem] w-[0.04rem]"
			></span>
			<MessagesSquare size={iconsSize} strokeWidth={iconsStroke} />
		</div>
	{:else}
		<MessagesSquare size={iconsSize} strokeWidth={iconsStroke} />
	{/if}
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
