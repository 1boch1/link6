<script>
	import TopBar from '$lib/components/TopBar.svelte';
	import MainActions from '$lib/components/MainActions.svelte';
	import Richiesta from '$lib/components/Richiesta.svelte';
	import { AchievementsBar } from 'svelte-achievements-bar'; // pacchetto npm sviluppato da me
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth } from '$lib/firebase';

	import { onMount } from 'svelte';
	import { getRequests, get_Punteggio_e_Amici } from '$lib/actions';

	let punteggio = 0;
	let richieste = [];

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser && currentUser.emailVerified) {
				try {
					let resPA = await get_Punteggio_e_Amici(currentUser);

					if (resPA == null) return;

					punteggio = resPA.punteggio;

					let resR = await getRequests(currentUser, resPA.amici);

					if (resR == null) return;

					richieste = resR.requestsReceived;
				} catch (error) {
					console.log(error);
				}
			}
		});

		return () => unsubscribe();
	});

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

	const iconSize = '1rem';
	const iconColor = 'rgba(12,12,20)';
	const iconLitColor = 'rgba(252,252,252)';
	const mainColor = '#3B81F6';
	const bgColor = '#e7ecef';
	const barHeight = '0.7rem';
	const textSize = '0.7rem';

	/*let richieste = [
		{
			nome: 'Mario',
			testo: 'Aiuto '
		},
		{ nome: 'Francesco', testo: 'Qualcuno mi puo aiutare' },
		{ nome: 'Dario', testo: 'Ciao aiuto' }
	];*/
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
			progress={punteggio <= 3 ? punteggio : 3}
		></AchievementsBar>
	</div>
	<div class="mt-16">
		<MainActions></MainActions>
	</div>
	<div class="mt-7 mb-3">
		<h1 class="text-[1.2rem] font-bold">Richieste recenti di amici</h1>
	</div>

	{#each richieste.slice(0, 3) as richiesta, index}
		<Richiesta nome={richiesta.createdBy} testo={richiesta.content} bottone={true} />
		<div class="h-3"></div>
	{/each}
</div>
