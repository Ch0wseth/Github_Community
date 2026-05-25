# 🎬 Script de Démo — Community Forum #2

## Philosophie : Difficulté incrémentale

```
🟢 NIVEAU 1 — Débutant (tout le monde suit)
   → Créer un projet from scratch avec les bonnes bases

🟡 NIVEAU 2 — Intermédiaire (la plupart suit)
   → Industrialiser : instructions enrichies, templates, agents

🔴 NIVEAU 3 — Avancé (power users)
   → Multi-agents, orchestration, CLI, optimisation poussée
```

> 💡 Message en début de session :
> "Cette démo est progressive. Le Niveau 1 est pour tout le monde.
> Si vous repartez avec ça, c'est déjà une victoire.
> Les niveaux 2 et 3 sont pour ceux qui veulent aller plus loin."

## Concept : Microservice de Notification
> Créer from scratch un microservice qui gère l'envoi de notifications
> avec retry automatique, queue in-memory, et observabilité (logs structurés + metrics).

## Pourquoi c'est parlant
- ✅ Pattern réel de microservice (pas une todo app)
- ✅ Retry, dead letter, health check = vrais problèmes quotidiens
- ✅ Montre que Copilot comprend l'architecture, pas juste le CRUD
- ✅ Reproductible par chacun après la session

---

## Pré-requis
- VS Code avec Copilot (mode Agent activé)
- Node.js installé
- Terminal ouvert dans un dossier vide

---

# 🟢 NIVEAU 1 : Démarrer avec Copilot (20 min)

> ⭐ **C'est le cœur de la session.** Si vous ne retenez qu'une chose, c'est ça.
> Accessible à tous, quel que soit votre niveau.

> Cette partie couvre 4 piliers : prompt engineering, choix du modèle, gestion du contexte, et création effective.

---

## 1.1 Choisir le bon modèle AVANT de commencer (2 min)

### 💬 Message oral :
> "Avant même d'écrire un prompt, on choisit le bon modèle.
> C'est comme choisir le bon outil dans une caisse à outils."

### Montrer dans VS Code :
- Ouvrir le chat Copilot → cliquer sur le sélecteur de modèle (en bas)
- Montrer les options disponibles
- **Montrer le mode "Auto"** (sélectionné par défaut)

### 💬 Expliquer le mode Auto :
> "Par défaut Copilot est en mode **Auto** — il route automatiquement
> vers le meilleur modèle selon votre demande.
> Question simple → modèle rapide. Demande complexe → modèle puissant.
>
> Pour un débutant, Auto c'est très bien. Vous n'avez rien à faire.
> Mais quand on maîtrise, on peut choisir manuellement."

### Grille de décision (afficher la slide) :

| Tâche | Modèle recommandé | Pourquoi |
|-------|-------------------|----------|
| Usage général | **Auto** | Copilot choisit pour vous |
| Créer un projet complet | **Claude Sonnet** | Bon équilibre qualité/vitesse, comprend l'archi |
| Petit fix rapide | **Claude Haiku** | Rapide, pas cher, suffisant |
| Refacto complexe multi-fichier | **Claude Opus / GPT-4.1** | Raisonnement profond nécessaire |
| Analyser un gros fichier | **Gemini** | Grande fenêtre de contexte |

### 💬 Message clé :
> "Aujourd'hui on sélectionne **Sonnet** manuellement pour la démo.
> Mais retenez : Auto est un très bon défaut si vous débutez.
> Règle simple : commencer par Auto, passer en manuel quand vous sentez
> que le résultat n'est pas au niveau."

---

## 1.2 Préparer le contexte avec copilot-instructions.md (3 min)

### 💬 Message oral :
> "Avant de demander quoi que ce soit, on pose le CONTEXTE.
> C'est comme briefer un nouveau développeur le jour 1."

### Manipulation :
1. Créer le dossier `.github/`
2. Créer `.github/copilot-instructions.md`
3. Coller ce contenu :

```markdown
# Notification Service

## Stack
- Node.js 20 + TypeScript strict
- Express.js
- Jest + supertest pour les tests

## Conventions
- Logs structurés JSON (timestamp, level, correlationId)
- Gestion d'erreur explicite, jamais de catch silencieux
- Un fichier = une responsabilité
- Codes HTTP standards (201, 400, 404, 500)

## Architecture
- src/routes/ → API endpoints
- src/queue/ → Processing async
- src/channels/ → Intégrations (email, slack)
- src/middleware/ → Cross-cutting concerns
```

