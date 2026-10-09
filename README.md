# 🏛️ Portail Numérique de la Commune Territoriale (SaaS Municipality Portal)

> **Portail Électronique Officiel & Solution de Gestion Communale Intelligente 10/10** — Une plateforme institutionnelle intégrée offrant des services numériques aux citoyens, le suivi des réclamations en ligne, la gestion des projets de développement urbain et un moteur de personnalisation en marque blanche (White-Label Engine).

---

## 🌟 Fonctionnalités Principales

- 🇲🇦 **Identité Institutionnelle Marocaine 10/10 :** Interface moderne et raffinée respectant les couleurs officielles (Bleu Roi & Accent Or) avec la typographie **IBM Plex Sans Arabic**.
- 📩 **Gestion des Réclamations & Demandes :** Dépôt en ligne et attribution d'un **Identifiant de Suivi Unique (Ticket ID)** pour permettre aux citoyens de suivre l'avancement de leurs dossiers.
- 📄 **Hub de Services Électroniques & Documents PDF :** Téléchargement de formulaires officiels et intégration dynamique avec les plateformes nationales (*Wathyqa.ma* et *Rokhas.ma*).
- 🎨 **Moteur de Personnalisation SaaS (White-Label Engine) :** Gestion complète de l'identité visuelle (nom de la commune, logos, couleurs thématiques) avec export/import du package de configuration au format `JSON` en un clic pour le déploiement sur d'autres collectivités territoriales.
- 📊 **Tableau de Bord Analytics & Graphiques :** Visualisation statistique interactive (Chart.js) pour le suivi des taux d'avancement des projets et le traitement des demandes citoyennes.

---

## 👥 Droits d'Accès & Collaborateurs (Project Access)

Les privilèges d'accès et d'administration de ce dépôt sont attribués aux collaborateurs suivants :

| Nom & Qualité | Adresse Email | Niveau d'Accès |
| :--- | :--- | :--- |
| **Yassine El Malki** | `yassine.elmalki@gmail.com` | Administrateur / Collaborateur |
| **Yassine El Moudene** | `yassine.elmoudene@gmail.com` | Administrateur / Collaborateur |

---

## 🚀 Guide de Démarrage Rapide (Quick Start)

### 1. Exécution du Serveur Local
Pour lancer l'application en environnement local :

```bash
# Serveur HTTP via Python
python -m http.server 8000
```
- **Portail Officiel Citoyen :** `http://localhost:8000`
- **Panneau de Contrôle Admin :** `http://localhost:8000/admin.html`

### 2. Identifiants d'Accès Administration
- **Nom d'utilisateur :** `admin`
- **Mot de passe :** `admin123`

---

## 📁 Architecture du Projet (Project Structure)

```
siteweb com/
├── index.html            # Page d'Accueil et Portail Officiel de la Commune
├── admin.html            # Panneau de Contrôle d'Administration (SaaS Dashboard)
├── style.css             # Design System & Tokens Thématiques (Navy & Gold)
├── db.js                 # Moteur de Persistance Locale (LocalStorage Database)
├── app.js                # Interactions Générales & Gestionnaires d'Événements
├── js/                   # Architecture Logicielle MVC (Model-View-Controller)
│   ├── models/           # Models (News, Projects, Complaints, Branding, Services...)
│   ├── views/            # Views (AdminView, EventView, NewsView...)
│   └── controllers/      # Controllers (MainController, AdminController)
└── assets/               # Imagerie Haute Résolution, Logos & Actes Officiels
```

---

*Développé selon des normes d'excellence pour la transformation numérique et la modernisation des services publics des Collectivités Territoriales du Royaume du Maroc.* 🇲🇦✨
