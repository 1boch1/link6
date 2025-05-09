import { db } from '$lib/firebase';
import { cache } from '$lib/store.js';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-svelte';
import { get } from 'svelte/store'

function cacheScaduta()
{
    let res = false;

    cache.update(state =>
    {
        if (Date.now() > state.lastUpdated + 60000) res = true;
        return state;
    });

    return res;
}

// Funzione che ritorna il punteggio e amici dell'utente passato
export async function get_Punteggio_e_Amici(currentUser)
{
    try
    {
        if (!currentUser) return null;

        if (!cacheScaduta())
        {
            console.log("USO CACHE");

            return {
                amici: get(cache).amici || [], punteggio: get(cache).punteggio || 0
            };
        }

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return null;

        const userData = userSnap.data();
        console.log("Ho fatto il fetch di questi dati: ");
        console.log(userData);

        cache.update(state =>
        {
            const now = Date.now();
            return { ...state, amici: userData.amici, punteggio: userData.punteggio };
        });

        return {
            punteggio: userData.punteggio || 0, amici: userData.amici || []
        };
    } catch (error)
    {
        console.log(error);
    }
}

// Funzione che ritorna le richieste (ricevute e inviate) del tuo gruppo di amici
export async function getRequests(currentUser, friends)
{
    try
    {
        if (!currentUser) return null;

        if (!cacheScaduta())
        {
            console.log("USO CACHE");

            return {
                requestsReceived: get(cache).receivedRequests || [], requestsSent: get(cache).sentRequests || []
            };
        }

        let receivedRequests = [];

        if (friends && friends.length > 0) 
        {
            // Devo dividere l'array perchè "in" di firestore lavora con massimo 10 elementi
            const friendChunks = chunkArray(friends, 10);

            const receivedQueries = friendChunks.map(chunk =>
                query(collection(db, 'requests'), orderBy('timestamp', "desc"), where('status', '==', 'pending'), where('createdBy', 'in', chunk))
            );

            // Esegui tutte le query in parallelo e raccogli i risultati
            // Promise.all prende un array di Promise e le aspetta tutte
            const receivedSnapshots = await Promise.all(receivedQueries.map(q => getDocs(q)));

            // La flatMap è una map() + flat(). Faccio questa operazione anche per non perdere il riferimento a id del documento (qua abbiamo un array di snap che sono a loro volta array di docs)
            receivedRequests = receivedSnapshots.flatMap(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }

        // Query per le richieste inviate
        const sentQuery = query(collection(db, 'requests'), orderBy('timestamp', "desc"), where('createdBy', '==', currentUser.email));
        const sentSnap = await getDocs(sentQuery);
        const sentRequests = sentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log("Fetch delle richieste sent/received: ");
        console.log(receivedRequests);
        console.log(sentRequests);

        cache.update(state =>
        {
            const now = Date.now();
            return { ...state, receivedRequests: receivedRequests, sentRequests: sentRequests, lastUpdated: now };
        });

        return {
            requestsReceived: receivedRequests,
            requestsSent: sentRequests
        }
    } catch (error)
    {
        console.log(error);
    }
}

// Funzione per dividere l'array in gruppi di massimo size elementi
function chunkArray(array, size)
{
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
        array.slice(i * size, (i + 1) * size)
    );
}


