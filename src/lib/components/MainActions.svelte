<script>
	import { ArrowUpFromLine, ArrowDownToLine, UsersRound } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const iconStroke = 1.8;
	const iconSize = 22;
	const textSize = '0.8rem';
	const buttons = [
		{ icon: 'down', label: 'Richiedi', route: '/auth/richiedi' },
		{ icon: 'up', label: 'Aiuta', route: '/auth/aiuta' },
		{ icon: 'friends', label: 'Amici', route: '/auth/amici' }
	];
</script>

<div class="mx-auto flex h-[5rem] w-[100%] space-x-4 font-medium">
	{#each buttons as button, index}
		<button
			on:click={() => goto(button.route)}
			type="button"
			class="btn w-[100%] rounded-2xl bg-[rgb(250,250,250)] text-sm shadow-sm"
		>
			<div class="flex flex-col items-center space-y-1">
				{#if button.icon === 'down'}
					<ArrowDownToLine size={iconSize} strokeWidth={iconStroke}></ArrowDownToLine>
				{:else if button.icon === 'up'}
					<ArrowUpFromLine size={iconSize} strokeWidth={iconStroke}></ArrowUpFromLine>
				{:else if button.icon === 'friends'}
					<UsersRound size={iconSize} strokeWidth={iconStroke}></UsersRound>
				{/if}
				<h1 style="font-size: {textSize}" class="font-normal">{button.label}</h1>
			</div>
		</button>
	{/each}
</div>
