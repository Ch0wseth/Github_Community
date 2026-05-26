# 🚀 Community Forum #2 — Guide Pratique Pas-à-Pas

> **Objectif** : Reproduire la démo du Forum #2 chez vous, même sans expérience préalable avec Copilot Agent.  
> **Durée estimée** : 45-60 min à votre rythme  
> **Niveau requis** : Débutant (toutes les commandes et prompts sont fournis)

---

## 📋 Pré-requis

### Logiciels à installer

| Outil | Version | Lien |
|-------|---------|------|
| VS Code | Dernière version | [code.visualstudio.com](https://code.visualstudio.com/) |
| GitHub Copilot (extension) | Dernière version | Marketplace VS Code → "GitHub Copilot" |
| GitHub Copilot Chat (extension) | Dernière version | Marketplace VS Code → "GitHub Copilot Chat" |
| Node.js | 18+ (recommandé : 20) | [nodejs.org](https://nodejs.org/) |
| Git | Dernière version | [git-scm.com](https://git-scm.com/) |

### Vérification de l'installation

```bash
node --version    # Doit afficher v18.x ou v20.x
npm --version     # Doit afficher 9.x ou 10.x
git --version     # Doit afficher git version 2.x
code --version    # Doit afficher un numéro de version
```

### Configuration Copilot

1. Ouvrez VS Code
2. Vérifiez que l'icône Copilot (🤖) apparaît en bas à droite
3. Cliquez dessus → vous devez voir "Copilot: Ready"
4. **Activez le mode Agent** : ouvrez le chat Copilot (Ctrl+Shift+I) et sélectionnez le mode "Agent" en haut

---

# PARTIE 1 : Création du projet — Bonnes pratiques

> On apprend à créer un projet complet avec Copilot en maîtrisant 4 piliers :
> choix du modèle, contexte permanent, techniques de prompt, gestion du contexte.

---

## 📁 Étape 1.0 : Préparer le dossier

> ⚠️ **Important** : on travaille dans un dossier VIDE, séparé du repo community-forum-2.
> Le repo community-forum-2 = le matériel (slides, README).
> Le dossier notification-service = le projet qu'on crée en live.

```bash
mkdir notification-service
cd notification-service
git init
```

---

## 🧠 Étape 1.1 : Choisir le bon modèle

### Pourquoi c'est important
Chaque modèle a des forces différentes. Choisir le bon = meilleur résultat + moins de tokens.

### Comment faire
Dans le chat Copilot → cliquer sur le **sélecteur de modèle** (en bas du chat).

### Le mode "Auto" (par défaut)

Par défaut, Copilot est en mode **Auto** — il choisit le modèle tout seul en fonction de votre demande :
- Question simple → il prend un modèle rapide/léger
- Demande complexe → il prend un modèle plus puissant

> 💡 **Pour les débutants** : restez en Auto, c'est très bien. Copilot route automatiquement.
>
> **Pour aller plus loin** : sélectionnez manuellement un modèle quand vous savez ce que vous voulez (voir grille ci-dessous).

### Grille de décision (sélection manuelle)

| Tâche | Modèle recommandé | Pourquoi |
|-------|-------------------|----------|
| Usage général | **Auto** | Copilot choisit pour vous, bon compromis |
| Créer un projet complet | **Claude Sonnet** | Bon équilibre qualité/vitesse |
| Petit fix rapide | **Claude Haiku** | Rapide, pas cher, suffisant |
| Refacto complexe multi-fichier | **Claude Opus / GPT-4.1** | Raisonnement profond |
| Analyser un gros fichier | **Gemini** | Grande fenêtre de contexte |

### 💡 Règle simple
> - **Débutant** → restez en Auto
> - **Intermédiaire** → Sonnet pour la création, Haiku pour les fixes
> - **Avancé** → choisissez selon la tâche (voir grille)
>
> Pour cette démo, on sélectionne **Claude Sonnet** manuellement pour montrer le processus.

---

## 📝 Étape 1.2 : Créer le contexte permanent (copilot-instructions.md)

### Ce qu'on fait
On crée un fichier qui briefe Copilot automatiquement à chaque conversation.

### Manipulation

1. Créez le dossier `.github/`
2. Créez `.github/copilot-instructions.md`
3. Collez ce contenu :

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

### 💡 Pourquoi c'est important
- Chargé **automatiquement** dans chaque conversation Copilot
- Plus besoin de répéter votre stack ou conventions
- Économie de tokens massive (contexte chargé 1 fois)
- Tout dev qui clone le repo → Copilot a tout le contexte

---

## 🎯 Étape 1.3 : Le bon prompt (techniques)

### ❌ Mauvais prompt (NE PAS l'exécuter)

```
Fais moi une API de notifications
```

Problème : vague, pas de structure, pas de contraintes → résultat aléatoire → tokens gaspillés.

### Les 4 techniques à retenir

| # | Technique | Pourquoi |
|---|-----------|----------|
| 1 | **Bullet points** | Copilot parse mieux les listes que les paragraphes |
| 2 | **Décrire l'architecture, pas le code** | On dit le QUOI, pas le COMMENT |
| 3 | **Contraintes explicites** | Réduit l'espace des solutions possibles |
| 4 | **Un prompt = une tâche** | Moins d'ambiguïté = meilleurs résultats |

### ✅ Le bon prompt (l'exécuter dans Copilot)

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

### Résultat attendu

```
notification-service/
├── .github/
│   └── copilot-instructions.md
├── src/
│   ├── index.ts
│   ├── routes/notifications.ts
│   ├── queue/notification-queue.ts
│   ├── channels/
│   │   ├── email.ts
│   │   └── slack.ts
│   └── middleware/logger.ts
├── package.json
└── tsconfig.json
```

---

## 🔄 Étape 1.4 : Gestion du contexte

### Les règles d'or

| Règle | Pourquoi |
|-------|----------|
| **Nouvelle conversation** si >15-20 messages | Le contexte devient pollué |
| **Nouvelle conversation** si changement de sujet | Pas de confusion entre tâches |
| **Nouvelle conversation** après beaucoup d'erreurs | Repartir sur des bases saines |
| **`#file:nom`** pour inclure un fichier précis | Donne le contexte exact sans bruit |
| **`@workspace`** pour le projet entier | Quand Copilot doit comprendre la big picture |

### Comment ça marche (la fenêtre de contexte)

La **fenêtre de contexte** = la "mémoire" de Copilot pour une conversation. Elle est composée de :
- Les instructions système (copilot-instructions.md)
- Vos messages (prompts)
- Les réponses de Copilot
- Les fichiers référencés

> ⚠️ **Cette fenêtre est limitée** (en tokens). Quand elle est pleine, les anciens messages sont tronqués ou oubliés.
> C'est pour ça qu'une longue conversation dégrade les réponses.

### Manipulation dans VS Code :
- **+** en haut du chat → nouvelle conversation
- Taper `#file:` → autocomplétion des fichiers du projet
- Taper `@workspace` → Copilot analyse tout le projet

### 💡 Piège n°1 des débutants
> Une conversation qui traîne pendant 50 messages → contexte pollué → Copilot se contredit → tokens explosent.
> **Nouvelle tâche = nouvelle conversation. C'est gratuit.**

### 📚 Sources officielles

| Sujet | Lien |
|-------|------|
| Concepts de contexte | [docs.github.com/en/copilot/concepts/context](https://docs.github.com/en/copilot/concepts/context) |
| Prompt engineering | [docs.github.com/.../prompt-engineering](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering) |
| Best practices | [docs.github.com/.../best-practices](https://docs.github.com/en/copilot/get-started/best-practices) |
| Custom instructions | [docs.github.com/.../response-customization](https://docs.github.com/en/copilot/concepts/prompting/response-customization) |
| Prompt files | [docs.github.com/.../prompt-files](https://docs.github.com/en/copilot/tutorials/customization-library/prompt-files) |

---

## 🔄 Étape 1.5 : Ajouter le retry avec dead letter

### Ce qu'on fait
On enrichit le projet — même technique : prompt structuré, une seule tâche.

### Prompt (dans le même chat)

```
Ajoute un mécanisme de retry sur l'envoi des notifications :

- 3 tentatives max avec backoff exponentiel (1s, 2s, 4s)
- Après 3 échecs → déplacer dans une dead letter queue
- Endpoint GET /dead-letter pour voir les notifications en échec
- Le channel "email" doit échouer aléatoirement 30% du temps pour simuler des erreurs
- Logger chaque tentative avec le numéro d'essai
```

### Vocabulaire

| Terme | Signification |
|-------|---------------|
| **Retry** | Réessayer automatiquement une action en échec |
| **Backoff exponentiel** | Attendre de plus en plus longtemps entre chaque essai (1s, 2s, 4s) |
| **Dead Letter Queue** | File d'attente pour les messages qui ont épuisé leurs tentatives |

---

## 🧪 Étape 1.6 : Écrire les tests

### 💡 Bonne pratique : nouvelle conversation !
On change de sujet (création → testing). Cliquez sur **+** pour un contexte propre.

### Prompt (nouvelle conversation)

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

### Notez :
- Nouvelle conversation = contexte propre
- `#file:` = on donne exactement le contexte nécessaire
- Résultat : des tests qui testent le vrai code, pas du générique

---

## ▶️ Étape 1.7 : Installer, tester, lancer

### Commandes

```bash
npm install
npm test
npm run dev
```

### Tester manuellement (dans un 2ème terminal)

```bash
# Envoyer une notification
curl -X POST http://localhost:3000/notifications \
  -H "Content-Type: application/json" \
  -d '{"channel": "email", "to": "dev@orange.com", "message": "Deploy v2.1 OK"}'

# Voir la santé
curl http://localhost:3000/health

# Voir les dead letters
curl http://localhost:3000/dead-letter
```

### Sur Windows (PowerShell)
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/notifications" `
  -ContentType "application/json" `
  -Body '{"channel":"email","to":"dev@orange.com","message":"Deploy v2.1 OK"}'
```

### Si des tests échouent
C'est **normal** ! Dites à Copilot : "Voici l'erreur : [collez l'erreur]. Corrige."

---

# PARTIE 2 : Industrialiser — Instructions, Agents, Skills

> On passe de l'usage individuel à l'usage équipe/entreprise.

---

## 📋 Étape 2.1 : Enrichir les Custom Instructions

### Ce qu'on fait
On enrichit notre `copilot-instructions.md` pour une équipe entière.

### Ajouter ces sections au fichier existant :

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

### 💡 Pourquoi c'est puissant

| Bénéfice | Impact |
|----------|--------|
| Onboarding accéléré | Nouveau dev productif en heures, pas en jours |
| Cohérence de code | Mêmes patterns partout, même sans revue |
| Économie de tokens | Moins de corrections, moins d'allers-retours |
| Évolutif | Git versionné, PR pour changer les standards |

### Les 3 niveaux d'instructions

| Niveau | Fichier | Portée |
|--------|---------|--------|
| �� Organisation | Repo `.github` de l'org | Tous les repos |
| 📁 Repository | `.github/copilot-instructions.md` | Un repo |
| 👤 Personnel | Settings VS Code | Vous uniquement |

---

## 🤖 Étape 2.2 : Créer des Custom Agents

### Ce qu'on fait
On crée des agents spécialisés qui automatisent des tâches récurrentes.

### Agent 1 : Code Reviewer

Créez `.github/agents/code-reviewer.md` :

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

1. **Sécurité** — Pas de secrets en dur, inputs validés
2. **Patterns d'équipe** — Retry, logs structurés, pas de `any`
3. **Tests** — Chaque fonction a un test, edge cases couverts
4. **Performance** — Pas de boucle synchrone, pas de N+1

## Format de sortie
- 📍 Fichier + ligne
- ⚠️ Problème
- ✅ Suggestion de fix
```

### Agent 2 : API Scaffolder

Créez `.github/agents/api-scaffolder.md` :

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
2. Types dans `src/types/{resource}.ts`
3. Tests dans `tests/{resource}.test.ts`
4. Mise à jour de `src/index.ts`

Respecte les conventions du copilot-instructions.md.
```

### Comment les utiliser
Dans le chat Copilot : `@code-reviewer vérifie mes derniers changements`

---

## ⚡ Étape 2.3 : Créer des Prompt Templates (Skills)

### Ce qu'on fait
On crée des templates réutilisables = la bibliothèque de patterns de l'équipe.

### Template 1 : Créer un endpoint

Créez `.github/prompts/create-endpoint.prompt.md` :

```markdown
---
name: Create REST Endpoint
description: 'Scaffold a complete REST endpoint with our conventions'
mode: agent
---

Create a new REST endpoint for the resource: {{ resource }}

- Route file: `src/routes/{{ resource }}.ts`
- CRUD: GET all, GET by id, POST, PUT, DELETE
- Input validation + structured logging + proper HTTP codes
- Tests in `tests/{{ resource }}.test.ts`
```

### Template 2 : Ajouter du retry

Créez `.github/prompts/add-retry.prompt.md` :

```markdown
---
name: Add Retry Pattern
description: 'Add retry with exponential backoff to any function'
mode: agent
---

Add retry to: {{ function_name }} in {{ file_path }}

- Max retries: {{ max_retries | default: 3 }}
- Backoff exponential
- On final failure: dead letter / throw
- Log each attempt + add tests
```

### Comment les utiliser
Dans le chat, tapez `/` → sélectionnez le template → remplissez les variables.

### 💡 L'avantage

| Individuel | Équipe |
|-----------|--------|
| Réécrire le prompt à chaque fois | Template prêt à l'emploi |
| Qualité variable | Standard garanti |
| Savoir perdu | Savoir capitalisé |

---

## 🌐 Étape 2.4 : Ressources communautaires

### Awesome GitHub Copilot

🔗 **https://aka.ms/awesome-github-copilot**

Un repo communautaire avec des centaines de fichiers prêts à l'emploi :
- **Prompts** — tâches spécialisées par domaine
- **Instructions** — standards par langage/framework
- **Chat Modes** — personas IA (reviewer, architect, etc.)

> **Bonne pratique** : on prend ce qui existe, on l'adapte à notre contexte, on le versionne.

### Caveman — Optimisation token ultime 🦴

🔗 **https://github.com/JuliusBrussee/caveman**

Le concept : forcer les agents à communiquer en mode ultra-compressé.

| Mode normal | Mode Caveman |
|-------------|-------------|
| "I'll create a Python function that calculates the factorial using recursion..." | "Python. Factorial. Recursion. Input int. Return factorial." |
| ~35 tokens | ~10 tokens |
| **Résultat : -65% de tokens en sortie** | |

> Les tokens de sortie coûtent 3-4x plus cher que ceux d'entrée.
> À l'échelle d'Orange avec des centaines de devs, ça représente des milliers d'euros/mois.

---

### Hiérarchie complète

```
🏗️ Industrialisation Copilot :

┌─────────────────────────────────────┐
│  copilot-instructions.md            │  ← CONTEXTE (toujours actif)
├─────────────────────────────────────┤
│  .github/agents/                     │  ← AUTOMATISATION (invoqués)
├─────────────────────────────────────┤
│  .github/prompts/                    │  ← CAPITALISATION (templates)
└─────────────────────────────────────┘
```

---

# PARTIE 3 : Multi-Agents dans VS Code

> Depuis VS Code 1.109 (janvier 2026), le multi-agent est **natif**.
> Vous pouvez exécuter Copilot, Claude et Codex côte à côte, déléguer des sous-tâches,
> et gérer toutes vos sessions depuis un seul endroit.
>
> 📖 Réf : [Multi-Agent Development — VS Code Blog](https://code.visualstudio.com/blogs/2026/02/05/multi-agent-development)

---

## 🔀 Étape 3.1 : L'Agent Sessions View

### Le concept

VS Code centralise tous vos agents dans la vue **Agent Sessions** :

```
┌─────────────────────────────────────┐
│  Agent Sessions                      │
├─────────────────────────────────────┤
│  🟢 Local - Copilot (Sonnet)       │  ← Interactif, sur votre machine
│  🟡 Background - Claude (Opus)     │  ← Async, worktree isolé
│  🔵 Cloud - Codex                  │  ← Remote, crée des PRs
│  └── Subagent: Research            │  ← Sous-tâche parallèle
│  └── Subagent: Security scan       │  ← Sous-tâche parallèle
└─────────────────────────────────────┘
```

### Les 3 modes d'exécution

| Critère | Local | Background | Cloud |
|---------|-------|-----------|-------|
| Où ça tourne | Votre machine | Votre machine (CLI) | Infrastructure distante |
| Interaction | Interactive | Asynchrone | Asynchrone / Autonome |
| Visibilité équipe | Non | Non | Oui (PRs/issues) |
| Isolation | Non (workspace direct) | Oui (worktrees) | Oui (remote) |

### Quand utiliser quoi

- **Local** → vous voulez piloter, itérer rapidement
- **Background** → tâche bien définie, vous continuez à coder en parallèle
- **Cloud** → refactoring long, feature complète, le résultat arrive en PR

---

## 🤖 Étape 3.2 : Utiliser Claude et Codex comme agents

### Activer les agents

1. Ouvrez le sélecteur de session dans le chat Copilot
2. Choisissez votre agent : **Copilot**, **Claude**, ou **Codex**
3. Claude utilise le harness officiel Anthropic (mêmes outils, mêmes prompts)

> ⚙️ Setting : `github.copilot.chat.claudeAgent.enabled` (géré par votre organisation)
> 
> Pré-requis Codex local : abonnement Copilot Pro+ et [extension OpenAI Codex](https://marketplace.visualstudio.com/items?itemName=openai.chatgpt)

### Exercice : Générer une feature avec Claude (local)

Sélectionner **Claude Sonnet** → mode Agent :

```
Ajoute un endpoint POST /notifications/bulk qui accepte un array
de notifications et les enqueue toutes. Retourne un array de IDs.
Validation : max 100 notifications par batch.
```

---

## 🔀 Étape 3.3 : Subagents — orchestration automatique

### Le concept

Les **subagents** sont des agents isolés que votre agent principal peut lancer en parallèle.
Le résultat remonte à la session principale, le contexte intermédiaire reste contenu.

```
Agent Principal (vous pilotez)
    │
    ├── 🔍 Subagent Research → cherche patterns d'auth dans le codebase
    ├── 📖 Subagent Docs → scanne la documentation pertinente
    └── 🔒 Subagent Security → vérifie les vulnérabilités
    
    ← Résultats agrégés, contexte propre
```

### Avantages
- **Parallélisme** : plusieurs tâches en même temps
- **Isolation** : le contexte principal reste léger
- **Économie de tokens** : seul le résultat final remonte

### Exercice : Review multi-agent avec handoffs

Créez un custom agent `.github/agents/review-workflow.md` :

```markdown
---
name: review-workflow
description: Workflow de review automatisé
handoffs:
  - agent: code-reviewer
    trigger: Code généré, prêt pour review
  - agent: security-scanner
    trigger: Review OK, vérification sécurité
---

Tu es un orchestrateur de review.
Quand du code est généré, tu le passes d'abord au code-reviewer,
puis au security-scanner. Tu résumes les findings à la fin.
```

Puis dans le chat, demandez :

```
@review-workflow Vérifie le code du endpoint /notifications/bulk.
#file:src/routes/notifications.ts
```

→ L'agent orchestre automatiquement : review → security → résumé.

---

## 💡 Étape 3.4 : Le pattern Code → Review → Fix (modernisé)

### Avant (orchestration manuelle)
- Ouvrir une nouvelle conversation pour chaque étape
- Changer manuellement le modèle
- Copier/coller le contexte entre sessions

### Maintenant (orchestration native)
- **Custom agents + handoffs** pour les workflows automatiques
- **Subagents parallèles** pour la recherche et l'analyse
- **Agent Sessions view** pour tout superviser
- **Cloud agents** pour les tâches longues qui génèrent des PRs

### 💡 Résumé

| Besoin | Outil | Mode | Agent |
|--------|-------|------|-------|
| Générer du code (interactif) | Chat Agent | Local | Claude Sonnet / Copilot |
| Revoir du code | Custom Agent + handoff | Local | Claude Opus |
| Recherche codebase | Subagent | Parallèle | Auto |
| Scan sécurité | Subagent | Parallèle | Auto |
| Feature complète async | Cloud Agent | Cloud | Codex / Claude |
| Refactoring long | Background Agent | Background | Claude |
| Tests + corrections itératifs | Chat Agent | Local | Claude Sonnet |

---

# PARTIE 4 : Récap & Pour aller plus loin

---

## 📊 Consommation de tokens

### Estimation pour cette démo

| Étape | Tokens estimés |
|-------|---------------|
| Bootstrap | ~3 300 |
| Retry + DLQ | ~2 400 |
| Tests | ~2 600 |
| Fix erreurs | ~1 300 |
| Instructions + Agents | ~1 800 |
| **TOTAL** | **~11 400** |

### Avec vs sans bonnes pratiques

| Approche | Tokens | Économie |
|----------|--------|----------|
| ❌ Prompts vagues, pas d'instructions, pas de reset | ~32 000 | — |
| ✅ Instructions + prompts précis + contexte frais | ~11 400 | **~64%** |

---

## 🎯 Ce qu'on a construit

```
📦 notification-service/
├── .github/
│   ├── copilot-instructions.md        ← CONTEXTE permanent
│   ├── agents/
│   │   ├── code-reviewer.md           ← AGENT review
│   │   └── api-scaffolder.md          ← AGENT scaffolding
│   └── prompts/
│       ├── create-endpoint.prompt.md  ← SKILL endpoint
│       └── add-retry.prompt.md        ← SKILL retry
├── src/
│   ├── index.ts
│   ├── routes/notifications.ts
│   ├── queue/notification-queue.ts
│   ├── channels/
│   │   ├── email.ts
│   │   └── slack.ts
│   └── middleware/logger.ts
├── tests/
│   ├── notifications.test.ts
│   └── retry.test.ts
├── package.json
└── tsconfig.json
```

---

## 🚀 Pour aller plus loin

### Challenges bonus

1. **Ajouter un channel "teams"** — Simulez Microsoft Teams
2. **Ajouter des métriques Prometheus** — Endpoint `/metrics`
3. **Dockeriser le service** — Dockerfile + docker-compose
4. **Rate limiter** — Max 10 notifications/minute par destinataire
5. **Tester Caveman** — Ajouter une instruction de concision et comparer les tokens

### Ressources

- 📖 [Documentation Copilot](https://docs.github.com/en/copilot)
- 🌟 [Awesome Copilot](https://aka.ms/awesome-github-copilot)
- 🦴 [Caveman (token compression)](https://github.com/JuliusBrussee/caveman)
- 💬 Channel Teams de la communauté (lien interne)

---

## 🆘 Troubleshooting

| Problème | Solution |
|----------|----------|
| Copilot ne génère rien | Vérifiez le mode **Agent** (pas Ask/Edit) |
| Imports cassés | Lancez `npm install` |
| Tests échouent | Dites à Copilot : "Voici l'erreur : [erreur]. Corrige." |
| Serveur ne démarre pas | Vérifiez que le port 3000 est libre |
| curl ne marche pas (Windows) | Utilisez `Invoke-RestMethod` en PowerShell |
| `gh copilot` non trouvé | `gh extension install github/gh-copilot` |

---

*Créé pour le Community Forum #2 — GitHub Copilot Community of Practice @ Orange*
