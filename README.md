# API du port de plaisance Russel

Application Express et API REST permettant à la capitainerie de gérer
les catways, les réservations et les utilisateurs.

## Application en ligne

https://russell-api-3dxq.onrender.com

## Fonctionnalités

- Authentification sécurisée avec JWT
- Hachage des mots de passe avec bcrypt
- Gestion CRUD des catways
- Gestion CRUD des réservations
- Gestion CRUD des utilisateurs
- Tableau de bord sécurisé
- Documentation de l’API
- Interface responsive avec EJS
- Validation des données
- Base de données MongoDB Atlas

## Technologies utilisées

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- EJS
- JSON Web Token
- bcrypt

## Installation

Cloner le dépôt :

```bash
git clone https://github.com/Sandra-Lng/russell-api.git
cd russell-api
```

Installer les dépendances :

```bash
npm install
```

Créer un fichier `.env` à la racine du projet :

```env
URL_MONGO=chaine_de_connexion_mongodb
SECRET_KEY=cle_secrete_jwt
```

Démarrer l’application :

```bash
npm start
```

L’application locale est accessible sur :

```text
http://localhost:3000
```

## Documentation

La documentation complète de l’API est disponible sur :

https://russell-api-3dxq.onrender.com/api-docs

## Routes principales

### Authentification

- `POST /login`
- `GET /logout`

### Catways

- `GET /catways`
- `GET /catways/:id`
- `POST /catways`
- `PUT /catways/:id`
- `DELETE /catways/:id`

### Réservations

- `GET /catways/:id/reservations`
- `GET /catways/:id/reservations/:idReservation`
- `POST /catways/:id/reservations`
- `PUT /catways/:id/reservations/:idReservation`
- `DELETE /catways/:id/reservations/:idReservation`

### Utilisateurs

- `GET /users`
- `GET /users/:email`
- `POST /users`
- `PUT /users/:email`
- `DELETE /users/:email`

## Sécurité

Les routes de gestion sont protégées par un token JWT.

Les mots de passe sont hachés avec bcrypt avant leur enregistrement.
Les informations sensibles sont stockées dans des variables
d’environnement et ne sont pas publiées sur GitHub.

Les identifiants du compte d’évaluation sont transmis séparément avec
le livrable.