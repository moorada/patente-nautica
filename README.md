# Patente Nautica Trainer

Web app responsive per allenarsi ai quiz della patente nautica con dataset ufficiali in JSON, modalità esame realistiche, quiz infinito e allenamento sulle domande più sbagliate.

## Demo links

- 🌐 Web app: https://moorada.github.io/patente-nautica/
- ☕ Supporta il progetto: https://www.buymeacoffee.com/moorada
- 📝 Feedback: https://github.com/moorada/patente-nautica/issues/new
- ⭐ Metti una stella: https://github.com/moorada/patente-nautica/stargazers

## Funzionalità

- Modalità principali:
  - Esami e integrazioni
  - Quiz infinito personalizzato
  - Domande più sbagliate
- Classifica errori (top domande più sbagliate) con storico locale
- Memoria risposte su `localStorage`
- Tema chiaro/scuro
- Supporto immagini dei quesiti
- Scorciatoie tastiera desktop:
  - `1..9` selezione risposta
  - `Enter` / `→` invia-avanti
  - `←` indietro
  - `S` mostra soluzione

## Avvio locale

Apri la cartella del progetto e avvia un server statico:

```bash
python3 -m http.server
```

Poi apri:

- `http://localhost:8000`

## Pubblicazione su GitHub

### 1) Inizializza la repo locale

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit"
```

### 2) Crea repo su GitHub e collega remote

```bash
git remote add origin https://github.com/moorada/patente-nautica.git
git push -u origin main
```

### 3) GitHub Pages (workflow incluso)

Nel repository GitHub:

- vai su `Settings` → `Pages`
- Source: `GitHub Actions`

Il workflow `.github/workflows/pages.yml` pubblicherà automaticamente il sito.

## Struttura principale

- `index.html` entrypoint UI
- `src/app.js` logica quiz/memoria/modalità
- `src/styles.css` stile responsive
- `data/quizzes/` dataset JSON domande
- `data/images/base/` immagini collegate al quiz base
- `data/images/vela/` immagini collegate al quiz vela
- `tools/create_data/` script e materiale di conversione dati

## Note

I dati progresso sono salvati nel browser (`localStorage`) con chiave `nautica-progress-v1`.
