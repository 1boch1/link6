<script>
	import { ArrowUpFromLine, ArrowDownToLine, UserRoundPlus } from 'lucide-svelte';

	const iconStroke = 1.8;
	const iconSize = 22;
	const textSize = '0.8rem';
	const buttons = [
		{ icon: 'down', label: 'Richiedi' },
		{ icon: 'up', label: 'Aiuta' },
		{ icon: 'addfriend', label: 'Aggiungi' }
	];
</script>

<div class="mx-auto flex h-[5rem] w-[100%] space-x-4 font-medium">
	{#each buttons as button, index}
		<button type="button" class="btn variant-ringed-primary w-[100%] rounded-2xl text-sm">
			<div class="flex flex-col items-center space-y-1">
				{#if button.icon === 'down'}
					<ArrowDownToLine size={iconSize} strokeWidth={iconStroke}></ArrowDownToLine>
				{:else if button.icon === 'up'}
					<ArrowUpFromLine size={iconSize} strokeWidth={iconStroke}></ArrowUpFromLine>
				{:else if button.icon === 'addfriend'}
					<UserRoundPlus size={iconSize} strokeWidth={iconStroke}></UserRoundPlus>
				{/if}
				<h1 style="font-size: {textSize}" class="font-normal">{button.label}</h1>
			</div>
		</button>
	{/each}
</div>
