<script>
	import { auth } from '$lib/firebase';
	import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let testoPost = '';
	let errorMessage = '';

	const createRequest = async () => {
		const currentUser = auth.currentUser;

		if (!currentUser) {
			throw new Error('Utente non autenticato');
		}

		try {
			const reqRef = collection(db, 'requests');

			await addDoc(reqRef, {
				createdBy: currentUser.uid,
				content: testoPost,
				status: 'pending',
				timestamp: serverTimestamp()
			});
		} catch (error) {
			console.error('Errore nella creazione della richiesta:', error);
		}
	};
</script>

<div>
	{#if errorMessage}
		<p class="mb-4 text-center text-sm text-red-500">{errorMessage}</p>
	{/if}

	<div>
		<label for="password" class="block text-sm font-medium text-gray-900">Testo</label>
		<input
			id="password"
			type="text"
			bind:value={testoPost}
			class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
			placeholder="email"
			required
		/>
	</div>
	<button on:click={createRequest}>RICHIEDI</button>
</div>
