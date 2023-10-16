# API 

## Instalación
```bash
firebase init functions
```

## Configuración

```
Seleccionar el proyecto existente de preferencia
Seleccionar el lenguaje de programación (Typescript)
Seleccionar las opciones de ESLint y Prettier(En este caso no se selecciono)(Se trabajo con un linter personalizado)
```

## Librerias adicionales

```bash
cd functions
npm i --save-dev express
npm i --save-dev body-parser
npm i --save-dev cors
```

## Ejecución

```bash
cd functions
npm run serve //Para ejecutar el proyecto de forma local
npm run deploy //Para desplegar el proyecto en la nube

```