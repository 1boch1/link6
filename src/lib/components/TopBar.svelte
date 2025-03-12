<script>
	import { MessagesSquare, UserRoundCog } from 'lucide-svelte';

	/**
	 * Indica se ci sono nuovi messaggi.
	 * @type {boolean}
	 */
	export let new_messages = true;

	/**
	 * La dimensione delle icone.
	 * @type {number}
	 */
	export const iconsSize = 25;

	/**
	 * La dimensione del logo.
	 * @type {string}
	 */
	export const logoSize = '1.65rem';

	/**
	 * Lo spessore delle icone.
	 * @type {number}
	 */
	export const iconsStroke = 1.75;
</script>

<div class="topBar">
	<UserRoundCog size={iconsSize} strokeWidth={iconsStroke} />

	<p class="logo" style="font-size: {logoSize}">link6</p>

	{#if new_messages}
		<!-- versione con alert badge -->
		<div>
			<span class="variant-filled-error badge-icon absolute top-2 right-5 z-10 h-2 w-2" />
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
