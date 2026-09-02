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
La logique métier (`04_schedule_sequence.mmd:11`) exige qu'une scène ne puisse pas être réservée simultanément pour deux spectacles. Cette correction implémente cette règle en utilisant la fonction `overlaps` existante pour valider les créneaux horaires.

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
La logique métier (`04_schedule_sequence.mmd:12`) exige qu'un artiste ne puisse pas être programmé simultanément sur deux scènes différentes. Cette correction implémente cette règle en utilisant la fonction `overlaps` existante pour valider les créneaux horaires.

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


## FC-103 - Bracelet fantôme

**Symptôme observé :**
Il était possible d'accorder l'accès à une zone (ex: VIP Deck) en utilisant un bracelet lié à un billet non ACTIVE (ex: CANCELLED), contournant ainsi la validation de l'état du billet.

**Cause racine :**
La fonction `checkAccess` dans `accessService.js` ne vérifiait pas l'état (`status`) du billet associé au bracelet. Elle se contentait de vérifier l'existence du billet sans s'assurer qu'il était ACTIVE.

**Correction appliquée :**
Ajout d'une vérification dans `checkAccess` (ligne 10) pour rejeter l'accès si `ticket.status !== 'ACTIVE'`, retournant `{ allowed:false, code:'TICKET_INACTIVE' }`.

**Pourquoi cette correction respecte la documentation de référence :**
Le diagramme d'état (`03_access_sequence.mmd:12`) montre que seul l'état ACTIVE est valide pour un accès. La séquence d'accès (`03_access_sequence.mmd:12`) exige explicitement de vérifier que le billet est actif.

**Commande de validation :**
```bash
npm run check -- FC-103
```

**Résultat :**
```bash
> holbies-festival-control@1.3.0 check
> node private/checker.js check FC-103


✓ FC-103 — Bracelet fantôme
  INCIDENT CLEARED
```

---

## FC-104 - Backstage breach

**Symptôme observé :**
Accès non autorisé à la zone backstage.

**Cause racine :**
La fonction `checkAccess` dans `accessService.js` ne vérifiait pas correctement les droits d'accès pour la zone backstage.

**Correction appliquée :**
Vérification renforcée des droits d'accès pour la zone backstage.

**Pourquoi cette correction respecte la documentation de référence :**
La séquence d'accès (`working/docs/diagrams/03_access_sequence.mmd:12`) exige de vérifier le billet actif et sa validité.

**Commande de validation :**
```bash
npm run check -- FC-104
```

**Résultat :**
```bash
> holbies-festival-control@1.3.0 check
> node private/checker.js check FC-104


✓ FC-104 — Backstage breach
  INCIDENT CLEARED

  ACTE 3 DÉVERROUILLÉ — LA FOULE MONTE 
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
