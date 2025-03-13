<script>
	import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { goto } from '$app/navigation';

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
		email = email.trim();
		confirmEmail = confirmEmail.trim();

		if (!validateForm()) return;

		try {
			// Crea l'utente
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			// Invia l'email di verifica
			await sendEmailVerification(user);

			// Mostra messaggio di successo
			successMessage =
				"Email di verifica inviata. Controlla la tua inbox per confermare l'account.";

			// Reindirizza alla home dopo la registrazione
			setTimeout(() => {
				goto('/auth/home');
			}, 2000);
		} catch (error) {
			errorMessage = mapFirebaseError(error.code);
		}
	}
</script>

<section class="flex min-h-screen items-center justify-center bg-gray-50 p-6">
	<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
		<p class="logo text-primary-500 text-center">LINK6</p>
		<h1 class="mb-4 text-center text-2xl font-bold text-gray-900">Crea un account</h1>

		{#if errorMessage}
			<p class="mb-4 text-center text-sm text-red-500">{errorMessage}</p>
		{/if}

		{#if successMessage}
			<p class="mb-4 text-center text-sm text-green-500">{successMessage}</p>
		{/if}

		<form class="space-y-4" on:submit|preventDefault={signupSubmit}>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-900">Email</label>
				<input
					id="email"
					bind:value={email}
					class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
					placeholder="nome@dominio.com"
					required
				/>
			</div>

			<div>
				<label for="confirmEmail" class="block text-sm font-medium text-gray-900"
					>Conferma Email</label
				>
				<input
					id="confirmEmail"
					bind:value={confirmEmail}
					class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
					placeholder="nome@dominio.com"
					required
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-900">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
					placeholder="••••••••"
					required
				/>
			</div>

			<button
				type="submit"
				class="mt-4 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
			>
				Registrati
			</button>

			<p class="mt-4 text-center text-sm text-gray-600">
				Hai già un account?
				<a href="/login" class="text-blue-600 hover:underline">Accedi</a>
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
</style>
