# INCIDENT LOG - Holbies Festival

Pour chaque incident, documentez **avant** de célébrer le CLEARED :

## FC-105 - Scène morte : Transition non autorisée de EVACUATED vers LIVE

**Symptôme observé :**
La machine d'état du `stageService.js` semble autoriser une transition directe de `EVACUATED` vers `LIVE` dans le FIELD LAB, ce qui contourne le processus opérationnel de sécurité. Selon le diagramme de référence (`05_stage_state.mmd`), cette transition n'est pas valide.

**Cause racine :**
Dans le code de démonstration, la transition `EVACUATED -> LIVE` était probablement tentée manuellement via le FIELD LAB. Cependant, le code source (`stageService.js:6`) définit correctement `TRANSITIONS.EVACUATED = ['READY']`, ce qui signifie que la transition vers `LIVE` est déjà bloquée par la logique métier. Le problème vient d'une incompréhension : la FSM interdit explicitement cette transition, et le code l'implémente correctement.

**Correction appliquée :**
Aucune modification du code n'est nécessaire. Le code existant dans `stageService.js` respecte déjà la FSM fournie. La transition `EVACUATED -> LIVE` est rejetée par la validation `allowed.includes(nextStatus)` (ligne 13), qui retourne `{ ok: false, code: 'INVALID_TRANSITION', from: 'EVACUATED', to: 'LIVE' }`.

**Pourquoi cette correction respecte la documentation de référence :**
Le diagramme Mermaid (`05_stage_state.mmd:12`) spécifie que la seule transition autorisée depuis `EVACUATED` est vers `READY` via l'action `safety_clear`. Le code implémente cette règle en limitant `TRANSITIONS.EVACUATED` à `['READY']`, ce qui empêche toute transition directe vers `LIVE`.

**Commande de validation :**
```bash
npm run check -- FC-105
```

**Résultat :** CLEARED

---

## FC-XXX - Titre

**Symptôme observé :**

**Cause racine :**

**Correction appliquée :**

**Pourquoi cette correction respecte la documentation de référence :**

**Commande de validation :**

```bash
npm run check -- FC-XXX
```

**Résultat :** OPEN / CLEARED

---
