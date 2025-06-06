# RSM Dev. Eco - Gestionnaire de Programmes

Une application web pour gérer les programmes de développement économique.

## Fonctionnalités

- Authentification des utilisateurs
- Gestion des programmes de développement
- Suivi des projets
- Tableaux de bord et statistiques
- Import/Export de données

## Technologies utilisées

- Frontend : React, TypeScript, TailwindCSS
- Backend : Node.js, Express, SQLite
- ORM : Drizzle
- Authentication : Passport.js

## Installation

1. Clonez le repository :
```bash
git clone https://github.com/votre-username/ProgramTracker.git
cd ProgramTracker
```

2. Installez les dépendances :
```bash
npm install
```

3. Initialisez la base de données :
```bash
npx tsx server/initDb.ts
```

4. Créez l'utilisateur admin :
```bash
npx tsx server/createAdmin.ts
```

5. Démarrez l'application :
```bash
npm run dev
```

L'application sera accessible à l'adresse : http://localhost:5000

## Connexion

Utilisez les identifiants suivants pour vous connecter :
- Nom d'utilisateur : `admin`
- Mot de passe : `admin`

## Structure du projet

- `/client` - Code source du frontend React
- `/server` - Code source du backend Node.js
- `/shared` - Types et schémas partagés
- `/public` - Ressources statiques

## Scripts disponibles

- `npm run dev` - Lance l'application en mode développement
- `npm run build` - Compile l'application pour la production
- `npm start` - Lance l'application en mode production

## Licence

MIT 