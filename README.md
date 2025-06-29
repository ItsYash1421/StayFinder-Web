//Frontend was used fo Vercel hosting.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
=======
# StayFinder

Your trusted platform for finding the perfect stay, anywhere in the world.

---

## Project Overview
StayFinder is a modern web application for booking and hosting unique accommodations. It connects travelers with comfortable stays and provides hosts with a reliable platform to share their spaces.

**Features:**
- Browse and search listings with filters and map view
- User authentication (guests & hosts)
- Profile management with avatar upload
- Booking management (create, view, cancel)
- Host dashboard for managing listings
- Responsive, modern UI with themed policy pages
- Secure payments and verified hosts

---

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Leaflet, Framer Motion
- **Backend:** Node.js, Express, MongoDB, Mongoose, Cloudinary, Multer, JWT
- **Deployment:** Vercel (frontend), Render (backend)

---

## Local Development

### Prerequisites
- Node.js & npm
- MongoDB (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/stayfinder.git
cd stayfinder
```

### 2. Setup Backend
```bash
cd backend
npm install
# Create a .env file with your MongoDB URI, JWT secret, Cloudinary keys, etc.
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:5000` by default.

---

## Deployment

### Frontend on Vercel
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and import your repo.
3. Set the root directory to `/frontend`.
4. Add environment variables (e.g., `VITE_API_URL` pointing to your backend on Render).
5. Deploy!

### Backend on Render
1. Push your backend code to GitHub.
2. Go to [Render](https://render.com/) and create a new Web Service.
3. Connect your repo, set build/start commands (`npm install` / `npm start`).
4. Add environment variables (MongoDB URI, JWT secret, etc.).
5. Deploy!

---

## License
MIT

---

## About
StayFinder was created to make travel accommodation more accessible and enjoyable for everyone. For more, see the [About page](frontend/src/pages/About.tsx). 
>>>>>>> 0cc5751876403b81abbaaf39de11d5862b05a093
