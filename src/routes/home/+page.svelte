<script>
	import TopBar from '$lib/components/TopBar.svelte';
	import MainActions from '$lib/components/MainActions.svelte';
	import { AchievementsBar } from 'svelte-achievements-bar';

	const achievements = [
		{
			icon: 'hand-helping',
			text: 'Assistente'
		},
		{
			icon: 'handshake',
			text: 'Amico'
		},
		{
			icon: 'heart-handshake',
			text: 'Custode'
		},
		{
			icon: 'sun',
			text: 'Guida'
		}
	];

	let progress = 2.22;

	const iconSize = '1rem';
	const iconColor = 'rgba(12,12,20)';
	const iconLitColor = 'rgba(252,252,252)';
	const mainColor = '#3B81F6';
	const bgColor = '#e7ecef';
	const barHeight = '0.7rem';
	const textSize = '0.7rem';
</script>

<div class="mx-auto mt-[0.7rem] w-[87%]">
	<TopBar />
	<div class="mx-auto mt-12 w-[94%]">
		<AchievementsBar
			{achievements}
			{iconLitColor}
			{iconSize}
			{iconColor}
			{bgColor}
			{mainColor}
			{barHeight}
			{textSize}
			{progress}
		></AchievementsBar>
	</div>
	<div class="mt-16">
		<MainActions></MainActions>
	</div>
	<div class="mt-7">
		<h1 class="text-[1.4rem] font-semibold">Richieste recenti</h1>
	</div>
</div>
