# ADR001. React für die Webanwendung und Expo für die mobile App zu verwenden

- **Datum:** 2025-03-07
- **Status:** Angenommen
- **Autoren:** Semih Sönmez, Metin Gökcen, Niklas Reis

## 1. Kontext
Das CareConnect-Projekt wird sowohl auf Tablets und PCs in Pflegeheimen als auch als mobile App für die Angehörigen genutzt. Daher muss die Anwendung sowohl auf Desktops als auch auf mobilen Geräten optimal funktionieren.

## 2. Entscheidung
Wir haben uns entschieden, React für die Webanwendung und Expo für die mobile App zu verwenden

## 3. Begründung
- **React:** Ermöglicht eine flexible, wartbare und komponentenbasierte Architektur für die Web-App. Zudem haben wir React in der Vorlesung gelernt, sodass wir bereits Erfahrung damit haben
- **Expo:** Vereinfacht die Entwicklung der mobilen App mit React Native, insbesondere für plattformübergreifende Funktionen
- **Einheitlicher Code:** Da React und React Native eine ähnliche Syntax haben, können viele Komponenten für Web und Mobile wiederverwendet werden
- **Einfaches Deployment:** Expo bietet eine einfache Bereitstellung für iOS und Android
- **Bessere Wartbarkeit:** Durch die Nutzung von React im gesamten Stack wird der Entwicklungsaufwand reduziert und die Konsistenz der Codebasis erhöht

## 4. Alternativen
- **Flutter:** Hätte eine leistungsstarke plattformübergreifende Entwicklung ermöglicht, aber erfordert Dart-Kenntnisse und ist weniger geeignet für Web-Anwendungen

## 5. Konsequenzen
- Die Webanwendung wird mit React entwickelt und kann auf PCs und Tablets genutzt werden
- Die mobile App wird mit Expo entwickelt und auf iOS sowie Android bereitgestellt
- Zusätzliche Tests und Optimierungen sind erforderlich, um eine reibungslose UX auf allen Geräten zu gewährleisten
- Entwickler müssen mit React sowie React Native arbeiten, was eine gewisse Lernkurve für React Native bedeutet

# ADR 002: Hosting

## Status
Beschlossen

## Kontext
Unsere Anwendungen brauchen eine Infrastruktur. Dafür bieten sich zahlreiche Cloud-Hosting Provider an. Unter anderem Google, AWS und Azure.

## Entscheidung
Azure bietet Förderungen für Studenten an - in Form von Guthaben 100USD und diverse gratis Produkte wie zB. VMs, Databases. 

## Konsequenzen
Infrastuktur ist durch diese Entscheidung in der Cloud. Muss besser vor unerlaubten Zugriffen geschützt werden. Es muss darauf geachtet werden, dass die Daten in Europa bleiben -> wegen DSGVO.

## Alternativen
AWS, Google Cloud, Datacenter-Hosting, Selfhosting, On-Prem Server, ...

## Metadaten
- **Autor:** Reis, Gökcen, Sönmez
- **Datum:** 08.03.2025
- **Betroffene Komponenten:** Hosting


# ADR 003: Systemarchitektur - Docker Container Plattform

## Status
Beschlossen

## Kontext
Wie bauen wir die Anwendung auf. Microservice, Monlithisch, Containerisiert, Client-Server Architektur

## Entscheidung
Container-Architektur ist für unseren Anwendungsfall neben der Client-Server Architektur die beste. Sie bietet skalierbarkeit an, hat eine noch klarere Trennung und Isolierung zwischen den einzelnen Funktionen und Anwendungen. Sollte in Zukunft die Anwendung größer skaliert werden, ist der Umstieg von zB Docker-Compose auf Kubernetes etc. ein leichtes.

## Konsequenzen
Vereinfachung der Wartung und Skalierung, verbesserte Sicherheit durch isolierung, klare Abgrenzung, nicht so flexibel bei spontanen Änderungen, könnte ein bisschen teuerer sein wie Alternativen

## Alternativen
Monolith: zu Resourcenintensiv, schlecht skalierbar, zu hohe Kopplung und niedrige Kohäsion
Client-Server: hat genau die gleichen Vorteile wie Containerisierte Architekturen aber lässt sich doch ein bisschen schlechter skalieren welches wir in Zukunft brauchen werden

## Metadaten
- **Autor:** Reis, Gökcen, Sönmez
- **Datum:** 08.03.2025
- **Betroffene Komponenten:** Systemarchitektur der Anwendungen


# ADR 004 Datenbank-Technologie

## Status
Beschlossen

## Kontext
Die Anwendung benötigt eine Datenbank zur Speicherung von Nutzerdaten, Pflegeinformationen und Kommunikationsprotokollen. Dabei müssen Datenschutz, Skalierbarkeit und Wartbarkeit berücksichtigt werden.

## Entscheidung
Wir entscheiden uns für PostgreSQL als relationale Datenbank.

## Konsequenzen
Schema muss vorab initialisiert werden, dafür gut skalierbar, dsgvo konform durch eigenes hosting und verschlüsselung und optimale verwaltung von relationalen Daten

