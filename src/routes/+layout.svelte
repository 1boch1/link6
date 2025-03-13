<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase';
	import { userStore } from '$lib/stores';
	import { onAuthStateChanged } from 'firebase/auth';

	// Questo codice permette di avere globalmente e in ogni momento l'utente loggato
	// e aggiornato accessibile attraverso userStore

	// La funzione onMount viene eseguita quando il componente viene montato.
	onMount(() => {
		// Si imposta un listener per monitorare le variazioni di stato dell'autenticazione.
		// Ogni volta che lo stato cambia (login, logout, etc.), la callback viene eseguita.
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			// Aggiorna lo store `user` con il valore dell'utente attuale.
			// Se l'utente non è loggato, currentUser sarà null.
			console.log('Stato auth cambiato.');
			userStore.set(currentUser);
		});

		// La funzione restituita da onMount verrà eseguita quando il componente verrà distrutto,
		// per rimuovere il listener e prevenire memory leaks.
		return () => unsubscribe();
	});
</script>

<!-- Il <slot /> permette di inserire al suo interno altri componenti o contenuti che utilizzeranno questo layout. -->
<slot />
