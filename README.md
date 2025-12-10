<p align="center">
    <picture>
        <img src="./docs/images/logo.png" width=450px>
    </picture>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Made%20with-NestJS-red.svg">
    <img src="https://img.shields.io/badge/Database-PostgreSQL-blue.svg">
    <img src="https://img.shields.io/badge/Auth-Better--Auth-orange.svg">
    <img src="https://img.shields.io/badge/License-Proprietary-green.svg">
</p>

---
# AutoVisionTech – Backend

AutoVisionTech-backend est l'API officielle du projet **AutoVisionTech**, une plateforme de gestion de location et vente de voitures permettant aux agents de publier des véhicules, gérer les réservations, et aux utilisateurs de consulter, filtrer et réserver des voitures.

Ce backend a été développé avec **NestJS**, **TypeORM**, **Better-Auth** et une architecture modulaire évolutive. Il expose des endpoints REST sécurisés, gère l'upload d'images, l'authentification par rôles, ainsi que des opérations CRUD complètes.

---

## Fonctionnalités principales

- Authentification & Autorisation (Better-Auth)
- Gestion des utilisateurs (User) avec rôles (admin/agent)
- Gestion des voitures (Car) avec statuts (available/reserved/sold)
- Gestion des réservations (Reservation) avec statuts multiples
- Gestion des commentaires (Comment) sur les voitures
- Upload d'images multiples (jusqu'à 5 par voiture)
- Système de permissions basé sur les rôles
- Filtrage dynamique et pagination
- Activation/désactivation des comptes utilisateurs
- Architecture modulaire et extensible

---

## Documentation

- **Structure du projet** → [`docs/STRUCTURE.md`](docs/STRUCTURE.md)
- **Technologies utilisées** → [`docs/TECHNOLOGIES.md`](docs/TECHNOLOGIES.md)
- **Requêtes API** → [`docs/API_REQUESTS.md`](docs/API_REQUESTS.md)

---

## Installation & lancement

### 1) Cloner le dépôt
```bash
git clone https://github.com/votre-repo/AutoVisionTech-backend
```

### 2) Se déplacer dans le dossier
```bash
cd AutoVisionTech-backend
```

### 3) Installer les dépendances
```bash
npm install
```

### 4) Générer la configuration Better-Auth
```bash
npx @better-auth/cli generate
```

### 5) Appliquer les migrations Better-Auth
```bash
npx @better-auth/cli migrate
```

### 6) Lancer en développement
```bash
npm run start:dev
```

---

## Configuration des variables d'environnement

Pour que l'application fonctionne correctement, vous devez créer un fichier `.env` à la racine du projet.  
Ce fichier contient toutes les informations nécessaires au fonctionnement :

- connexion à la base de données  
- configuration de l'application  
- paramètres de Better Auth  
- URL du serveur  
- paramètres de Multer  

Voici un exemple complet de configuration :

```env
# Database configuration
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=autovisiontech

# URL complète utilisée par Better Auth et TypeORM
DATABASE_URL=postgres://postgres:your_password@localhost:5432/autovisiontech

# Application configuration
NODE_ENV=development
PORT=3000

# Better Auth configuration
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000

# Multer configuration
MULTER_BASE_URL=http://localhost:3000
```

---

## Modèle de données

### Entités principales

- **User**: Utilisateurs du système (admin/agent)
- **Car**: Voitures disponibles à la location/vente
- **Reservation**: Réservations de véhicules par les clients
- **Comment**: Commentaires sur les véhicules

### Relations

- Un utilisateur (agent) peut créer plusieurs voitures
- Une voiture peut avoir plusieurs réservations
- Une voiture peut avoir plusieurs commentaires
- Les réservations sont liées à une voiture et contiennent les informations client

---

## Système de permissions

### Rôles disponibles

**Agent**:
- Créer, modifier, supprimer des voitures
- Voir et gérer les réservations
- Mettre à jour le statut des réservations

**Admin**:
- Toutes les permissions des agents
- Gérer les utilisateurs (création, activation/désactivation)
- Supprimer n'importe quel commentaire
- Changer les rôles des utilisateurs
- Accès complet à toutes les fonctionnalités

### Permissions spécifiques

```typescript
enum Permission {
  // Car management
  CREATE_CAR,
  UPDATE_CAR,
  DELETE_CAR,
  
  // Comment management
  MANAGE_COMMENTS,
  DELETE_ANY_COMMENT,
  
  // Reservation management
  MANAGE_RESERVATIONS,
  UPDATE_RESERVATION_STATUS,
  
  // User management
  USERS_VIEW,
  USERS_UPDATE,
  USERS_DELETE,
  ADMIN_USER_CREATE,
  ADMIN_USER_ACTIVATE,
  ADMIN_USER_DEACTIVATE,
  UPDATE_USER_ROLE
}
```

---

## Endpoints principaux

### Authentication
- `POST /api/auth/sign-up/email` - Inscription
- `POST /api/auth/sign-in/email` - Connexion
- `POST /api/auth/sign-out` - Déconnexion
- `GET /api/auth/get-session` - Obtenir la session

### Cars
- `GET /cars` - Liste des voitures (public, filtrable)
- `GET /cars/:id` - Détails d'une voiture
- `POST /cars` - Créer une voiture (agent)
- `PATCH /cars/:id` - Modifier une voiture (agent)
- `DELETE /cars/:id` - Supprimer une voiture (agent)

### Reservations
- `GET /reservations` - Liste des réservations (agent)
- `POST /reservations/:carId` - Créer une réservation (public)
- `PATCH /reservations/:id` - Modifier une réservation (agent)
- `DELETE /reservations/:id` - Supprimer une réservation (agent)

### Comments
- `GET /comments/car/:carId` - Commentaires d'une voiture
- `POST /comments` - Créer un commentaire (public)

### Users
- `GET /users` - Liste des utilisateurs (admin)
- `POST /users/admin` - Créer un admin (admin)
- `PATCH /users/isActive/:id` - Activer/désactiver (admin)
- `PATCH /users/role/:id` - Changer le rôle (admin)

---

## Exemples d'utilisation

### Créer une voiture avec images

```bash
curl -X POST "http://localhost:3000/cars" \
-b cookies.txt \
-F "brand=Toyota" \
-F "model=Corolla" \
-F "year=2024" \
-F "price=25000" \
-F "kilometerAge=0" \
-F "status=available" \
-F "condition=new" \
-F "images=@/path/to/image1.jpg" \
-F "images=@/path/to/image2.jpg"
```

### Filtrer les voitures

```bash
curl -X GET "http://localhost:3000/cars?brand=Toyota&minPrice=20000&maxPrice=30000&sortByPrice=asc"
```

### Créer une réservation

```bash
curl -X POST "http://localhost:3000/reservations/:carId" \
-H "Content-Type: application/json" \
-d '{
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "clientPhone": "12345678",
  "visitDate": "2025-01-15",
  "visitTime": "14:00"
}'
```

---

## Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture de tests
npm run test:cov
```

---

## Licence

Ce projet est sous licence MIT.

---

## Contributeurs

Développé dans le cadre d'un projet académique au cycle d'ingenieur IGL3.