## Alternativen
mongodb: gut für unstrukturierte Daten aber weniger sinnvoll bei komplexeren relationen
mysql: mysql isch scheisse

## Metadaten
- **Autor:** Reis, Gökcen, Sönmez
- **Datum:** 08.03.2025
- **Betroffene Komponenten:** Backend, Datenspeicherung

# ADR 005 API Architektur

## Status
Beschlossen

## Kontext
Es wird eine Schnittstelle benötigt damit die Applikation mit der Datenbank kommunizieren kann. Diese muss sicher und einfach skalierbar sein

## Entscheidung
RESTful und express.js

## Konsequenzen
besser kompatibel mit react/expo - alles java/typescript, leicht erweiterbar durch rest-endpoints, kein nativer support für stark verknüpfte datenabfragen (wird aber auch nicht benötigt), leichter einstieg

## Alternativen
.net EF: größeres framework, braucht mehr ressourcen, unnötiger sprachmix mit c#, dadurch erhöhter entwicklungsaufwand,

## Metadaten
- **Autor:** Reis, Gökcen, Sönmez
- **Datum:** 08.03.2025
- **Betroffene Komponenten:** Backend, API

# ADR 006: n8n als Technologie für automatisierte Chatantworten und diverse Prozesse

- **Datum:** 2025-04-22
- **Status:** Angenommen
- **Autoren:** Semih Sönmez, Metin Gökcen, Niklas Reis

## 1. Kontext
Im CareConnect-Projekt sollen wiederkehrende Abläufe – etwa automatisierte Chat-Antworten an Angehörige, Benachrichtigungen bei kritischen Pflegeereignissen oder tägliche Zusammenfassungen – ohne manuellen Eingriff ausgeführt werden. Zudem benötigen wir eine Plattform, die sich leicht in unsere bestehende Infrastruktur (React‑Frontend, Node.js‑API, PostgreSQL, Docker‑Container) einfügt und visuelle Workflow-Definitionen erlaubt.

## 2. Entscheidung
Wir entscheiden uns für den Einsatz von n8n als zentrale Automatisierungs- und Workflow-Orchestrierungs-Plattform.

## 3. Begründung
- **Open Source & Self‑Hosting:** n8n ist unter der fair‑code Lizenz verfügbar und kann vollständig in unserer Azure‑Cloud oder On‑Premise innerhalb unserer DSGVO-konformen Umgebung betrieben werden.
- **Visueller Workflow Builder:** Ermöglicht es auch Nicht‑Entwicklern, Abläufe per Drag‑and‑Drop zu definieren und zu warten, wodurch der Betrieb und die Pflege automatischer Prozesse entlastet werden.
- **Reiche Integrationen:** n8n bietet über 200 vorgefertigte Integrationen (z. B. HTTP-Requests, Slack, E‑Mail, Datenbank) und lässt sich mithilfe eigener JavaScript‑Nodes beliebig erweitern.
- **Container‑Ready:** Läuft als Docker‑Container und fügt sich nahtlos in unsere bestehende Container‑Plattform ein; Skalierung über Kubernetes oder Docker‑Compose ist jederzeit möglich.
- **Kostenkontrolle:** Durch Self‑Hosting entfallen monatliche Gebühren für cloudbasierte Automationstools, was gerade im Langzeitbetrieb kosteneffizienter ist.

## 4. Konsequenzen
- **Deployment & Betrieb:** Einrichtung und Wartung einer n8n‑Instanz (Docker‑Container, Persistenz-DB, ggf. SSL‑Proxy) muss durch das DevOps-Team erfolgen.
- **Lernkurve:** Administratoren und Power-User müssen in die n8n-Workflow-Entwicklung eingewiesen werden.
- **Sicherheit & Governance:** Es sind Mechanismen für Rollen‑ und Zugriffsrechte zu etablieren, um sensible Patientendaten in Automatisierungen zu schützen.
- **Monitoring & Backup:** Workflows und Ausführungslogs müssen überwacht sowie Backups der n8n‑Datenbank und Konfigurationen regelmäßig angelegt werden.

## 5. Alternativen
- **Zapier / Make (Integromat):** Cloud‑basierte Lösungen mit großem Funktionsumfang, jedoch laufende Kosten und nicht vollständig selbst‑hostbar.
- **Node‑RED:** Ebenfalls open source und containerfähig, aber primär für IoT‑Szenarien ausgelegt und weniger Enterprise‑ready in Sachen integrierter Authentifizierung und Governance.
- **Eigene Node.js‑Skripte:** Volle Flexibilität, jedoch hoher Wartungsaufwand und fehlende visuelle Übersicht über Prozesse.
- **Apache NiFi:** Mächtige Datenfluss‑Engine, jedoch komplexer Betrieb und Overhead für einfache Automatisierungen.

## 6. Metadaten
- **Betroffene Komponenten:** Automatisierung, Backend, DevOps
- **Priorität:** Mittel (Aufbauphase der Automatisierungen)
- **Erstellt:** 22.04.2025

