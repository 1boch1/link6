<script>
	import { auth, db } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import {
		doc,
		updateDoc,
		getDoc,
		arrayUnion,
		collection,
		query,
		where,
		getDocs
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';
	import { get_Punteggio_e_Amici } from '$lib/actions';
	import { cache } from '$lib/store.js';

	let amici = [];
	let friendEmail = '';
	let errorMessage = '';
	let successMessage = '';

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser && currentUser.emailVerified) {
				let resPA = await get_Punteggio_e_Amici(currentUser);

				if (resPA == null) return;

				amici = resPA.amici;
			}
		});

		return () => unsubscribe();
	});

	const addFriend = async () => {
		friendEmail = friendEmail.trim().toLowerCase();

		const currentUser = auth.currentUser;

		if (!currentUser) {
			errorMessage = 'Utente non autenticato.';
			throw new Error('Utente non autenticato');
		}

		if (currentUser.email == friendEmail) {
			errorMessage = 'Non puoi aggiungere te stesso.';
			return;
		}

		try {
			// Verifica se esiste un utente registrato con la mail friendEmail
			const usersRef = collection(db, 'users');
			const q = query(usersRef, where('email', '==', friendEmail));
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				errorMessage = "L'amico che vuoi aggiungere non esiste";
				throw new Error('email non esiste');
			}

			// Se la mail esiste, aggiungila alla lista amici dell'utente corrente
			const userRef = doc(db, 'users', currentUser.uid);

			// (arrayUnion protegge da duplicazioni di amici)
			await updateDoc(userRef, {
				amici: arrayUnion(friendEmail)
			});

			successMessage = 'Amico aggiunto';

			// Invalido la cache
			cache.update((state) => {
				return { ...state, lastUpdated: 0 };
			});

			// Ricarica la lista amici
			let resPA = await get_Punteggio_e_Amici(currentUser);

			if (resPA == null) return;

			amici = resPA.amici;
		} catch (error) {
			console.log(error);
		}
	};
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
			bind:value={friendEmail}
			class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
			placeholder="Email dell'amico da aggiungere"
			required
		/>
	</div>
	<button
		on:click={addFriend}
		type="submit"
		class="mt-4 w-full rounded-lg bg-[#3B81F6] px-5 py-2.5 text-sm font-medium text-white"
	>
		Aggiungi
	</button>

	<div class="mt-7 mb-3">
		<h1 class="text-[1.4rem] font-bold">I tuoi amici</h1>
	</div>

	{#each amici as amico}
		<li>{amico}</li>
	{/each}
</div>

<style>
	.message {
		margin-bottom: 1rem;
		text-align: center;
		font-size: 0.9rem;
	}
</style>
