# Twitter Mimic <img src="https://github.com/user-attachments/assets/21a84884-bd48-4bb1-89a4-12d480b652d0" alt="Twitter Mimic Logo" width="50" height="50" />
<br>

Twitter Mimic es una aplicación desarrollada en Next.js inspirada en las funcionalidades básicas de Twitter, empezado como parte del curso de Next.js y Firebase de Midudev. Permite a los usuarios registrarse con Google o GitHub, ver el feed de tweets, interactuar con publicaciones, y realizar búsquedas y filtrados avanzados. La app está construida con TypeScript, CSS Modules, Tailwind CSS y Firebase para autenticación, almacenamiento de imágenes y base de datos en tiempo real.

> [!NOTE]
> Una vez hecho el registro, se almacena el **nombre de usuario**, **email** y **foto de perfil** según se haya iniciado sesión con Google o Github.


## 🚀 Características

- **Inicio de Sesión** con Google y GitHub.
- **Feed de Tweets** con scroll infinito.
- **Interacciones** de usuario: dar like, comentar, retwittear.
- **Creación, Edición y Eliminación** de tweets y comentarios propios.
- **Búsqueda y Filtrado** por usuario, tweets recientes y "top" por cantidad de likes.
- **Generación Estática (SSG)** para tweets individuales.
- **Actualización en Tiempo Real** en toda la app.
- **Firebase Storage** para almacenamiento de imágenes.

## 🛠️ Tecnologías Utilizadas

- **Framework:** Next.js
- **Lenguaje:** TypeScript
- **Estilos:** CSS Modules y Tailwind CSS
- **Autenticación y Base de Datos:** Firebase
- **Almacenamiento de Imágenes:** Firebase Storage
- **Testing:** Jest (unitario e integración), Playwright (end-to-end)
- **Linter:** ESLint

## 📚 Instalación y Configuración

Sigue estos pasos para instalar y ejecutar el proyecto en tu entorno local.

### 1. Clonar el repositorio

````
git clone https://github.com/jigcolapaolo/twitter-mimic.git
````

### 2. Instalar dependencias

```
npm install
````

### 3. Configurar variables de entorno

La aplicación requiere tanto una clave pública para acceder a las funcionalidades básicas como una clave privada de admin para algunas operaciones específicas, como la generación de tweets individuales con SSG.

> [!IMPORTANT]
> La clave privada no está incluida en el repositorio, y su ausencia limita el acceso a ciertas funcionalidades.

### 4. Ejecutar la aplicación

Para ejecutar el proyecto en modo desarrollo:

````
pnpm run dev
````

Para construir y ejecutar en modo producción:

````
pnpm build
pnpm start
````

## 🧪 Tests

La app incluye tests unitarios, de integración y de extremo a extremo (E2E) con configuraciones específicas para Jest y Playwright.

### Ejecutar Tests Unitarios e Integración con Jest

- **Unitarios e integración**: Puedes ejecutar todos los tests con:
````
pnpm testAll
````

### Ejecutar Tests E2E con Playwright

Los tests E2E requieren una configuración inicial para el login automático.

1. Ejecuta login.setup.ts para crear el estado de autenticación antes de correr los tests. 

> [!WARNING]
> Ingresa las credenciales login.setup.ts, ejecuta el setup y luego elimínalas del archivo.

2. Usa el siguiente comando para ejecutar todos los tests de Playwright:
````
npx playwright test
````
Opcional con UI:
````
npx playwright test --ui
````

### Ultima prueba de calidad en Google Lighthouse

![Captura de pantalla 2024-10-26 183733](https://github.com/user-attachments/assets/186669dd-4a8f-4441-b56c-5f18cb44f867)



