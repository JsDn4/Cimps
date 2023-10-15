# Creación de chatbot con TS y NodeJS

## Descripción

En este proyecto se hace la integración de un chatbot enfocado a las reservaciones de un restaurante
por medio de Dialogflow y Typescript y Firebase.
De modo que se trabajo con la segunda generación de las funciones en la nube de Firebase. 

## Instalación
```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

## Configuración

```
Seleccionar el proyecto existente de preferencia
Seleccionar el lenguaje de programación (Typescript)
Seleccionar las opciones de ESLint y Prettier(En este caso no se selecciono)(Se trabajo con un linter personalizado)
```

## Ejecución

```bash
cd functions
npm run serve //Para ejecutar el proyecto de forma local
npm run deploy //Para desplegar el proyecto en la nube

```
