<script>
	// Layout fatto per proteggere le routes che richiedono autenticazione
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth, db } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import {
		doc,
		updateDoc,
		getDoc,
		getDocs,
		increment,
		collection,
		addDoc,
		onSnapshot,
		serverTimestamp,
		query,
		where,
		orderBy
	} from 'firebase/firestore';
	import { cache } from '$lib/store.js';

	function mostraNotifica() {
		if (!('Notification' in window)) console.log('Non possiedi questa funzione');
		if (Notification.permission != 'granted') console.log('Non hai autorizzato');

		navigator.serviceWorker.ready.then((registration) => {
			registration.showNotification('Nuova richiesta', {
				body: 'Hai ricevuto una nuova richiesta!',
				vibrate: [200, 100, 200, 100, 200, 100, 200],
				tag: 'vibration-sample'
			});
		});
	}

	onMount(() => {
		let unsubscribe2 = () => {};
		let first = true;

		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (!currentUser || !currentUser.emailVerified) {
				auth.signOut();
				goto('/login');
				return;
			}

			const requestRef = collection(db, 'requests');
			const requestsQuery = query(requestRef, orderBy('timestamp', 'desc'));

			unsubscribe2();

			unsubscribe2 = onSnapshot(requestsQuery, async (snapshot) => {
				// faccio il controllo con "first" per evitare che parta la prima volta (quando si apre l'app)
				if (first) {
					first = false;
					return;
				}

				// Invalido la cache
				cache.update((state) => {
					return { ...state, lastUpdated: 0 };
				});

				console.log('Nuova richiesta: ');
				console.log(snapshot.docs[0].data());

				let creatoreNuovaRichiesta = snapshot.docs[0].data().createdBy || '';

				const userRef = doc(db, 'users', currentUser.uid);
				const userSnap = await getDoc(userRef);
				const friendsList = userSnap.data().amici || [];

				if (friendsList.includes(creatoreNuovaRichiesta)) mostraNotifica();
			});
		});

		return () => {
			unsubscribe();
			unsubscribe2();
		};
	});
</script>

<slot />