### 💬 Messages clés :
> "Ce fichier est chargé AUTOMATIQUEMENT dans chaque conversation Copilot.
> Plus jamais besoin de répéter votre stack, vos conventions, votre archi."
>
> "C'est aussi une économie de tokens massive : le contexte est chargé 1 fois,
> pas ré-expliqué dans chaque message."
>
> "Et surtout : demain votre collègue clone le repo → Copilot a TOUT le contexte."

---

## 1.3 Techniques de prompt : le bon prompt (5 min)

### 💬 Message oral :
> "Maintenant le prompt. La différence entre un résultat moyen et un résultat excellent,
> c'est 30 secondes de rédaction."

### D'abord montrer un MAUVAIS prompt (ne pas l'exécuter) :

```
Fais moi une API de notifications
```

### 💬 Commenter :
> "Vague, pas de structure, pas de contraintes.
> Copilot va deviner → résultat aléatoire → allers-retours → tokens gaspillés."

### Puis montrer les TECHNIQUES une par une :

#### Technique 1 : Structure en bullet points
> "Toujours des bullet points, jamais des paragraphes."

#### Technique 2 : Décrire l'architecture, pas le code
> "On dit le QUOI (endpoints, structure, patterns), pas le COMMENT."

#### Technique 3 : Contraintes explicites
> "On précise ce qu'on veut ET ce qu'on ne veut pas."

#### Technique 4 : Un prompt = une tâche
> "On ne demande pas tout d'un coup. On décompose."

### Le BON prompt (l'exécuter) :

```
Crée un microservice Node.js TypeScript de notification avec :

- Express pour l'API
- Un endpoint POST /notifications pour soumettre une notification
- Un endpoint GET /notifications/:id pour le statut
- Un endpoint GET /health avec uptime et stats (nb envoyés, nb échoués, queue size)
- Une queue in-memory (array) qui traite les notifications de manière async
- Support de 2 channels : "email" et "slack" (simulés avec des console.log)
- Structure : src/queue/, src/routes/, src/channels/, src/middleware/

Utilise des logs structurés JSON (timestamp, level, correlationId).
```

### 💬 Décortiquer pendant que Copilot travaille :
> "Notez la structure :
> - On a des bullets clairs (1 point = 1 besoin)
> - On a décrit l'architecture (les dossiers, les endpoints)
> - On a une contrainte technique (logs JSON + correlationId)
> - On n'a PAS dit comment implémenter la queue ou les channels
> 
> Résultat : un microservice complet en ~30 secondes."

---

## 1.4 Gestion du contexte (2 min)

### 💬 Message oral :
> "Dernier point fondamental : la gestion du contexte.
> Un mauvais contexte = de mauvaises réponses, même avec un bon prompt."

### Les règles à montrer :

| Règle | Pourquoi |
|-------|----------|
| **Nouvelle conversation** si >15-20 messages | Le contexte devient pollué, les réponses dégradent |
| **Nouvelle conversation** si changement de sujet | Pas de confusion entre tâches |
| **Nouvelle conversation** après beaucoup d'erreurs | Repartir sur des bases saines |
| **`#file:nom`** pour inclure un fichier | Donne le contexte exact sans bruit |
| **`@workspace`** pour le projet entier | Quand Copilot doit comprendre la big picture |

### 💬 Messages clés :
> "Le piège n°1 des débutants : une conversation qui traîne pendant 50 messages.
> Le contexte est pollué, Copilot se contredit, les tokens explosent."
>
> "La bonne pratique : des conversations COURTES et PRÉCISES.
> Nouvelle tâche = nouvelle conversation. C'est gratuit et ça améliore tout."

### Montrer dans VS Code :
- Montrer comment démarrer une nouvelle conversation (icône +)
- Montrer comment référencer un fichier avec `#file:`
- Montrer `@workspace`

---

## 1.5 Résultat du bootstrap (3 min)

