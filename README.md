# NomNom_Frontend

A modern web application for browsing, searching, and rating recipes. Built with **React**, **TypeScript**, and **Tailwind CSS**.

## Features

- Search & filter recipes by category, ingredients, or keywords
- Firebase Authentication (Google, Email/Password, etc.)
- Rating & reviews system with authentication
- Add your own recipes (if applicable)
- Responsive UI for mobile and desktop
- Fast development with MirageJS mock API

---

## Tech Stack

- [React](https://reactjs.org/) – UI library
- [TypeScript](https://www.typescriptlang.org/) – Type safety
- [Tailwind CSS](https://tailwindcss.com/) – Styling
- [React Router](https://reactrouter.com/) – Navigation
- [MirageJS](https://miragejs.com/) – Mock API for development
- [Firebase Authentication](https://firebase.google.com/docs/auth) – Auth provider
- [Context API](https://react.dev/reference/react/useContext) – Global state management
- [Vercel](https://vercel.com/) – Deployment platform

---

## Demo

[Live Demo on Vercel](https://nomnom-nab.vercel.app/)

## Project setup

```
git clone https://github.com/NomNomNAB/NomNom_frontend.git
cd NomNom_frontend
```

### Install dependencies

`npm install`

### Firebase Setup

1. **Local Development**

- Go to Firebase Console and create a new project.
- Enable Authentication → choose providers (Google, Email/Password, etc.).
- Add a new Web App and copy the Firebase config.
- Create a .env file in the root project:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

- Initialize Firebase in your project (e.g. src/firebase.ts):

```
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Deployment on Vercel

- Go to your project on Vercel Dashboard
- Navigate to: Settings → Environment Variables.
- Add the same Firebase variables from above.
- Redeploy your project so the new environment variables are applied.

---

## Running the App

Start development server:

`npm run dev`

## Testing

Run unit tests with Jest + React Testing Library:

`npm test`

## Project Structure

```
src/
├── components/   # Reusable UI components (Button, Card, etc.)
├── pages/        # Main app pages (LandingPage, RecipeList, RecipeDetail)
├── context/      # Global contexts (AuthContext)
├── contexts/     # Theme contexts
├── firebase/     # Firebase config & auth setup
├── hooks/        # Custom React hooks
├── mirage/       # Mock data
├── App.tsx       # Root component
├── app.css       # Global app-level styles
├── index.css     # Tailwind base styles and resets
├── main.tsx      # Entry point, renders <App /> to the DOM
├── types.ts      # TypeScript type definitions
```

## Authentication Flow

- Users sign in with Firebase Auth (Google, Email/Password, etc.).
- Auth state is stored in AuthContext.
- If a user is not signed in, restricted actions (e.g., writing reviews) will show a login prompt.

## Contributing

1. **Fork the repository**
- Click the **Fork** button in the top right corner of this repository.
- This will create a copy of the repository under your GitHub account.

3. **Clone your fork locally**  
```
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```
   
5. **Set up the upstream remote (to keep your fork updated with the original repo)**

```
git remote add upstream https://github.com/<original-owner>/<repo-name>.git
git fetch upstream
```

4. **Create a new branch (always work on a feature branch, not main)**
`git checkout -b feature/amazing-feature`

5. **Make your changes**

- Implement your feature or bug fix.
- Follow the existing code style and folder structure.
- Add tests if applicable.

6. **Commit your changes**

```
git add .
git commit -m "Add amazing feature: short but descriptive message"
```

7. **Push to your fork**

`git push origin feature/amazing-feature`

8. **Open a Pull Request (PR)**

- Go to the original repository on GitHub.
- Click Compare & pull request.
- Provide a clear description of your changes and why they are useful.

## Credits

Contributors: Hong Nhung, Ngoc Khanh, Tam Nhu, Khanh Tran.

## Internationalization

English supported.

## License

This project is licensed under the MIT License.
