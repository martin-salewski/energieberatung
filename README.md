# Getting started

```bash
npm install
```

```bash
npm run dev
```

## Shadcn/ui Components installieren

Components auf https://ui.shadcn.com/docs/components/ aussuchen und dann jeweils mit

```bash
npx shadcn-ui@latest add $componentName
```

herunterladen (z.B. `$componentName` = `accordion`).

## Tailwind Docu

Z.B. https://tailwindcss.com/docs/gap.

### weitere schicke Componenten zum inspirieren lassen

- https://flowbite.com/docs/forms/number-input/#currency-input
- https://mambaui.com/components/input
- https://tailwindui.com/components/preview#component-2607d970262ada86428f063c72b1e7bd


## React Docu

Die Einzelnen Punkte geben einen ganz guten Einblick wie React aufgebaut ist.
https://react.dev/learn/updating-arrays-in-state

## React Router

https://reactrouter.com/en/6.26.0/routers/create-browser-router

## 3D

### React Three Fiber

https://docs.pmnd.rs/react-three-fiber/getting-started/introduction

Alle Elemente, die nicht in Three Fiber erklärt sind, sing wahrscheinlich direkt bei der Three.js Dokumentation erklärt (https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene), oder sind Helfer aus `React Three drei`.

### React Three drei

https://github.com/pmndrs/drei

Coole Beispiele:

- Lamborghini mit Cubemap https://codesandbox.io/s/e662p3
- Lanyard mit Badge: https://codesandbox.io/s/w2ysdl

evtl wichtig fürs spätere Routing: https://codesandbox.io/s/4j2q2
___

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

-   Configure the top-level `parserOptions` property like this:

```js
export default {
    // other rules...
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: __dirname,
    },
};
```

-   Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
-   Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
-   Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
