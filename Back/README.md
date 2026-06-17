# Restaurante Proyecto - Web 3

Proyecto final de Ingeniería en Informática. Sistema de gestión para restaurante desarrollado con Node.js, Express, Sequelize y MySQL.

## 🚀 Tecnologías
- **Backend:** Node.js, Express, Sequelize ORM, JWT, MySQL.
- **Frontend:** [Menciona aquí tu tecnología: ej: React, Vue, etc.]
- **Testing:** Postman.

## 📋 Requisitos Previos
- Node.js (v20 o superior recomendado)
- MySQL Server

## Estrategia de Almacenamiento de Tokens (Auth)

Para la gestión de sesiones en el frontend, se ha elegido implementar **localStorage**.

**Justificación de la elección:**
* **Simplicidad y Rapidez:** Permite una integración rápida y nativa con el framework del frontend (Vue/Nuxt) usando la API nativa del navegador, facilitando la inyección del token en los headers (`Authorization: Bearer <token>`) para las peticiones a rutas protegidas.
* **Consideraciones de Seguridad:** Se tiene en conocimiento que `localStorage` presenta un riesgo inherente de ataques XSS (Cross-Site Scripting). Para mitigar esto en un entorno de producción real, se deben sanear estrictamente los inputs del usuario (como ya se hace en el backend con `express-validator`) y evitar la ejecución de scripts de terceros no confiables en el cliente.


## ⚙️ Configuración (Instalación)

1. **Clonar el repositorio:**
   ```bash
   git clone [tu-url-de-github]
   cd [nombre-de-tu-carpeta]