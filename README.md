# Stage
- Individuata una possibile architettura di partenza: https://github.com/ranjsa/Malicious-Website-detection-using-Machine-Learning/tree/master/Extension
  
- Testing della base di partenza. Non utilizza API ed effettua solo un analisi sintattica dell'url, non funziona correttamente. Testing effettuato su alcuni siti suggeriti da google: http://amazon-billing.170-64-204-79.cprapid.com/   ,   https://ff.garena.com/others/policy/en/
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
______________________________________________________________________________________________________________           

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
