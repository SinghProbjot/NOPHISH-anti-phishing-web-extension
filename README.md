# Stage

- Individuata una possibile architettura di partenza: https://github.com/ranjsa/Malicious-Website-detection-using-Machine-Learning/tree/master/Extension
- Testing della base di partenza. Non utilizza API ed effettua solo un analisi sintattica dell'url, non funziona correttamente. Testing effettuato su alcuni siti suggeriti da google: http://amazon-billing.170-64-204-79.cprapid.com/ , https://ff.garena.com/others/policy/en/
  https://south-africa-adyerdp884061.codeanyapp.com/fedex/step1.php

- Lettura della documentazione ufficiale sulla creazione di un'estensione: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension , https://developer.chrome.com/docs/extensions/mv3/getstarted/extensions-101/
- Durante il testing dell' estensione è risultato che il manifest v2 è deprecato, decido quindi di effettuare il passaggio al manifest v3: https://developer.chrome.com/docs/extensions/migrating/
- La parte di intelligenza artificiale non serve, viene rimossa, decido di creare il manifest v3 da zero poichè completamente diverso da quello precedente, di conseguenza l'introduzione del service worker mi porta a rivedere l'architettura. Ho settato l'ambiente in modo da essere il più efficace possibile, e per la poca esperienza col linguaggio, e grazie a dei suggerimenti in rete, decido di utilizzare typescript, così da poter avere l'aiuto dell'ambiente di sviluppo, dato che con javascript, non essendo tipizzato, non so che tipo di oggetto ritorna o richiede una determinata funzione, quindi non ho nessun suggerimento dei metodi invocabili, inoltre commetto molti errori, dato che non gestendo i vari tipi, era compito mio stare attento al tipo di dato che mettevo, visto che potevo metterne uno qualunque ma poi avevo tanti errori in fase di testing dell'estensione. Utilizzo il builder Parcel per fare il passaggio da typescript a javascript, dato che solo quest'ultimo è accettato dal browser. Documentazione di Parcel: https://parceljs.org/recipes/web-extension/#hmr

  ![image](https://github.com/SinghProbjot/Stage/assets/102951324/e252faa4-3934-4acf-8b4b-3fadfd025105)

- Ricerca su come viene intercettata una richiesta http: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest

![image](https://github.com/SinghProbjot/Stage/assets/102951324/c564f497-e5b3-4dfa-ab5f-552d89328654)

          PROBLEMI:
            * webRequest, a differenza delle versioni passate, non permette più di bloccare richieste, bisogna trovare
            un altro modo di bloccare la richiesta in caso stiamo visitando un sito pericoloso.
            * API PhishTank non è più funzionante, risulta 403 forbidden, quindi ho provato a cercare delle alternative,
            sorge il problema del limite di richieste. Per ora mi son limitato a simulare le richieste api da codice.

---

- La comunicazione tra il service worker e il content avviene con lo scambio di messaggi, ed utlizzo e testo questa funzionalità mandando un alert, contenente il link della pagina visitata, prima che la richiesta sia processata, quindi utilizzando l'evento onBeforeRequest della webRequest API. L'estensione ora è in grado di intercettare tutte le richieste che vengono effettuate quando l'utente apre un link, e le richieste vengono salvate in un array se è la prima volta che sono effettuate, invece dalla seconda volta in poi verranno ignorate, poichè già salvate, per evitare richieste inutili all'API e perdere efficienza.

  INVIO:
  ![image](https://github.com/SinghProbjot/Stage/assets/102951324/7f89980e-78b6-4835-8962-4c3918fc5e4d)
  RICEZIONE:
  ![image](https://github.com/SinghProbjot/Stage/assets/102951324/7884a8f0-0b71-43c0-b8c6-b49bcc6b622b)

- Sono stati introdotti dei controlli semplici sugli url, per l'estrazione del dominio, e per evitare punycode, prendendo spunto anche dalla base scelta in fase di partenza. Questi controlli verranno poi ampliati successivamente, per evitare troppe richieste inutili quando si è già a conoscenza della reputazione di un url.
- Risolto problema legato al blocco di richieste html: utlizzo di DeclarativeNetRequest, che permette col manifest v3 di definire dinamicamente delle regole: https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/
  ![image](https://github.com/SinghProbjot/Stage/assets/102951324/fcd24b91-9d68-4110-a7c7-1c1699dc135b)

- Utilizzata soluzione con API Google Safe Browsing, quando viene effettuata una webrequest, viene effettuata la richiesta api, ma incontro problemi col testing, dato che tutti gli url di phishing già individuati sono già stati bloccati, quindi l'api non dà risposta. Serve trovare altri siti per testing.
- Inoltre SafeBrowsing non dà alcuno score reputazionale, quindi sto individuando altre api gratuite da utilizzare per avere le informazioni mancanti.
- Oltre ad intercettare le richieste e valutarle, ora l'estensione è in grado di raccogliere tutti gli url presenti nella pagina web visitata, e di inviarli alla stessa api per la valutazione di essi. Questo viene fatto mediante un listener presente nel content.js, poichè solo lui ha accesso al DOM, e quando una pagina viene caricata, viene richiamata una funzione che interviene sul document, cercando tutti gli url. Infine, tramite scambio di messaggi, i link trovati vengono inviati al service-worker che è in ascolto, ed effettua la richiesta api a Safe Browsing con l'url ricevuto, valutandone il rischio.
  Controllo pagina:
  ![image](https://github.com/SinghProbjot/Stage/assets/102951324/c5aa487d-2916-41ea-9b97-27ae0245401a)
  Ricezione url e controllo:
  ![image](https://github.com/SinghProbjot/Stage/assets/102951324/cc069d4e-6dc9-4cd4-b924-e942a3274dcb)

- Integrazione con altre fonti di reputazione di url: IPQualityscore, e tentativo di connessione ad una blacklist di url, di phishtank, trovata in rete.
- Rielaborazione dell'architettura, riorganizzazione del codice, per non dover accumulare il tutto dentro un unica funzione, ma implementando delle classi, che hanno delle responsabiulità, nel mio caso era presente un unica funzione, "check-url" a cui veniva passato un url, e questo lo valutava, utilizzando le varie sorgenti reputazionali. ora questo non è più gestito dalla funzione, poichè in futuro potrebbe esseci bisogno di aggiornare il software con nuove sorgenti repuitazionali, e ci sarebbe stato bisogno di andare a mettere mano a tutto il codice, sistemandone il funzionamento. E' stata ora implememtata un'interfaccia generica che ha il compito di valutare la validità o meno di un url, quindi che risponde solo true o false, e dentro questa vengono implementate tutte le fonti di reputazione, e l'oggetto validator le applica tutte sequenzialmente, e quando trova che una delle fonti, ne basta solo una, risponde con false, cioè che l'url non è safe, significa che è pericoloso, e questa risposta è quella che viene ricevuta dal servuce-worker, quando chiede al validator la reputazione di un determinato url.

        UPDATE: l'api IPQualityscore non funziona, per le politiche CORS non risponde.

- Introdotto un controllo sull'url, prima che questo sia validato, poichè testando, ho incontrato dei tag href, che però non sono degli url, poichè sono dei collegamenti a delle posizioni nella stessa pagina. L'url viene controllato, in caso sia parsabile al tipo "URL", viene inviato.

- gestione dei dati: anche per questi aggiunta un implementazione tramite oggetti, l'oggetto LocalRepiutationDataSource gestisce i dati in locale, quelli che prima erano in un array globale, ed è stata definita, non ancora implementata la classe che gestisce i dati tramite un database.

      Problema testando il blocco della richiesta http: la dynamicRule viene creata ma la pagina viene comunque visitata. Penso che questo succeda perchè l'evento
      onBeforeRequest è asincrono, di conseguenza non aspetta che la creazione della regola termini per poterla subito applicare. Leggendo su vari forum è un problema
      riscontrato anche da altri ma non ho ancora trovato soluzione. E fattibile con manifest v3?

- Downgrade a manifest v2, per gestire nel modo corretto il blocco di richieste tramite webrequest api, aggiornamento dei metodi

- Whitelisting: https://moz.com/top500, vengono inseriti tutti e 500 i domini sicuri nel database, reputati come safe con score 100.

- Utilizzo di Dexie.js, per l'accesso all'IndexedDb, dove vengono salvate e lette tutte le reputazioni. I campi che vengono salvati sono gli stessi che venivano salvati prima in locale, quindi consiste in una sola tabella, che contiene url, lo score, e se è stato markato(boolean).

- Migliorata la logica dello score, che prima era simulato, ma ora ogni validator(evaluator) ha un proprio modo di gestire lo score, dato che le sorgenti interpretano la risposta in modo diverso, quindi ogni sorgente, anzichè rispondere se un url è safe o meno, ora ha la responsabilità di tornare uno score, e alla fine viene fatta una media degli score dal Manager.

- Aggiunta nuova fonte di reputazione degli url: la sintassi. Utilizzo della libreria punycode.js per decodificare i caratteri punycode in unicode, così da confrontare l'url decodificato, con quello originario: se risultano diversi, cioè l'url è punycode, è potenzialmente dannoso.

- Controllo sugli ip: SafeBrosing, funziona con due liste contenenti url, gli ip a quanto pare non vengono valutati, di conseguenza la mia estensione li vedrebbe come sicuri, quando potrebbero essere pericolosi. Per ora un Ip è pericoloso.

- Implementazione dell'analisi della history del browser, per studiare il numero di visite di un url. per ora è da valutarne l'utilità e la correttezza.

- Aggiunta una prima interfaccia grafica, da migiliorare successivamente, Soprattutto la notifica quando si incontra un url pericoloso, che per ora è un semplice alert.

- Utilizzo intelligente di phishtank: fetch solo una volta al giorno, ora ha accesso alla blacklist, e il tutto viene caricato nel database. Aggiornamento dello stato tramite syncStorage.

- IPQuality funzionante, per evitare il consumo di richieste verrà usato solo per le richieste principali, non per il controllo dei link di tutta la pagina.

- analisi dell' header

- Osservazione header richiesta di evilginx

- Evilginx: l'unico modo che sembra essere utilizzabile, è quello di analizzare i dati del certificato, cosa che in chrome non è permessa, solo in firefox le esntensioni tramitre la webrequest api possono ottenere le informazioni di sicurezza del certificato ssl.

- valutazione di indirizzi ip: non vengono più valutati come insicuri senza condizioni, ma vengono controllati anche essi tramite IPQuality, che fornisce uno studio dettagliato. il compito di IPQuality, date le limitazioni, è quello di studiare il link principale, ed eventuali indirizzi ip.

- phishing di frontiera: dato che safebrowsing non è risultato efficace, nel detecting di tutti i tipi di phishing, IPQuality dall'altra parte è un servizio molto efficiente e completo, sono già fornite le informazioni riguardo anche siti fraudolenti crypto, sono stati effettuati alcuni test.

- Evilginx: implementata una possibile soluzione per studiare il certificato. Data l'impossibilità di farlo attraverso strumenti del browser, si è deciso di utilizzare un servizio di terze parti, ovvie anche qui le limitazioni, ma comunque per testing è stato implementato un pezzo che ne fa uso e dimostra il funzionamento. I risultati ottenuti saranno da confrontare con fonti di attendibiltà e blacklist, che è stata individuata ad esempio qui: https://sslbl.abuse.ch/blacklist/sslblacklist.csv
