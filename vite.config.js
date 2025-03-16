import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

/** @type {import('vite').UserConfig} */
export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: "Link6",
				short_name: "Link6",
				description: "Chiedi aiuto ai tuoi amici",
				start_url: "/",
				display: "standalone",
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/[a-zA-Z0-9-]+\.firebaseio\.com\/.*/,
						handler: 'CacheFirst', // Usa la rete prima di fare fallback alla cache
						options: {
							cacheName: 'firebase-api-cache', // Nome cache
							expiration: {
								maxEntries: 50, // Limite massimo di cache
								maxAgeSeconds: 60 * 60 * 24, // Timeout della cache (ad esempio 1 giorno)
							},
						},
					},
					{
						// Aggiungi altre API o pattern che vuoi memorizzare nella cache
						urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/,
						handler: 'CacheFirst', // Usa la cache prima di fare fallback alla rete
						options: {
							cacheName: 'firebase-storage-cache',
							expiration: {
								maxEntries: 30, // Limite massimo di cache
								maxAgeSeconds: 60 * 60 * 24 * 7, // Timeout della cache (ad esempio 7 giorni)
							},
						},
					},
				],
			},
		}),
	],
});
