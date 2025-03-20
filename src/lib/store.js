import { writable } from 'svelte/store';

export const cache = writable({
    amici: [],
    punteggio: 0,
    receivedRequests: [],
    sentRequests: [],
    lastUpdated: 0
});


