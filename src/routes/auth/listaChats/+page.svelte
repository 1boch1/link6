<script>
	import { db, auth } from '$lib/firebase';
	import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';
	import { onAuthStateChanged } from 'firebase/auth';

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser && currentUser.emailVerified) {
				fetchChats();
			}
		});

		return () => unsubscribe();
	});

	let chats = [];

	// Funzione per ottenere le chat dell'utente
	async function fetchChats() {
		try {
			const chatsRef = collection(db, 'chats');
			const chatQuery = query(chatsRef, where('users', 'array-contains', auth.currentUser.email));

			const chatSnapshot = await getDocs(chatQuery);
			const chatList = [];

			for (const chatDoc of chatSnapshot.docs) {
				const chatData = chatDoc.data();
				const chatId = chatDoc.id;

				// Recupera l'ultimo messaggio per ogni chat
				const messagesRef = collection(db, `chats/${chatId}/messages`);
				const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'));
				const messagesSnapshot = await getDocs(messagesQuery);

				const lastMessage = messagesSnapshot.docs[0]?.data();
				const lastMessageText = lastMessage ? lastMessage.text : '';

				// Aggiungi la chat con l'ultimo messaggio
				chatList.push({
					id: chatId,
					users: chatData.users,
					lastMessage: lastMessageText
				});
			}

			chats = chatList;
		} catch (error) {
			console.error('Errore nel recupero delle chat:', error);
		}
	}

	function openChat(chatId) {
		goto('/auth/chat/' + chatId.toString());
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

	<div class="mt-7 mb-3">
		<h1 class="text-[1.4rem] font-bold">Chats</h1>
	</div>

	<hr class="text-gray-300" />
	<div class="listaChat">
		{#each chats as chat}
			<button on:click={() => openChat(chat.id)} class="singolaChat">
				<span class="nomeChat">
					{#if chat.users.length === 2}
						{chat.users[0] === auth.currentUser.email
							? chat.users[1].split('@')[0]
							: chat.users[0].split('@')[0]}
					{/if}
				</span>
				<span class="oneline last-message overflow-hidden text-base leading-relaxed text-ellipsis"
					>{chat.lastMessage || 'Nessun messaggio'}</span
				>
			</button>
			<hr class="text-gray-300" />
		{/each}
	</div>
</div>

<style>
	.oneline {
		display: -webkit-box;
		line-clamp: 1;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		white-space: normal;
	}

	.listaChat {
		padding: 0;
		margin: 0;
	}

	.singolaChat {
		text-align: start;
		width: 100%;
		padding: 1rem;
		margin: 10px 0;

		display: flex;
		flex-direction: column;
	}

	.nomeChat {
		font-weight: bold;
		font-size: 1.1em;
		margin-bottom: 5px;
	}

	.last-message {
		font-size: 0.9em;
		color: #888;
	}
</style>
