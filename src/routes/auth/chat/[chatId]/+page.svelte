<script>
	import { db, auth } from '$lib/firebase';
	import {
		collection,
		query,
		orderBy,
		onSnapshot,
		addDoc,
		serverTimestamp
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	// Recupera il chatId dall'URL
	let chatId = get(page).params.chatId;
	let messages = [];
	let newMessage = '';

	let messagesRef;
	let messagesQuery;

	// Recupera i messaggi in tempo reale
	onMount(() => {
		messagesRef = collection(db, 'chats', chatId, 'messages');
		messagesQuery = query(messagesRef, orderBy('timestamp'));

		const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
			messages = snapshot.docs.map((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					sender: data.sender,
					message: data.text,
					timestamp: data.timestamp?.toDate() || new Date()
				};
			});
		});

		return () => unsubscribe();
	});

	// Funzione per inviare un messaggio
	async function sendMessage() {
		if (newMessage.trim() !== '' && auth.currentUser) {
			try {
				await addDoc(messagesRef, {
					sender: auth.currentUser.email,
					text: newMessage,
					timestamp: serverTimestamp()
				});

				newMessage = '';
			} catch (error) {
				console.error("Errore nell'invio del messaggio:", error);
			}
		}
	}
</script>

<div class="m-auto w-[90%]">
	<!-- torna indietro -->
	<button
		on:click={() => goto('/auth/home')}
		class="mb-2 flex w-full items-center justify-between p-1"
	>
		<ArrowLeft size={30} class="text-gray-800" />
	</button>
	<div class="container">
		<div class="listaMessaggi">
			{#each messages as message (message.id)}
				<div class="messaggio {message.sender === auth.currentUser?.email ? 'stile1' : 'stile2'}">
					<p>
						<strong>{message.sender.split('@')[0]}:</strong>
					</p>
					{message.message}
				</div>
			{/each}
		</div>

		<div class="input-container">
			<input type="text" bind:value={newMessage} placeholder="Scrivi..." />
			<button on:click={sendMessage}>Invia</button>
		</div>
	</div>
</div>

<style>
	.container {
		height: 90vh;
		display: flex;
		flex-direction: column;
	}

	.listaMessaggi {
		overflow-y: auto;
		padding: 10px;
		margin-bottom: 10px;
		display: flex;
		flex-direction: column;
	}

	.messaggio {
		padding: 10px;
		margin-bottom: 10px;
		background-color: #f1f1f1;
		border-radius: 5px;
		max-width: 90%;
	}

	.messaggio.stile1 {
		background-color: #a8c8ff;
		align-self: flex-end;
	}

	.messaggio.stile2 {
		background-color: #dcdcdc;
		align-self: flex-start;
	}

	.input-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.input-container input {
		width: 80%;
		padding: 10px;
		border-radius: 5px;
		border: 1px solid #ddd;
	}

	.input-container button {
		padding: 10px;
		background-color: #000;
		color: #fff;
		border: none;
		border-radius: 5px;
	}
</style>
