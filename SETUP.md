# Ankora Setup Guide

## Schnellstart-Anleitung

### 1. Supabase-Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein kostenloses Konto
2. Erstelle ein neues Projekt
3. Warte, bis das Projekt vollständig eingerichtet ist (ca. 2 Minuten)

### 2. Umgebungsvariablen konfigurieren

1. In deinem Supabase-Dashboard, gehe zu **Settings** → **API**
2. Kopiere die folgenden Werte:
   - **Project URL** (z.B. `https://abcdefgh.supabase.co`)
   - **anon public** Key

3. Erstelle eine `.env.local` Datei im Projekt-Root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key-hier
```

### 3. Datenbank einrichten

1. Gehe in deinem Supabase-Dashboard zu **SQL Editor**
2. Klicke auf **New query**
3. Öffne die Datei `supabase/migrations/001_initial_schema.sql` in diesem Projekt
4. Kopiere den gesamten Inhalt und füge ihn in den SQL Editor ein
5. Klicke auf **Run** (oder drücke Cmd/Ctrl + Enter)

Die Datenbank wird jetzt eingerichtet mit:
- ✅ 3 Tabellen (profiles, checklist_items, user_checklist_progress)
- ✅ Row Level Security (RLS) Policies
- ✅ Seed-Daten für 4 Checklisten-Typen
- ✅ 20 vorausgefüllte Checklisten-Items (5 pro Status-Typ)

### 4. Abhängigkeiten installieren

```bash
npm install
```

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

## Erste Schritte nach dem Start

1. **Landing Page**: Wähle eine Sprache aus
2. **Registrierung**: Erstelle ein neues Konto
3. **Onboarding**:
   - Schritt 1: Wähle deine bevorzugte Sprache
   - Schritt 2: Wähle deinen Status (Asyl, EU-Bürger, Fachkraft, Student)
   - Schritt 3: Gib deine Stadt/PLZ ein
   - Schritt 4: Definiere dein Ziel
4. **Dashboard**: Sieh deine personalisierte Checkliste und verfolge deinen Fortschritt

## Verfügbare Status-Typen

Jeder Status-Typ hat 5 spezifische Aufgaben:

### 🔸 Asylverfahren (asylum)
1. Asylantrag stellen
2. Anhörung vorbereiten
3. Aufenthaltsgestattung erhalten
4. Integrationskurs anmelden
5. Arbeitserlaubnis beantragen

### 🔸 EU-Bürger (eu_citizen)
1. Anmeldung beim Bürgeramt
2. Krankenversicherung abschließen
3. Steuernummer beantragen
4. Bankkonto eröffnen
5. Führerschein umschreiben

### 🔸 Fachkraft (skilled_worker)
1. Visum beantragen
2. Anerkennung der Qualifikation
3. Arbeitsvertrag abschließen
4. Blaue Karte EU beantragen
5. Familiennachzug vorbereiten

### 🔸 Student (student)
1. Zulassung zur Universität
2. Finanzierungsnachweis erbringen
3. Studentenvisum beantragen
4. Krankenversicherung abschließen
5. Nebenjob suchen

## Mehrsprachigkeit testen

Das Projekt unterstützt 7 Sprachen:
- Deutsch: http://localhost:3000/de
- English: http://localhost:3000/en
- Türkçe: http://localhost:3000/tr
- العربية: http://localhost:3000/ar (RTL)
- کوردی (سۆرانی): http://localhost:3000/ku-sorani (RTL)
- Kurdî (Kurmancî): http://localhost:3000/ku-kurmanji
- فارسی: http://localhost:3000/fa (RTL)

## Produktions-Build

```bash
npm run build
npm start
```

## Troubleshooting

### Problem: "Invalid API key"
**Lösung**: Überprüfe, ob die `.env.local` Datei korrekt erstellt wurde und die richtigen Werte enthält.

### Problem: "relation 'profiles' does not exist"
**Lösung**: Die SQL-Migration wurde nicht ausgeführt. Gehe zu Schritt 3 und führe die Migration aus.

### Problem: "Row Level Security Policy violation"
**Lösung**: Stelle sicher, dass du angemeldet bist. RLS verhindert den Zugriff auf Daten ohne Authentifizierung.

### Problem: Checklistennach dem Onboarding leer
**Lösung**: Überprüfe, ob die Seed-Daten korrekt eingefügt wurden. Führe die SQL-Migration erneut aus.

## Nächste Schritte (Sprint 2+)

Potenzielle Erweiterungen:
- [ ] Dokument-Upload und -Verwaltung
- [ ] Termin-Planung für Behördengänge
- [ ] Mehrschritt-Formular-Guides
- [ ] Ressourcen-Bibliothek (PDFs, Links)
- [ ] Community-Features
- [ ] Push-Benachrichtigungen
- [ ] Offline-Modus
- [ ] Druckbare Checklisten

## Support

Bei Problemen:
1. Überprüfe die `.env.local` Datei
2. Überprüfe die Supabase-Konsole auf Fehler
3. Sieh dir die Browser-Konsole auf Fehlermeldungen an
4. Überprüfe die Supabase-Logs im Dashboard

---

Viel Erfolg mit Ankora! ⚓
