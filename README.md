# SecureConnect Authentication System

## Overview

SecureConnect is a secure authentication system using JWT tokens for user authentication. It ensures robust security measures, including strong password policies, real-time validation, and seamless user experience.

## Features

- **User Authentication with JWT**
- **Frontend & Backend Validation**
- **Real-Time Form Validation Messages**
- **Password Strength Indicator with Progress Bar**
- **Persistent Authentication Using Local Storage**
- **Sweet Alerts for Important User Notifications**
- **Centralized Authentication Management with Auth Provider**
- **Logout Mechanism**
- **Automatic Re-directions**

## Authentication Flow

1. **Sign Up**

   - Users create an account by providing:
     - A **unique username** (checked on the backend)
     - A **strong password** (validated on both frontend & backend)
     - A **confirm password field** (must match the password)
     - A **password strength indicator** (progress bar showing password strength)
   - Upon successful registration, users can proceed to log in.

2. **Log In**

   - Users log in with their credentials.
   - If authentication is successful:
     - A JWT token is issued and stored in localStorage.
     - The user is redirected to the dashboard.
     - A **personalized greeting** is displayed.

3. **Session Management**

   - The **Auth Provider** restores authentication state by retrieving the JWT token and user data from localStorage.
   - The JWT token is automatically included in every request made via Axios.
   - If a request receives a **401 Unauthorized** response, authentication data is cleared from localStorage.

4. **Logout Mechanism**

   - A **logout button** is available on the dashboard.
   - When clicked, user data is cleared from **localStorage** and **Auth Context**.
   - The user is redirected to **/login**.

## Validation Rules

### Username

- At least **8 characters** long
- Must be **alphanumeric**
- **Uniqueness** is checked on the **backend**

### Password

- Must contain at least **one lowercase letter**
- Must contain at least **one uppercase letter**
- Must contain at least **one special character**
- **Confirm Password** must match the **Password**
- **Password Strength Indicator**: A progress bar provides real-time feedback on password strength.

## API Integration

- **JWT Authentication**

  - Token is stored in **localStorage** after successful authentication.
  - Token is included in **all Axios requests**.
  - If a **401 response** is received, the auth data is cleared.

- **Axios Configuration**

  - Uses an Axios **instance** to handle authentication.
  - Automatically attaches the JWT token to requests.
  - Handles response errors and clears auth state on **401 errors**.

- **Backend API Endpoints**

  - **/auth/register** – User registration.
  - **/auth/login** – User authentication.

## Database Schema

- **UserTable**:
  - `userId`
  - `username`
  - `firstName`
  - `lastName`
  - `password` (stored **encrypted** for security)

## User Experience Enhancements

- **Dashboard Display**: Shows **username, firstName, and lastName**.
- **Real-Time Validation Messages**: Displayed below input fields for instant feedback.
- **Sweet Alerts**: Used for important user notifications such as login failures or successful sign-up.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

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
