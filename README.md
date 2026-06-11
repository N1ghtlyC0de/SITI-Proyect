# SITI - Sistema de Información Informal

SITI es una aplicación web moderna diseñada para la gestión de ventas, inventario en tiempo real, validación de caja y seguimiento de turnos. Construida con tecnologías modernas para ofrecer una experiencia rápida, responsiva y accesible.

## Características Principales

- **Dashboard de Ventas**: Visualización en tiempo real de métricas clave (ingresos, costos, utilidades), gráficas de ventas por hora y desglose de métodos de pago.
- **Inventario en Tiempo Real**: Gestión de productos, seguimiento de stock crítico, alertas de agotamiento y filtros avanzados.
- **Validador de Caja**: Flujo de cierre de caja y validación de efectivo físico vs. esperado en sistema (soportando moneda local COP).
- **Control de Turnos**: Gestión de apertura y cierre de turnos de vendedores, con historial detallado de transacciones.
- **Accesibilidad (a11y)**: Diseño de alto contraste que cumple con las normativas WCAG, optimizado para lectores de pantalla y navegación por teclado.

## Tecnologías Utilizadas

- **Frontend**: React (con TypeScript)
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS
- **Gráficos**: Recharts
- **Iconografía**: Lucide React
- **Componentes UI**: Componentes a medida siguiendo la metodología atómica (Molecules/Atoms).

## Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).

## Instalación y Ejecución Local

1. Clona el repositorio e instala las dependencias:

```bash
npm install
```

2. Inicia el servidor de desarrollo local:

```bash
npm run dev
```

La aplicación estará disponible típicamente en `http://localhost:5173`.

## Construcción para Producción

Para compilar la aplicación para producción, ejecuta:

```bash
npm run build
```

Los archivos optimizados y listos para despliegue se generarán en la carpeta `dist/`.

## Notas de Desarrollo

- Los íconos y componentes de estado (como los "Status Badges") están estandarizados para mantener una interfaz limpia y accesible en todos los módulos de la aplicación.
- Se utiliza la internacionalización de la API de JavaScript (`Intl.NumberFormat`) para el correcto formateo de la moneda colombiana (COP).
