# INCIDENT LOG - Holbies Festival

Pour chaque incident, documentez **avant** de célébrer le CLEARED :

## FC-101 - Double réservation de scène

**Symptôme observé :**
Il était possible de réserver la même scène pour deux spectacles avec des horaires qui se chevauchent.

**Cause racine :**
La fonction `scheduleShow` dans `scheduleService.js` ne vérifiait pas les conflits d'horaire pour une même scène avant d'ajouter un nouveau spectacle.

**Correction appliquée :**
Ajout d'une vérification dans `scheduleShow` (ligne 21-24) utilisant la fonction `overlaps` pour détecter les chevauchements d'horaire sur la même scène. Si un conflit est détecté, la fonction retourne `{ ok: false, code: 'STAGE_CONFLICT', message: 'Stage déjà réservé à cet horaire.' }`.

**Pourquoi cette correction respecte la documentation de référence :**
La logique métier exige qu'une scène ne puisse pas être réservée simultanément pour deux spectacles. Cette correction implémente cette règle en utilisant la fonction `overlaps` existante pour valider les créneaux horaires.

**Commande de validation :**
```bash
npm run check -- FC-101
```

**Résultat :**
```bash
> holbies-festival-control@1.3.0 check
> node private/checker.js check FC-101


✓ FC-101 — Collision de scène
  INCIDENT CLEARED
```

---

## FC-102 - Artiste ubiquitaire

**Symptôme observé :**
Il était possible de programmer le même artiste sur deux scènes différentes à des horaires qui se chevauchent.

**Cause racine :**
La fonction `scheduleShow` dans `scheduleService.js` ne vérifiait pas les conflits d'horaire pour un même artiste avant d'ajouter un nouveau spectacle.

**Correction appliquée :**
Ajout d'une vérification dans `scheduleShow` (ligne 27-30) utilisant la fonction `overlaps` pour détecter les chevauchements d'horaire pour le même artiste. Si un conflit est détecté, la fonction retourne `{ ok: false, code: 'ARTIST_CONFLICT', message: 'Artiste déjà programmé à cet horaire.' }`.

**Pourquoi cette correction respecte la documentation de référence :**
La logique métier exige qu'un artiste ne puisse pas être programmé simultanément sur deux scènes différentes. Cette correction implémente cette règle en utilisant la fonction `overlaps` existante pour valider les créneaux horaires.

**Commande de validation :**
```bash
npm run check -- FC-102
```

**Résultat :**
```bash
> holbies-festival-control@1.3.0 check
> node private/checker.js check FC-102


✓ FC-102 — Artiste ubiquitaire
  INCIDENT CLEARED

  ACTE 2 DÉVERROUILLÉ — LES PORTES S’ENTROUVRENT
```

---


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

**Résultat :**
```bash
> holbies-festival-control@1.3.0 check
> node private/checker.js check FC-105


✓ FC-105 — Scène morte
  INCIDENT CLEARED
```

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
