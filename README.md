# ToyoXpress v1 - Sistema de Gestión y Facturación (Legacy)

### **Mi Transición hacia el Desarrollo Moderno (React & SPA)**

Este repositorio contiene la primera versión del ecosistema **ToyoXpress**, un sistema integral para la gestión de inventario, usuarios y facturación en sucursales físicas. Construido con **React (Create React App)**, este proyecto marca un hito importante en mi carrera: mi evolución desde la manipulación directa del DOM (Vanilla JS/jQuery) hacia la arquitectura de componentes y el manejo de estados complejos.

*(Nota: Este proyecto es la base arquitectónica que posteriormente evolucionó hacia la versión actual y escalable en Next.js y AWS).*

---

## 🚀 Retos de Ingeniería y Soluciones Aplicadas

El salto hacia Single Page Applications (SPA) trajo consigo nuevos desafíos de ingeniería, enfocados principalmente en la experiencia de usuario y la persistencia de datos en el cliente:

* **Arquitectura Orientada a Componentes:** Migración de vistas monolíticas HTML a componentes modulares y reutilizables en React (`<VentaPartes />`, `<ExcelReader />`, `<ActModal />`), facilitando el mantenimiento y la escalabilidad del código.
* **Procesamiento de Archivos en el Cliente (Heavy Lifting):** Implementación del componente `ExcelReader` para procesar y parsear hojas de cálculo voluminosas directamente en el navegador de forma síncrona. Esto evitó la sobrecarga del servidor en las operaciones de ingesta masiva de inventario.
* **Generación Dinámica de Documentos:** Desarrollo de un motor interno de renderizado de comprobantes de pago (`Pedido.pdf`, `cotizacion.pdf`) integrando tipografías nativas (Roboto) para emitir documentos corporativos listos para impresión en punto de venta.
* **Gestión de Estados Complejos:** Manejo de carritos de compra y sesiones de usuario asíncronas, lidiando con problemas de inmutabilidad de datos y sincronización de vistas.

---

## 🛠️ Stack Tecnológico (v1)

* **Framework Core:** React 18 (Create React App).
* **Enrutamiento:** React Router DOM para navegación fluida sin recargas.
* **Estilos:** CSS Modules y hojas de estilo globales estructuradas por dominio (`home.css`, `moves.css`, `nav.css`).
* **Lógica de Datos y APIs:**
  * Uso extensivo de la API Fetch (`server.js`) para la comunicación REST.
  * Biblioteca `xlsx` para la lectura de documentos tabulares.
  * Autenticación local y control de rutas protegidas (`<Login />`, `<Logout />`).

---

## 📦 Módulos Principales (Funcionalidad)

* **Punto de Venta (POS):** Interfaz para la búsqueda de SKU, cálculo de impuestos, y generación de ventas físicas (`/VentaPartes`).
* **Dashboard de Inventario:** Listado maestro de productos con capacidades CRUD (Crear, Leer, Actualizar, Borrar) y carga masiva mediante archivos Excel (`/Products`).
* **Gestión de Empleados y Horarios:** Sistema integrado para el registro de personal y control de horas de asistencia operativas (`/User`, `/Hour`).
* **Auditoría de Cuentas y Pedidos:** Visualización tabular del historial de movimientos y configuraciones de negocio (`/AccountConfig`, `/Pedidos`).

---

## ⚙️ Configuración y Desarrollo Local

### Requisitos Previos
* Node.js (versión 14+)
* npm o yarn

### Instalación

1. Clonar el repositorio:
```bash
git clone [https://github.com/mdemedina/frontend-toyoexpress.git](https://github.com/mdemedina/frontend-toyoexpress.git)
cd frontend-toyoexpress
```

2. Instalar las dependencias:
```bash
npm install
```

3. Variables de Entorno:
Crea un archivo `.env` en la raíz del proyecto y configura la URL de la API:
```env
REACT_APP_API_URL=http://localhost:3000/api
```

4. Ejecutar el entorno de desarrollo:
```bash
npm start
```
El panel estará disponible en `http://localhost:3000`.

---

## 🏗️ Topología del Proyecto

```text
src/
├── components/           # Vistas principales y Módulos de Negocio
│   ├── Home/             # Dashboard Principal
│   ├── Products/         # Gestión de Inventario
│   ├── VentaPartes/      # Punto de Venta (POS) y Documentos PDF
│   └── User/             # Módulo de Recursos Humanos
├── css/                  # Hojas de estilo organizadas por componente
├── lib/                  # Utilidades globales
│   └── data/server.js    # Cliente HTTP para las peticiones a la API
└── img/                  # Assets gráficos estáticos y plantillas PDF
```
