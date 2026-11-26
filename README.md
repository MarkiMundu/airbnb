# Airbnbin

A React/Vite frontend with an Express/MongoDB backend.

## Local setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in MongoDB, JWT and Cloudinary credentials
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_SERVER_URL to the backend URL
npm run dev
```

## Render deployment

**Backend service**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add `MONGODB_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NODE_ENV=production`, and `CLIENT_URL=https://airbnbin.onrender.com`.

**Frontend static site**
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Add `VITE_SERVER_URL=https://airbnbin-backend.onrender.com` and redeploy after changing it.

If your Render frontend URL differs, set that exact origin in backend `CLIENT_URL`. For multiple origins, separate them with commas. The frontend and backend must both use HTTPS in production because authentication uses a secure cross-site cookie.

## Notes
- Never commit `.env` files or real credentials.
- Existing listings and users remain in MongoDB; no destructive migration is included.
- Booking is intentionally single-active-booking-per-listing in this version.
