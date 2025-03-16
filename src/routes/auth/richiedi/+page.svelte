<script>
	import { auth, db } from '$lib/firebase';
	import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { getRequests, get_Punteggio_e_Amici } from '$lib/actions';
	import Richiesta from '$lib/components/Richiesta.svelte';

	let testoPost = '';
	let errorMessage = '';
	let successMessage = '';
	let amici = [];
	let richiesteEffettuate = [];

	onMount(() => {
		// Qua onAuthStateChanged viene utilizzato sostanzialmente per
		// aspettare che i dati sull'utente loggato siano pronti dopo il cambio di pagina
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser && currentUser.emailVerified) {
				try {
					let resPA = await get_Punteggio_e_Amici(currentUser);

					if (resPA == null) return;

					amici = resPA.amici;

					let resR = await getRequests(currentUser, amici);

					if (resR == null) return;

					richiesteEffettuate = resR.requestsSent;
				} catch (error) {
					console.log(error);
				}
			}
		});

		return () => unsubscribe();
	});

	async function createRequest() {
		const currentUser = auth.currentUser;

		if (!currentUser) {
			errorMessage = 'Utente non autenticato';
			return;
		}

		try {
			const reqRef = collection(db, 'requests');

			await addDoc(reqRef, {
				createdBy: currentUser.email,
				content: testoPost,
				status: 'pending',
				timestamp: serverTimestamp()
			});

			successMessage = 'Richiesta inviata con successo';

			let resR = await getRequests(currentUser, amici);

			if (resR == null) return;

			richiesteEffettuate = resR.requestsSent;
		} catch (error) {
			errorMessage = 'Errore nella creazione della richiesta.';
			console.error('Errore nella creazione della richiesta:', error);
		}
	}
</script>

<div class="m-auto w-[85%]">
	<!-- torna indietro -->
	<button
		on:click={() => goto('/auth/home')}
		class="mb-2 flex w-full items-center justify-between p-1"
	>
		<ArrowLeft size={30} class="text-gray-800" />
	</button>

	{#if errorMessage}
		<p class="message text-red-500">{errorMessage}</p>
	{/if}

	{#if successMessage}
		<p class="message text-green-500">{successMessage}</p>
	{/if}

	<div class="mt-5">
		<input
			id="confirmEmail"
			bind:value={testoPost}
			class="input"
			placeholder="Scrivi qui la tua richiesta..."
			required
		/>
	</div>
	<button
		on:click={createRequest}
		type="submit"
		class="mt-4 w-full rounded-lg bg-[#3B81F6] px-5 py-2.5 text-sm font-medium text-white"
	>
		Richiedi
	</button>

	<div class="mt-7 mb-3">
		<h1 class="text-[1.4rem] font-bold">Richieste da te effettuate</h1>
	</div>

	{#each richiesteEffettuate as richiesta, index}
		<Richiesta
			nome={richiesta.createdBy}
			testo={richiesta.content}
			bottone={false}
			testoContratto={false}
		/>
		<div class="h-3"></div>
	{/each}
</div>

<style>
	.input {
		margin-top: 0.25rem;
		display: block;
		width: 100%;
		border-radius: 0.75rem;
		border: 1px solid #d1d5db;
		background-color: #f9fafb;
		padding: 0.625rem 1.25rem;
		color: #111827;
	}

	.message {
		margin-bottom: 1rem;
		text-align: center;
		font-size: 0.9rem;
	}
</style>
