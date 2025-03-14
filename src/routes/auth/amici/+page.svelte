<script>
	import { auth } from '$lib/firebase';
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
	import { db } from '$lib/firebase';

	let amici = [];
	let friendEmail = '';
	let errorMessage = '';

	onMount(() => {
		// Attendi il cambiamento dello stato di autenticazione
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				try {
					// Recupera il documento dell'utente corrente
					const userRef = doc(db, 'users', user.uid);
					const docSnap = await getDoc(userRef);

					if (docSnap.exists()) {
						amici = docSnap.data().friends || [];
						console.log(amici);
					} else {
						errorMessage = 'Profilo utente non trovato.';
					}
				} catch (error) {
					errorMessage = 'Errore nel recupero degli amici.';
					console.error(error);
				}
			} else {
				errorMessage = 'Utente non autenticato';
			}
		});

		// Pulizia del listener se il componente viene smontato
		return () => unsubscribe();
	});

	const addFriend = async () => {
		friendEmail = friendEmail.trim();

		const currentUser = auth.currentUser;

		if (!currentUser) {
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
				friends: arrayUnion(friendEmail)
			});

			errorMessage = 'Amico aggiunto';
		} catch (error) {
			throw error;
		}
	};
</script>

<div>
	{#if errorMessage}
		<p class="mb-4 text-center text-sm text-red-500">{errorMessage}</p>
	{/if}

	<div>
		<label for="password" class="block text-sm font-medium text-gray-900">Password</label>
		<input
			id="password"
			type="email"
			bind:value={friendEmail}
			class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
			placeholder="email"
			required
		/>
	</div>
	<button on:click={addFriend}>ADD</button>

	{#each amici as amico}
		<li>{amico}</li>
	{/each}
</div>
