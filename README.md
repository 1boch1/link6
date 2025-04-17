## Breve descrizione

Link6 è un'app mobile che permette a gruppi di amici di scambiarsi richieste di aiuto.
Il nome nasce dalla teoria dei 6 gradi di separazione. 
(testarla con display verticale per un miglior risultato)

## Avviare il progetto

Per prima cosa importare il file .env all'interno della cartella del progetto.

Poi installare i pachetti npm con:

```bash
npm i
```

A questo punto ci sono 2 modi per testare il progetto, 
il secondo è necessario nel caso si vogliano testare le funzionalità PWA dell'app (service worker):

Modo 1:

```bash
npm run dev -- --host
```

Modo 2:

```bash
npm run build
npm run preview -- --host
```

Tenere anche presente che per le funzionalità di notifica e service worker bisogna testare in HTTPS o localhost.

## Come usare l'app (in breve)

- Pagina di login / signup
- Ogni utente può principalmente: 
    - aggiungere un amico
    - fare una richiesta che sarà visibile a chi lo ha tra gli amici (richieste inviate)
    - accettare una richiesta fatta da uno dei suoi amici (richieste ricevute)
    - chattare con gli amici che ha deciso di aiutare o che lo vogliono aiutare
- Nella schermata HOME è presente:
    - un indicatore di punteggio che aumenta aiutando gli altri
    - pulsanti per le azioni principali
    - le ultime richieste effettuate dagli utenti che hai aggiunto in "Amici"
- Tramite "Amici" è possbile aggiungere amici e visualizzare la lista amici 
- Tramite "Richiedi" è possibile visualizzare le richieste da te effettuate e effettuarne di nuove
- Tramite "Aiuta" è possibile visualizzare le richieste effettuate dagli utenti che hai aggiunto in "Amici" e accettarle (dare aiuto)
- Decidendo di accettare una richiesta verrà creata una chat (se non esiste ancora) e verrà inviato un messaggio di accettazione a chi ha effettuato la richiesta, adesso i 2 utenti posso chattare
- In settings si possono attivare le notifiche e fare il logout

## DB Firestore

- users (uid): Contiene le informazioni dell'utente.
    - email: Email dell'utente.
    - punteggio: Punteggio dell'utente.
    - amici: Lista degli amici (array di email).
- requests: Contiene le richieste inviate.
    - createdBy: Email di chi ha creato la richiesta.
    - status: Stato della richiesta (pending, accepted).
    - content: Contenuto della richiesta.
    - timestamp: Data di creazione della richiesta.
- chats: Contiene le chat tra gli utenti.
    - users: Lista di email degli utenti nella chat.
    - messages: Contiene i messaggi nelle chat.
        - sender: Email di chi ha inviato il messaggio.
        - text: Testo del messaggio.
        - timestamp: Data e ora del messaggio.
