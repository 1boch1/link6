<script>
	import { createUserWithEmailAndPassword, sendEmailVerification, deleteUser } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';
	import { doc, setDoc, deleteDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let email = '';
	let confirmEmail = '';
	let password = '';
	let errorMessage = '';
	let successMessage = '';

	// Mappa gli errori di Firebase a messaggi più chiari
	function mapFirebaseError(code) {
		const errors = {
			'auth/user-not-found': 'Email o password errati.',
			'auth/invalid-email': 'Formato email non valido.',
			'auth/invalid-credential': 'Email o password errati.',
			'auth/wrong-password': 'Password errata.',
			'auth/id-token-expired': 'Sessione scaduta, effettua nuovamente il login.',
			'auth/id-token-revoked': 'Accesso revocato. Contatta il supporto.',
			'auth/too-many-requests': 'Troppi tentativi. Riprova più tardi.',
			'auth/network-request-failed': 'Errore di rete. Controlla la connessione.',
			'auth/user-disabled': 'Questo account è stato disabilitato.',
			'auth/invalid-email-verified': 'Per favore, verifica la tua email prima di accedere.'
		};

		return errors[code] || 'Errore sconosciuto. Riprova più tardi.';
	}

	function validateForm() {
		errorMessage = '';

		// Regex per validazione email
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

		// Controllo formato email
		if (!emailRegex.test(email)) {
			errorMessage = 'Inserisci un indirizzo email valido.';
			return false;
		}

		// Controllo lunghezza password
		if (password.length < 8) {
			errorMessage = 'La password deve contenere almeno 8 caratteri.';
			return false;
		}

		// Controllo corrispondenza email
		if (email !== confirmEmail) {
			errorMessage = 'Le email non corrispondono.';
			return false;
		}

		return true;
	}

	// Funzione per la registrazione
	async function signupSubmit() {
		email = email.trim().toLowerCase();
		confirmEmail = confirmEmail.trim().toLowerCase();

		if (!validateForm()) return;

		try {
			// Crea l'utente
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			// Creazione della tabella di firestore delle info collegate all'utente
			try {
				await setDoc(doc(db, 'users', user.uid), {
					email: user.email,
					punteggio: 0,
					amici: []
				});

				// Invia l'email di verifica
				await sendEmailVerification(user);

				successMessage =
					"Email di verifica inviata. Controlla la tua inbox per confermare l'account.";
			} catch (error) {
				// Se c'è stato un errore elimina l'account
				await deleteUser(user);
				await deleteDoc(doc(db, 'users', user.uid));
				console.error('Errore nella creazione del profilo:', error);
				errorMessage = 'Errore nella creazione del profilo.';
			}
		} catch (error) {
			console.error('Errore nella creazione del profilo:', error.code);
			errorMessage = mapFirebaseError(error.code);
		}
	}
</script>

<section class="flex min-h-screen items-center justify-center bg-gray-50 p-6">
	<div class="w-full rounded-lg bg-white p-6 shadow-md">
		<p class="logo text-center text-[#3B81F6]">LINK6</p>
		<h1 class="mb-4 text-center text-2xl font-bold text-gray-900">Crea un account</h1>

		{#if errorMessage}
			<p class="message text-red-500">{errorMessage}</p>
		{/if}

		{#if successMessage}
			<p class="message text-green-500">{successMessage}</p>
		{/if}

		<form class="space-y-4" on:submit|preventDefault={signupSubmit}>
			<div>
				<label for="email" class="label">Email</label>
				<input
					id="email"
					bind:value={email}
					class="input"
					placeholder="tuamail@dominio.com"
					required
				/>
			</div>

			<div>
				<label for="confirmEmail" class="label">Conferma Email</label>
				<input
					id="confirmEmail"
					bind:value={confirmEmail}
					class="input"
					placeholder="tuamail@dominio.com"
					required
				/>
			</div>

			<div>
				<label for="password" class="label">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="input"
					placeholder="••••••••"
					required
				/>
			</div>

			<button
				type="submit"
				class="mt-4 w-full rounded-lg bg-[#3B81F6] px-5 py-2.5 text-sm font-medium text-white"
			>
				Registrati
			</button>

			<p class="mt-4 text-center text-sm text-gray-600">
				Hai già un account?
				<a href="/login" class="text-[#3B81F6]">Accedi</a>
			</p>
		</form>
	</div>
</section>

<style>
	.logo {
		font-weight: 900;
		font-style: normal;
		font-stretch: expanded;
		font-size: 2rem;
	}

	.label {
		display: block;
		font-size: 0.9rem;
		font-weight: 500;
	}

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
