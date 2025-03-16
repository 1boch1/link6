<script>
	import Richiesta from '$lib/components/Richiesta.svelte';
	import { AchievementsBar } from 'svelte-achievements-bar'; // pacchetto npm sviluppato da me
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth, db } from '$lib/firebase';
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import {
		doc,
		updateDoc,
		getDoc,
		getDocs,
		increment,
		collection,
		addDoc,
		serverTimestamp,
		query,
		where
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { getRequests, get_Punteggio_e_Amici } from '$lib/actions';

	let richieste = [];

	let errorMessage = '';
	let successMessage = '';

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser && currentUser.emailVerified) {
				try {
					let resPA = await get_Punteggio_e_Amici(currentUser);

					if (resPA == null) return;

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

	async function aiuta(richiesta) {
		try {
			const reqRef = doc(db, 'requests', richiesta.id);

			// Aggiorna lo stato della richiesta
			await updateDoc(reqRef, {
				status: 'accepted'
			});

			// Incrementa il punteggio dell'utente
			const userRef = doc(db, 'users', auth.currentUser.uid);
			await updateDoc(userRef, {
				punteggio: increment(0.5)
			});

			// Controlla se esiste già una chat tra i due utenti
			const chatsRef = collection(db, 'chats');
			const chatQuery = query(chatsRef, where('users', 'array-contains', auth.currentUser.email));
			const chatSnapshot = await getDocs(chatQuery);

			let chatId = null;

			// Filtra manualmente per trovare la chat che include anche richiesta.createdBy
			chatSnapshot.forEach((doc) => {
				const chatData = doc.data();
				if (chatData.users.includes(richiesta.createdBy)) {
					chatId = doc.id;
				}
			});

			if (!chatId) {
				// Se non esiste, crea la chat
				const newChatRef = await addDoc(chatsRef, {
					users: [richiesta.createdBy, auth.currentUser.email],
					createdAt: serverTimestamp()
				});

				chatId = newChatRef.id;
			}

			// Aggiungi messaggio di accettazione richiesta
			const messagesRef = collection(db, `chats/${chatId}/messages`);
			await addDoc(messagesRef, {
				sender: auth.currentUser.email,
				text: 'Ho accettato la tua richiesta: ' + richiesta.content,
				timestamp: serverTimestamp()
			});

			successMessage = 'Richiesta accettata!';
			console.log('Chat creata e messaggio inviato!');

			goto('/auth/chat/' + chatId.toString());
		} catch (error) {
			console.error("Errore nell'accettazione della richiesta:", error);
		}
	}
</script>

<div class="mx-auto mt-[0.7rem] w-[87%]">
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

	<div class="mt-7 mb-3">
		<h1 class="text-[1.4rem] font-bold">Richieste di amici</h1>
	</div>

	{#each richieste as richiesta, index}
		<div>
			<Richiesta
				nome={richiesta.createdBy}
				testo={richiesta.content}
				testoContratto={false}
				bottone={false}
			/>
			<button
				on:click={() => aiuta(richiesta)}
				class="mt-0 w-full rounded-lg bg-[#3B81F6] px-5 py-2.5 text-sm font-medium text-white"
			>
				Aiuta {richiesta.createdBy.split('@')[0]}
			</button>
		</div>

		<div class="h-3"></div>
	{/each}
</div>

<style>
	.message {
		margin-bottom: 1rem;
		text-align: center;
		font-size: 0.9rem;
	}
</style>
