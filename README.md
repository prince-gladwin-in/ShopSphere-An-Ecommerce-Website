# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

# ShopSphere

ShopSphere is a responsive React e-commerce website for discovering, comparing, and purchasing everyday products. The storefront is powered by the included Amazon product dataset and is designed to remain clear and usable across phones, tablets, laptops, desktops, and large screens.

## Features

- Product browsing with search, category filtering, rating filters, price range filtering, and sorting
- Responsive product grids with reusable product cards
- Product detail pages with image galleries, pricing, ratings, stock information, related products, and quantity controls
- Shopping cart with quantity updates, discounts, delivery calculation, and order summary
- Wishlist with add-to-cart and remove actions
- Light and dark themes
- Responsive navigation with mobile search, category scrolling, and touch-friendly controls
- Loading, empty, and error states for a smoother shopping experience
- Client-side routing and lazy-loaded page routes

## Tech Stack

- React 19
- Vite
npm run preview
```

## Project Structure

- `src/components` contains shared UI components such as the navbar, product cards, footer, and state views.
- `src/pages` contains the home, products, product details, cart, wishlist, about, and not-found pages.
- `src/context` contains cart, wishlist, theme, and toast state providers.
- `src/services/productApi.js` provides product and category access through the included dataset.