### Ce que Copilot a généré :
```
📦 notification-service/
├── .github/
│   └── copilot-instructions.md    ← Notre contexte
├── src/
│   ├── index.ts                   ← Express setup
│   ├── routes/notifications.ts    ← POST, GET /:id, GET /health
│   ├── queue/notification-queue.ts ← Queue async
│   ├── channels/
│   │   ├── email.ts               ← Simulateur
│   │   └── slack.ts               ← Simulateur
│   └── middleware/logger.ts       ← Structured JSON logs
├── package.json
└── tsconfig.json
```

### 💬 Message de récap :
> "En 10 minutes on a :
> 1. Choisi le bon modèle (Sonnet)
> 2. Posé le contexte permanent (instructions.md)
> 3. Écrit UN prompt structuré
> 4. Obtenu un microservice complet
>
> Le tout en économisant des tokens parce qu'on a été précis dès le départ."

---

## 1.6 Ajouter le retry avec dead letter (5 min)

### 💬 Message oral :
> "Maintenant on enrichit. Même technique : un prompt structuré, une seule tâche."

### Prompt :
```
Ajoute un mécanisme de retry sur l'envoi des notifications :

- 3 tentatives max avec backoff exponentiel (1s, 2s, 4s)
- Après 3 échecs → déplacer dans une dead letter queue
- Endpoint GET /dead-letter pour voir les notifications en échec
- Le channel "email" doit échouer aléatoirement 30% du temps pour simuler des erreurs
- Logger chaque tentative avec le numéro d'essai
```

### Ce que Copilot fait :
- Modifie `notification-queue.ts` pour ajouter le retry
- Ajoute la dead letter queue
- Met à jour le channel email avec le taux d'échec
- Ajoute la route `/dead-letter`

### 💬 Message clé :
> "On ne réécrit rien. On décrit le comportement voulu et Copilot modifie
> le code existant avec le bon pattern. Il a le contexte du projet grâce à notre instructions.md."

---

## 1.7 Tests (5 min)

### 💬 Message oral :
> "Nouvelle conversation. Pourquoi ? Parce qu'on change de sujet : de la création → du testing.
> Contexte propre = meilleurs résultats."

### Montrer :
- Cliquer sur **+** pour nouvelle conversation
- Utiliser `#file:notification-queue.ts` dans le prompt pour donner le contexte

### Prompt :
```
#file:src/queue/notification-queue.ts
#file:src/routes/notifications.ts

Écris les tests pour ce microservice :

- Test du POST /notifications (happy path + validation erreur)
- Test du retry (mock le channel pour qu'il échoue 2 fois puis réussisse)
- Test de la dead letter (mock le channel pour qu'il échoue toujours)
- Test du GET /health (vérifier les stats)
- Utilise Jest + supertest
```

### 💬 Messages clés :
> "Notez deux choses :
> 1. Nouvelle conversation = contexte propre
> 2. On utilise `#file:` pour donner exactement le contexte nécessaire
>
> Résultat : des tests pertinents qui testent le vrai code, pas du générique."

---

## 1.8 Run & Show (3 min)

### Commandes :
```bash
npm install
npm test
npm run dev
```

### Montrer :
- `npm test` → tous les tests passent ✅
- `npm run dev` → serveur lancé
- Envoyer des notifications :
```bash
curl -X POST http://localhost:3000/notifications \
  -H "Content-Type: application/json" \
  -d '{"channel": "email", "to": "dev@orange.com", "message": "Deploy v2.1 OK"}'
```
- Montrer les logs structurés dans le terminal
- Montrer `GET /health` avec les stats
- Montrer `GET /dead-letter` avec les messages en échec

### 💬 Message de transition :
> "On a un projet complet, testé, qui tourne. C'était le **Niveau 1** —
> les bases que TOUT LE MONDE peut appliquer dès demain.
> 
> 👉 Si vous ne retenez qu'une chose : `copilot-instructions.md` + prompts structurés.
> Ça change déjà 80% de votre expérience Copilot.
>
> Maintenant on monte d'un cran pour ceux qui veulent industrialiser."

