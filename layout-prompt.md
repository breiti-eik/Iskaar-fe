# 🎯 Layout Prompt – Iskaar Game Board (Phaser / React)

Implementiere ein UI-Layout für das Multiplayer-Deckbuilder-Spiel **Iskaar**, basierend auf einer server-authoritative Architektur.

## 🧠 Grundprinzipien

* UI basiert ausschließlich auf `GameView`
* Kein eigener Client-State
* Renderer kennt keine Spielregeln
* Layout folgt strikt der Domain-Struktur:

  * GameBoard (öffentlich)
  * Player-Zonen (privat)
  * Active Player Fokus

---

## 🧩 Layout-Struktur

Das Spielfeld ist in **4 Hauptbereiche** unterteilt:

---

### 🔝 1. GameBoard (Top-Bereich)

Position: oberer Bildschirmbereich

Inhalt:

* EquipmentPiles (4 Stapel, oberste Karte sichtbar)
* Geldvorräte (Knut, Gro, Rand)
* Troll-Karte (falls vorhanden)

Layout:

* horizontal zentriert
* gleichmäßiger Abstand zwischen Karten
* statisch (keine Interaktion aktuell)

---

### 🟨 2. Active InPlay (Zentraler Fokus)

Position: Bildschirmmitte

Inhalt:

* `inPlay` des aktuell aktiven Spielers

Logik:

* Wenn `view.activePlayerId === view.me.playerId`
  → `view.me.inPlay`
* sonst:
  → `view.opponents[i].inPlay`

Darstellung:

* Karten horizontal angeordnet
* keine Rotation
* kein Hover
* leicht vergrößert im Vergleich zu Board-Karten

Visuelles Highlight:

* goldener Rahmen um Bereich
* optional Text:

  * "Your Turn"
  * oder "Opponent Turn"

---

### 🔽 3. LocalPlayerArea (unten)

Position: unterer Bildschirmbereich

Inhalt:

* `view.me.hand`

Darstellung:

* große Karten
* gefächert (Kurve + Rotation)
* Hover-Effekt (Lift + Scale)
* klickbar (EventBus → PlayCard)

---

### 👉 4. OpponentArea (rechts)

Position: rechte Bildschirmseite (vertikal)

Für jeden Gegner:

* Name
* DrawPile (als Kartenrückseite plus Anzahl)
* Hand (als Kartenrückseiten )
* DiscardPile obenerste offene Karte

Darstellung:

* kompakt 

  * eingeklappt nur Name
  * ausgeklappt alle infos 


---

## 🎯 Rendering-Regeln

* Jede Zone ist eine eigene View:

  * `HandView`
  * `InPlayView`
  * `OpponentView`
  * (optional später: `BoardView`, etc)

* `GameScene` orchestriert:

  * entscheidet, welche Daten wohin gehen
  * ruft `setCards()` auf

---

## 🧠 Datenfluss

```text
GameView
↓
GameScene
↓
Views (HandView, InPlayView, ...)
↓
Phaser Card Objects
```

---

## ❗ Wichtige Regeln

* ❌ Keine Spiellogik im Frontend

* ❌ Keine Duplikation von State

* ❌ Keine Annahmen über Domain

* ✅ Alles basiert auf `GameView`

* ✅ Views sind dumb (nur Rendering)

* ✅ GameScene entscheidet Kontext

---

## 🎯 Ziel

Ein klares, fokussiertes UI mit:

* zentralem Active Player Fokus
* sauber getrennten Player-Zonen
* stabiler, nachvollziehbarer Struktur

Das Layout soll jederzeit eindeutig zeigen:
👉 Wer ist dran
👉 Welche Karten sind aktiv
👉 Was kann der Spieler tun
