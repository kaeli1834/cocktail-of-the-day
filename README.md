# 🍸 Cocktail of the Day

Une application web complète pour découvrir des cocktails avec deux fonctionnalités principales :

- **Cocktail du jour** : Un cocktail différent chaque jour basé sur la date
- **Roulette de cocktails** : Sélection aléatoire selon vos préférences d'alcool

## 📋 Table des matières

- [🎯 Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies utilisées](#️-technologies-utilisées)
- [📁 Structure du projet](#-structure-du-projet)
- [🚀 Installation et démarrage](#-installation-et-démarrage)
- [🐳 Déploiement avec Docker](#-déploiement-avec-docker)
- [📡 API](#-api)
- [🌐 Frontend](#-frontend)
- [🔧 Configuration](#-configuration)
- [📸 Captures d'écran](#-captures-décran)

## 🎯 Fonctionnalités

### 🗓️ Cocktail du jour

- Affiche un cocktail unique basé sur la date actuelle
- Cocktail cohérent : le même cocktail s'affiche pour tous les utilisateurs le même jour
- Interface élégante avec image, ingrédients et instructions
- Design responsive (mobile et desktop)

### 🎰 Roulette de cocktails

- Sélection de types d'alcool (Vodka, Gin, Rum, Tequila, Whiskey, Sans alcool)
- Option "Tous" pour sélectionner/désélectionner tous les types
- Roue interactive animée pour la sélection
- Affichage détaillé du cocktail sélectionné

## 🛠️ Technologies utilisées

### Backend (`cocktail-api/`)

- **Node.js** avec Express.js
- **Axios** pour les requêtes HTTP vers l'API externe
- **CORS** pour les requêtes cross-origin
- **TheCocktailDB API** comme source de données

### Frontend (`cocktail-front/`)

- **React 18** avec TypeScript
- **Vite** comme bundler et serveur de développement
- **Material-UI (MUI)** pour l'interface utilisateur
- **React Router** pour la navigation
- **Axios** pour les requêtes API
- **react-custom-roulette** pour l'animation de la roulette

### DevOps

- **Docker** pour la containerisation
- **Docker Compose** pour l'orchestration
- **Nginx** pour servir le frontend en production
- **Multi-stage builds** pour des images optimisées

## 📁 Structure du projet

```
cocktail-of-the-day/
├── cocktail-api/              # Backend Express.js
│   ├── index.js              # Point d'entrée du serveur
│   ├── package.json          # Dépendances backend
│   ├── package-lock.json
│   ├── Dockerfile            # Image Docker backend
│   └── .dockerignore
│
├── cocktail-front/           # Frontend React + TypeScript
│   ├── public/
│   │   ├── cocktail.ico      # Favicon
│   │   └── vite.svg
│   ├── src/
│   │   ├── Components/       # Composants réutilisables
│   │   │   ├── CocktailCard.tsx     # Affichage d'un cocktail
│   │   │   ├── Navbar.tsx           # Navigation
│   │   │   └── WheelSpinner.tsx     # Roue de sélection
│   │   ├── Pages/            # Pages de l'application
│   │   │   ├── CocktailDayPage.tsx  # Page cocktail du jour
│   │   │   └── SpinPage.tsx         # Page roulette
│   │   ├── Types/
│   │   │   └── Cocktail.tsx         # Types TypeScript
│   │   ├── App.tsx           # Composant principal
│   │   └── main.tsx          # Point d'entrée React
│   ├── package.json          # Dépendances frontend
│   ├── vite.config.ts        # Configuration Vite
│   ├── Dockerfile            # Image Docker production
│   ├── Dockerfile.dev        # Image Docker développement
│   ├── nginx.conf            # Configuration Nginx
│   └── .dockerignore
│
├── docker-compose.yml        # Orchestration production
├── docker-compose.dev.yml    # Orchestration développement
├── .dockerignore             # Fichiers ignorés par Docker
└── README.md                 # Ce fichier
```

## 🚀 Installation et démarrage

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/cocktail-of-the-day.git
cd cocktail-of-the-day
```

### 2. Installation du backend

```bash
cd cocktail-api
npm install
```

### 3. Installation du frontend

```bash
cd ../cocktail-front
npm install
```

### 4. Configuration des variables d'environnement

Créez un fichier `.env` dans le dossier `cocktail-front/` :

```env
VITE_API_URL=http://localhost:3000
```

### 5. Démarrage des services

#### Backend (Terminal 1)

```bash
cd cocktail-api
node index.js
# Le serveur démarre sur http://localhost:3000
```

#### Frontend (Terminal 2)

```bash
cd cocktail-front
npm run dev
# L'application s'ouvre sur http://localhost:5173
```

## 🐳 Déploiement avec Docker

### Prérequis Docker

- Docker (version 20.10 ou supérieure)
- Docker Compose (version 2.0 ou supérieure)

### 🚀 Démarrage rapide avec Docker

#### Production (recommandé)

```bash
# Cloner le projet
git clone https://github.com/kaeli1834/cocktail-of-the-day.git
cd cocktail-of-the-day

# Démarrer l'application complète
docker-compose up -d

# L'application sera disponible sur :
# - Frontend: http://localhost:8080
# - API: http://localhost:3000
```

#### Développement avec hot-reload

```bash
# Démarrer en mode développement
docker-compose -f docker-compose.dev.yml up

# L'application sera disponible sur :
# - Frontend: http://localhost:5173 (hot-reload activé)
# - API: http://localhost:3000 (redémarrage automatique)
```

### 🏗️ Commandes Docker utiles

#### Gestion des containers

```bash
# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Rebuild les images
docker-compose build --no-cache

# Voir les containers en cours
docker-compose ps
```

#### Nettoyage

```bash
# Supprimer les volumes et containers
docker-compose down -v

# Nettoyer les images non utilisées
docker image prune -f

# Nettoyage complet
docker system prune -af
```

### 🔧 Configuration Docker

#### Variables d'environnement

Créez un fichier `.env` à la racine du projet pour personnaliser :

```env
# Ports
API_PORT=3000
FRONTEND_PORT=8080

# Environnement
NODE_ENV=production

# API URL pour le frontend
VITE_API_URL=http://localhost:3000
```

#### Optimisations de performance

- **Multi-stage builds** : Images optimisées pour la production
- **Alpine Linux** : Images légères (~50MB vs ~300MB)
- **Non-root user** : Sécurité renforcée
- **Health checks** : Surveillance de la santé des containers
- **Resource limits** : Limitation CPU/RAM pour éviter les pics
- **Nginx caching** : Cache statique pour le frontend

#### Structure des Dockerfiles

- `cocktail-api/Dockerfile` : Backend Node.js optimisé
- `cocktail-front/Dockerfile` : Build React + Nginx pour production
- `cocktail-front/Dockerfile.dev` : Développement avec hot-reload

## 📡 API

### Backend (Port 3000)

#### `GET /api/daily-cocktail`

Retourne le cocktail du jour basé sur la date actuelle.

**Réponse :**

```json
{
  "name": "Margarita",
  "image": "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
  "instructions": "Rub the rim of the glass with the lime slice...",
  "ingredients": [
    "1 1/2 oz Tequila",
    "1/2 oz Triple sec",
    "1 oz Lime juice",
    "Salt"
  ]
}
```

### API externe utilisée

- **TheCocktailDB** : `https://www.thecocktaildb.com/api/json/v1/1/`
  - Liste des cocktails alcoolisés : `filter.php?a=Alcoholic`
  - Détails d'un cocktail : `lookup.php?i={id}`
  - Cocktails par ingrédient : `filter.php?i={ingredient}`

## 🌐 Frontend

### Pages disponibles

- `/` : Page d'accueil avec le cocktail du jour
- `/spin` : Page roulette pour sélectionner un cocktail

### Composants principaux

- **CocktailCard** : Affichage stylisé d'un cocktail avec image, ingrédients et instructions
- **WheelSpinner** : Roue interactive pour la sélection aléatoire
- **Navbar** : Navigation entre les pages

### Thème

- **Mode sombre** avec palette violette/rose
- **Design responsive** adaptatif mobile/desktop
- **Animations** et transitions fluides

## 🔧 Configuration

### Scripts disponibles

#### Backend (`cocktail-api/`)

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

#### Frontend (`cocktail-front/`)

```json
{
  "scripts": {
    "dev": "vite", // Serveur de développement
    "build": "tsc -b && vite build", // Build de production
    "lint": "eslint .", // Vérification du code
    "preview": "vite preview" // Aperçu du build
  }
}
```

### Variables d'environnement

- `VITE_API_URL` : URL de base de l'API backend (défaut: `http://localhost:3000`)
- `PORT` : Port du serveur backend (défaut: `3000`)

## 📸 Captures d'écran

### Page Cocktail du jour

Interface élégante affichant le cocktail quotidien avec tous ses détails.

### Page Roulette

Interface interactive permettant de sélectionner les types d'alcool et de faire tourner la roue pour découvrir un nouveau cocktail.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou proposer une pull request.

## 📄 Licence

Ce projet est sous licence ISC.