### 📊 Pause tokens (afficher le token-tracker) :
> "Au passage, regardez où on en est côté tokens :
> - Bootstrap : ~3 300 tokens
> - Retry : ~2 400 tokens
> - Tests : ~2 600 tokens
> - Total Niveau 1 : **~8 300 tokens**
>
> Sans les bonnes pratiques (pas d'instructions, prompts vagues, pas de reset) :
> on serait à ~25 000 tokens. **Économie : 67% juste avec les bases.**"

---

# 🟡 NIVEAU 2 : Industrialiser pour l'équipe (10 min)

> 💡 **Message oral** : "Si vous êtes à l'aise avec le Niveau 1, voici comment
> passer à l'échelle d'une équipe. C'est ce qui fait la différence entre
> un usage perso et un usage entreprise."

> Cette partie montre comment passer de l'usage individuel à l'usage équipe/entreprise.

---

## 2.1 Custom Instructions — Le contexte permanent (3 min)

### 💬 Message oral :
> "On a déjà créé notre `copilot-instructions.md` dans la Partie 1.
> Maintenant on va plus loin : comment structurer ce fichier pour une équipe."

### Montrer le fichier existant :
- Ouvrir `.github/copilot-instructions.md`

### Enrichir le fichier (ajouter ces sections) :

```markdown
## Patterns d'équipe
- Retry : toujours avec backoff exponentiel + dead letter
- Logs : structurés JSON, jamais de console.log nu
- Tests : minimum 80% coverage, mocks explicites
- API : toujours un health endpoint

## À éviter
- Pas de `any` en TypeScript
- Pas de callbacks imbriqués (utiliser async/await)
- Pas de secrets en dur
- Ne jamais ignorer les erreurs silencieusement

## Glossaire métier
- Notification = message envoyé à un utilisateur via un channel
- Channel = vecteur d'envoi (email, slack, sms, push)
- Dead letter = notification qui a épuisé ses tentatives de retry
```

### 💬 Messages clés :
> "Ce fichier est la MÉMOIRE de l'équipe dans Copilot :
> - Les patterns validés → Copilot les applique automatiquement
> - Les anti-patterns → Copilot les évite
> - Le glossaire → Copilot comprend VOTRE vocabulaire métier
>
> Tout dev qui clone le repo obtient un Copilot déjà formé à vos pratiques."

### Points à souligner :
| Bénéfice | Impact |
|----------|--------|
| Onboarding accéléré | Nouveau dev productif en heures, pas en jours |
| Cohérence de code | Mêmes patterns partout, même sans revue |
| Économie de tokens | Moins de corrections, moins d'allers-retours |
| Évolutif | Git versionné, PR pour changer les standards |

---

## 2.2 Custom Agents — Automatiser les tâches récurrentes (4 min)

### 💬 Message oral :
> "Les instructions donnent le contexte. Les agents, eux, automatisent des TÂCHES.
> Un agent = une instruction spécialisée + un périmètre d'action."

### Créer un agent : `.github/agents/code-reviewer.md`

```markdown
---
name: Code Reviewer
description: Revue de code automatisée selon les standards de l'équipe
tools:
  - filesystem
---

# Code Reviewer Agent

Tu es un reviewer senior de l'équipe Notification Platform.

## Ta mission
Analyser le code modifié et vérifier :

1. **Sécurité**
   - Pas de secrets en dur
   - Inputs validés et sanitisés
   - Pas de SQL injection / XSS possible

2. **Patterns d'équipe**
   - Retry avec backoff sur tout appel externe
   - Logs structurés sur chaque erreur
   - Pas de `any` TypeScript
   - Gestion d'erreur explicite

3. **Tests**
   - Chaque nouvelle fonction a un test associé
   - Les edge cases sont couverts (null, empty, error)

4. **Performance**
   - Pas de boucle synchrone sur des grandes collections
   - Pas de requête N+1

## Format de sortie
Pour chaque problème trouvé :
- 📍 Fichier + ligne
- ⚠️ Problème
- ✅ Suggestion de fix

Si tout est OK : "✅ Code review passed — aucun problème détecté."
```

### 💬 Montrer l'utilisation :
> "Pour invoquer cet agent, dans le chat : `@code-reviewer vérifie mes derniers changements`"

### Créer un 2ème agent rapide : `.github/agents/api-scaffolder.md`

```markdown
---
name: API Scaffolder
description: Génère un endpoint CRUD complet selon nos conventions
tools:
  - filesystem
---

# API Scaffolder

Quand on te demande de créer un endpoint, génère :

1. Route dans `src/routes/{resource}.ts`
2. Types/interfaces dans `src/types/{resource}.ts`
3. Tests dans `tests/{resource}.test.ts`
4. Mise à jour de `src/index.ts` pour enregistrer la route

Respecte les conventions du fichier copilot-instructions.md.
Utilise toujours : validation des inputs, logs structurés, codes HTTP corrects.
```

### 💬 Messages clés :
> "Un agent = un rôle automatisé. On les accumule au fil du temps :
> - Code reviewer
> - API scaffolder
> - Doc generator
> - Security auditor
> - Migration helper
>
> Chaque agent est un fichier markdown. Versionné. Partagé. Amélioré en équipe.
> C'est de l'OUTILLAGE, pas du one-shot."

### Point sur les tokens :
> "Un agent consomme des tokens à chaque invocation. Mais un agent bien défini
> fait le travail en 1 passe au lieu de 5 tentatives manuelles.
> Net : on ÉCONOMISE des tokens."

---

## 2.3 Skills & Prompt Templates — La bibliothèque partagée (3 min)

### 💬 Message oral :
> "Dernière brique : les skills. C'est la CAPITALISATION des prompts.
> Au lieu que chaque dev réinvente le prompt, on les met en commun."

### Créer un prompt template : `.github/prompts/create-endpoint.prompt.md`

```markdown
---
name: Create REST Endpoint
description: Scaffold a complete REST endpoint with our conventions
---

# Create REST Endpoint

Create a new REST endpoint for the resource: {{ resource }}

## Requirements:
- Route file: `src/routes/{{ resource }}.ts`
- CRUD operations: GET all, GET by id, POST, PUT, DELETE
- Input validation with explicit error messages
- Structured JSON logging on each operation
- Proper HTTP status codes (200, 201, 400, 404, 500)
- CorrelationId tracking through middleware

## Testing:
- Create `tests/{{ resource }}.test.ts`
- Test happy path + error cases for each operation
- Use supertest + jest
```

### Montrer l'utilisation :
> "Dans le chat : `/` → sélectionner le template → remplir `resource = users`
> → Copilot génère tout selon VOS conventions."

### Créer un 2ème skill : `.github/prompts/add-retry.prompt.md`

```markdown
---
name: Add Retry Pattern
description: Add retry with exponential backoff to any function
---

# Add Retry Pattern

Add retry logic to: {{ function_name }} in {{ file_path }}

## Implementation:
- Max retries: {{ max_retries | default: 3 }}
- Backoff: exponential (1s, 2s, 4s...)
- On final failure: log error + move to dead letter / throw
- Log each attempt with attempt number
- Add corresponding test in tests/
```

### 💬 Messages clés :
> "Les prompt templates = la bibliothèque de patterns de l'équipe :
>
> | Individuel | Équipe |
> |-----------|--------|
> | Réécrire le prompt à chaque fois | Template prêt à l'emploi |
> | Qualité variable | Standard garanti |
> | Savoir perdu | Savoir capitalisé |
> | Tokens gaspillés | Tokens optimisés |
>
> Au fil du temps, votre repo `.github/prompts/` devient votre boîte à outils.
> Un nouveau dans l'équipe → il a TOUS les patterns du premier jour."

### Résumer la hiérarchie :
```
🏗️ Hiérarchie d'industrialisation Copilot :

┌─────────────────────────────────────┐
│  copilot-instructions.md            │  ← CONTEXTE (toujours actif)
│  Stack, conventions, glossaire       │
├─────────────────────────────────────┤
│  .github/agents/                     │  ← AUTOMATISATION (invoqués)
│  Tâches spécialisées répétables     │
├─────────────────────────────────────┤
│  .github/prompts/                    │  ← CAPITALISATION (templates)
│  Patterns d'équipe réutilisables    │
└─────────────────────────────────────┘
```

### 💬 Message de transition :
> "Avec ces 3 briques — instructions, agents, prompts — vous passez
> de l'usage individuel de Copilot à l'usage industrialisé.
> C'était le **Niveau 2** — l'outillage d'équipe.
>
> 👉 Le Niveau 2 c'est 30 min de setup pour des mois de gains.
>
> Maintenant, pour les curieux et les power users,
> on va voir comment orchestrer PLUSIEURS agents ensemble.
> C'est la vision de ce que Copilot devient."

---

## 2.4 Ressources communautaires : Awesome Copilot & Caveman (3 min)

### 💬 Message oral :
> "Pas besoin de tout créer from scratch. La communauté a déjà produit
> des centaines d'instructions, prompts et agents prêts à l'emploi."

### Montrer : Awesome GitHub Copilot

🔗 **https://aka.ms/awesome-github-copilot** (ou `github.com/microsoft/awesome-copilot`)

#### Qu'est-ce que c'est :
- Un repo communautaire curé par Microsoft
- Des centaines de fichiers prêts à copier-coller :
  - **Prompts** (.prompt.md) — tâches spécialisées
  - **Instructions** (.instructions.md) — standards de code par langage/framework
  - **Chat Modes** (.chatmode.md) — personas IA spécialisées

#### Montrer dans le repo :
```
awesome-copilot/
├── prompts/          ← Prompts task-specific (agent ou ask)
├── instructions/     ← Standards de code (par pattern de fichier)
├── chatmodes/        ← Personas spécialisées (reviewer, architect...)
```

#### 💬 Messages clés :
> "Vous voulez un instruction file pour TypeScript strict ? Il existe déjà.
> Un prompt pour générer des tests ? Déjà là. Un chat mode 'Security Auditor' ? Aussi.
>
> La bonne pratique : on prend ce qui existe, on l'adapte à notre contexte Orange,
> et on le versionne dans NOTRE repo. On ne part jamais de zéro."

#### Bonus : MCP Server
> "Il y a même un MCP Server pour installer ces customizations directement
> depuis VS Code. Mais ça, c'est pour un prochain forum."

---

### Montrer : Caveman — L'optimisation token ultime 🦴

🔗 **https://github.com/JuliusBrussee/caveman**

#### 💬 Message oral :
> "Et maintenant un truc fun qui illustre parfaitement le lien
> entre prompt engineering et économie de tokens."

#### Le concept (afficher) :

```
💡 "Why use many token when few token do trick"

Caveman = un mode de communication ultra-compressé pour les agents IA.
Résultat : -65% de tokens en sortie, sans perte de précision technique.
```

#### Exemple avant/après :

| Mode normal | Mode Caveman |
|-------------|-------------|
| "I'll create a Python function that calculates the factorial of a given number using recursion. The function will take a single integer as an argument and return its factorial value." | "Python. Factorial. Recursion. Input int. Return factorial." |
| ~35 tokens en sortie | ~10 tokens en sortie |

#### Comment l'utiliser :
> "On ajoute une instruction dans notre `copilot-instructions.md` :"

```markdown
## Communication style
When generating explanations or comments, be extremely concise.
Use minimal words. No filler. No redundancy.
Technical accuracy over verbosity.
```

#### 💬 Messages clés :
> "Caveman c'est radical, mais l'idée est puissante :
> - Les tokens de SORTIE coûtent 3-4x plus cher que ceux d'entrée
> - Un agent verbeux = cher et lent
> - Un agent concis = rapide, pas cher, et tout aussi précis
>
> À l'échelle d'Orange avec des centaines de devs, la différence
> entre un Copilot verbeux et un Copilot concis = des milliers d'euros/mois.
>
> Caveman est open source, 64k+ stars, et prouve que le prompt engineering
> ce n'est pas que pour l'INPUT — c'est aussi contrôler l'OUTPUT."

#### Lien avec le token-tracker :
> "C'est exactement ce qu'on voit dans notre dashboard de tokens :
> les mêmes tâches, avec ou sans optimisation, ça change tout."

---

# 🔴 NIVEAU 3 : Multi-Agents & Orchestration avancée (10 min)

> 💡 **Message oral** : "Ce niveau est pour les power users et les curieux.
> C'est l'avenir de Copilot — et c'est déjà disponible aujourd'hui.
> Même si vous ne l'appliquez pas demain, ça vous donne la vision."

> Cette partie montre l'orchestration multi-agents : comment plusieurs agents
> travaillent ensemble, comment choisir le bon modèle par tâche, et comment
> piloter Copilot depuis le terminal avec `gh copilot`.

---

## 3.1 Le concept multi-agents (2 min)

### 💬 Message oral :
> "Jusqu'ici on a utilisé UN agent dans VS Code.
> Mais la puissance réelle c'est l'ORCHESTRATION : plusieurs agents,
> chacun spécialisé, qui collaborent sur un même projet."

### Schéma à afficher (slide) :

```
┌─────────────────────────────────────────────────────┐
│                   VOUS (le pilote)                    │
└──────────┬──────────────┬──────────────┬────────────┘
           │              │              │
    ┌──────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
    │  Agent Code │ │  Agent   │ │  Agent     │
    │  (Sonnet)   │ │  Review  │ │  CLI/Ops   │
    │             │ │  (Opus)  │ │  (Haiku)   │
    │ Génère le   │ │ Vérifie  │ │ Exécute    │
    │ code        │ │ qualité  │ │ commandes  │
    └─────────────┘ └──────────┘ └────────────┘
           │              │              │
           └──────────────┴──────────────┘
                          │
                    ┌─────▼─────┐
                    │  PROJET   │
                    │  FINAL    │
                    └───────────┘
```

### 💬 Message clé :
> "Chaque agent a un modèle adapté à sa tâche :
> - Code generation → Sonnet (bon rapport qualité/coût)
> - Code review → Opus (raisonnement profond, trouve les bugs subtils)
> - Exécution de commandes → Haiku (rapide, pas cher, suffisant)
>
> C'est ça l'industrialisation : pas un gros modèle pour tout,
> mais le BON modèle pour chaque tâche."

---

## 3.2 Multi-agents dans VS Code (4 min)

### 💬 Message oral :
> "Concrètement dans VS Code, voici comment orchestrer plusieurs agents."

### Démonstration : Workflow en 3 étapes

#### Étape A — Agent Code : générer une feature

Ouvrir le chat Copilot → sélectionner **Sonnet** → mode Agent :

```
Ajoute un endpoint POST /notifications/bulk qui accepte un array 
de notifications et les enqueue toutes. Retourne un array de IDs.
Ajoute la validation : max 100 notifications par batch.
```

> "Agent Code avec Sonnet : génère le code rapidement."

#### Étape B — Agent Review : vérifier le code généré

**Nouvelle conversation** → sélectionner **Opus** → invoquer notre agent :

```
@code-reviewer Vérifie le code du endpoint /notifications/bulk 
qui vient d'être créé. Vérifie sécurité, performance, et patterns d'équipe.
#file:src/routes/notifications.ts
```

> "Agent Review avec Opus : raisonnement profond, trouve ce que Sonnet a raté.
> Typiquement : validation insuffisante, edge cases, injection possible."

#### Étape C — Agent Fix : appliquer les corrections

Retour sur **Sonnet** (nouvelle conversation) :

```
Applique ces corrections sur src/routes/notifications.ts :
#file:src/routes/notifications.ts

1. Valider que chaque notification a un channel et un "to" non vide
2. Limiter la taille du message à 1000 caractères
3. Retourner 207 Multi-Status si certaines notifications sont invalides
```

> "On boucle : Code → Review → Fix. Chaque agent dans son rôle."

### 💬 Messages clés :
> "L'orchestration c'est VOUS qui la faites. Vous êtes le chef d'orchestre :
> - Vous choisissez quel agent pour quelle tâche
> - Vous choisissez quel modèle pour quel agent
> - Vous gardez le contexte propre (nouvelle conversation à chaque étape)
>
> Demain avec les évolutions Copilot, cette orchestration sera automatisable.
> Mais aujourd'hui le pattern est déjà puissant en manuel."

---

## 3.3 GitHub Copilot dans le terminal (4 min)

### 💬 Message oral :
> "VS Code c'est bien pour le code. Mais en tant que dev on vit aussi
> dans le terminal. Copilot est là aussi, via `gh copilot`."

### Pré-requis : vérifier l'extension
```bash
gh extension list
# Doit afficher : gh-copilot
# Sinon : gh extension install github/gh-copilot
```

### Démo 1 : Expliquer une commande

```bash
gh copilot explain "find . -name '*.ts' -exec grep -l 'deadLetter' {} \;"
```

> "Vous ne connaissez pas une commande ? Copilot l'explique en langage humain.
> Modèle rapide (Haiku), réponse en 2 secondes, tokens minimaux."

### Démo 2 : Générer une commande depuis une description

```bash
gh copilot suggest "find all TypeScript files modified in the last 24h"
```

> "Vous décrivez ce que vous voulez en français ou anglais,
> Copilot génère la commande shell exacte. Plus besoin de googler."

### Démo 3 : Debugging avec Copilot CLI

```bash
gh copilot suggest "check which process is using port 3000 and kill it"
```

### Démo 4 : Workflow Git assisté

```bash
gh copilot suggest "stage only TypeScript files, commit with a message describing the retry feature, and push"
```

> "Même les workflows Git complexes : Copilot génère la séquence de commandes."

### 💬 Messages clés :
> "Le `gh copilot` c'est le Copilot du terminal :
> - `explain` → comprendre une commande existante
> - `suggest` → générer une commande depuis une description
>
> C'est le même modèle, la même intelligence, mais adapté au contexte terminal.
> Et c'est disponible MAINTENANT — pas besoin de VS Code."

### Mention rapide : Copilot Coding Agent

> "Et pour aller plus loin, il y a le **Coding Agent** :
> vous assignez une issue GitHub à Copilot, et il crée une PR tout seul —
> code, tests, itérations. C'est l'avenir de l'orchestration automatique.
> On en reparlera dans un prochain forum quand ce sera déployé chez nous."

---

## 3.4 Tableau récap : quel agent pour quoi (1 min)

### Afficher :

| Besoin | Outil | Modèle | Où |
|--------|-------|--------|-----|
| Générer du code | Chat Agent | Sonnet | VS Code |
| Revoir du code | Custom Agent reviewer | Opus | VS Code |
| Commandes rapides | `gh copilot suggest` | Haiku | Terminal |
| Expliquer | `gh copilot explain` | Haiku | Terminal |
| Feature complète async | Coding Agent | Auto | GitHub Actions |
| Tests + corrections | Chat Agent itératif | Sonnet | VS Code |

### 💬 Message de transition :
> "Multi-agents ce n'est pas de la science-fiction.
> C'est disponible MAINTENANT dans VS Code + Terminal + GitHub.
> La clé c'est de choisir le bon outil, le bon modèle, pour chaque tâche.
> Et de garder le contexte propre à chaque étape."

---

# 🏁 CLOSING : Récap par niveau (3 min)

---

## Message de closing

### 💬 Message oral :
> "On récapitule. Cette démo était progressive — voici ce que vous pouvez appliquer DÈS DEMAIN :"

### Récap par niveau (afficher la slide) :

```
🟢 NIVEAU 1 — À faire DEMAIN (5 min d'effort)
   ✅ Ajouter copilot-instructions.md à votre projet
   ✅ Utiliser des prompts structurés (bullets, architecture)
   ✅ Nouvelle conversation = nouvelle tâche
   ✅ Choisir le bon modèle (Sonnet par défaut)
   → Résultat : meilleur code, moins de tokens, zéro config complexe

🟡 NIVEAU 2 — À faire CETTE SEMAINE (30 min d'effort)
   ✅ Enrichir les instructions (patterns, anti-patterns, glossaire)
   ✅ Créer 1 prompt template pour votre pattern le plus fréquent
   ✅ Créer 1 agent pour votre tâche la plus répétitive
   → Résultat : capitalisation d'équipe, onboarding accéléré

🔴 NIVEAU 3 — À explorer CE MOIS (quand vous êtes à l'aise)
   ✅ Workflow multi-agents (Code → Review → Fix)
   ✅ gh copilot dans le terminal
   ✅ Tester Caveman pour l'optimisation tokens
   → Résultat : orchestration avancée, usage expert
```

### 💬 Message de fin :
> "Le README pas-à-pas est dans le repo. Tout est reproductible chez vous.
> Commencez par le Niveau 1 — c'est 5 minutes et ça change tout.
> Questions ?"

---

## Plan B

| Problème | Solution |
|----------|----------|
| Copilot lent/timeout | Avoir le projet fini dans `backup/` et montrer le résultat |
| Erreur de compil | "Parfait, on voit l'agent corriger tout seul" (feature, pas bug) |
| API rate limit | Screencast pré-enregistré de 2 min en secours |

---

## Tips pendant la démo

- 🎤 Narrer pendant que Copilot travaille ("il est en train de créer la queue...")
- 📋 Avoir les prompts dans un fichier texte pour copier-coller
- ⏱️ Si ça prend trop de temps, couper avec "on a le résultat ici" → backup
- 🐛 Si erreur : "C'est normal, regardez comment l'agent itère"
- 🎯 Insister sur le fait qu'on décrit le QUOI, pas le COMMENT
