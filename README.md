# Stage
- Individuata una possibile architettura di partenza: https://github.com/ranjsa/Malicious-Website-detection-using-Machine-Learning/tree/master/Extension
- Testing della base di partenza. Non utilizza API ed effettua solo un analisi sintattica dell'url, non funziona correttamente. Testing effettuato su alcuni siti suggeriti da google: http://amazon-billing.170-64-204-79.cprapid.com/   ,   https://ff.garena.com/others/policy/en/
  https://south-africa-adyerdp884061.codeanyapp.com/fedex/step1.php

- Lettura della documentazione ufficiale sulla creazione di un'estensione: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension , https://developer.chrome.com/docs/extensions/mv3/getstarted/extensions-101/
- Durante il testing dell' estensione è risultato che il manifest v2 è deprecato, decido quindi di effettuare il passaggio al manifest v3: https://developer.chrome.com/docs/extensions/migrating/
- La parte di intelligenza artificiale non serve, viene rimossa, decido di creare il manifest v3 da zero poichè completamente diverso da quello precedente, di conseguenza l'introduzione del service worker mi porta a rivedere l'architettura. Ho settato l'ambiente in modo da essere il più efficace possibile, e per la poca esperienza col linguaggio, e grazie a dei suggerimenti in rete, decido di utilizzare typescript, così da poter avere l'aiuto dell'ambiente di sviluppo, dato che con javascript, non essendo tipizzato, non so che tipo di oggetto ritorna o richiede una determinata funzione, quindi non ho nessun suggerimento dei metodi invocabili, inoltre commetto molti errori, dato che non gestendo i vari tipi, era compito mio stare attento al tipo di dato che mettevo, visto che potevo metterne uno qualunque ma poi avevo tanti errori in fase di testing dell'estensione. Utilizzo il builder Parcel per fare il passaggio da typescript a javascript, dato che solo quest'ultimo è accettato dal browser. Documentazione di Parcel: https://parceljs.org/recipes/web-extension/#hmr
- 


