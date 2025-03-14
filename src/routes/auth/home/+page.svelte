<script>
	import TopBar from '$lib/components/TopBar.svelte';
	import MainActions from '$lib/components/MainActions.svelte';
	import Richiesta from '$lib/components/Richiesta.svelte';
	import { AchievementsBar } from 'svelte-achievements-bar'; // pacchetto npm sviluppato da me

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

	let richieste = [
		{
			nome: 'Mario',
			testo: 'Aiuto il cane mi ha cacato nel puzzo ho bisogno di uno spazzino'
		},
		{ nome: 'Ciccio', testo: 'Mi dispiace ma interromperò il progetto panini' },
		{ nome: 'Dario', testo: 'NOOOOOOOOOOOOOOOOOOOOOO' }
	];
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
	<div class="mt-7 mb-3">
		<h1 class="text-[1.4rem] font-semibold">Richieste recenti</h1>
	</div>

	{#each richieste.slice(0, 3) as richiesta, index}
		<Richiesta nome={richiesta.nome} testo={richiesta.testo} />
		<div class="h-3"></div>
	{/each}
</div>
