# Shared Hosting Deployment Guide (Merged Server)

This guide explains how to deploy your **Next.js Frontend** and **Express Backend** as a single application on **oxpecker.pro.bd**.

## 1. Prepare Local Files

Run these commands on your computer:

```powershell
# Build Backend
cd backend
npm install
npm run build

# Build Frontend
cd ../frontend
npm install
npm run build
```

## 2. Prepare the Upload Zip

Create a folder named `deployment_package`.

1. **Copy Backend Build**: Copy the `backend/dist` folder and `backend/package.json` into `deployment_package/backend/`.
2. **Copy Frontend Standalone**: 
   - Copy `frontend/.next/standalone` contents into `deployment_package/`.
   - Copy `frontend/.next/standalone/.next` folder into `deployment_package/.next/` (if not already there).
   - Copy `frontend/public` into `deployment_package/public/`.
   - Copy `frontend/.next/static` into `deployment_package/.next/static/`.
3. **Add Entry Point**: Ensure `deployment_package/server.js` is the one we updated.
4. **Environment**: Add a `.env` file in `deployment_package/` with your backend variables (DB_URL, etc.).

**Zip everything inside `deployment_package` into `deploy.zip`.**

## 3. Upload to MetroVPS

1. **Clean Up**: In File Manager for `oxpecker.pro.bd`, delete any old `backend` or `api.oxpecker.pro.bd` folders.
2. **Upload**: Upload `deploy.zip` into the root folder of **`oxpecker.pro.bd`**.
3. **Extract**: Right-click `deploy.zip` -> **Extract**.

## 4. Configure Node.js App

On the MetroVPS panel for **`oxpecker.pro.bd`**:

* **Startup command**: `node server.js`
* **Node version**: `22.22.0`
* **Proxy enabled**: **ON** (Port `3000`)
* **Deploy/Restart app**.

## 5. Verification

1. Visit `https://oxpecker.pro.bd` -> Website loads.
2. Visit `https://oxpecker.pro.bd/api/auth/profile` (or any valid API route) -> API responds.
