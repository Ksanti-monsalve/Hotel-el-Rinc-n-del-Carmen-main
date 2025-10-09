# 🏨 Hotel el Rincón del Carmen - Sistema de Reservas Web

## 📋 Descripción del Proyecto

**Hotel el Rincón del Carmen** es un sistema web completo de gestión de reservas hoteleras desarrollado con tecnologías web modernas. El proyecto simula un hotel boutique que ofrece servicios de hospedaje con un sistema intuitivo para que los clientes puedan consultar disponibilidad, realizar reservas y gestionar sus estadías de manera sencilla y eficiente.

El sistema está diseñado para ser **sencillo, agradable y funcional**, priorizando la experiencia del usuario tanto en dispositivos móviles como de escritorio. Incluye un panel de administración completo para la gestión de habitaciones y reservas.

## ✨ Características Destacadas

### 🎯 **Para Clientes**
- **🏠 Página de Inicio Atractiva**: Landing page con carrusel de habitaciones destacadas, galería de servicios y diseño responsivo
- **🔍 Consulta de Disponibilidad**: Sistema avanzado de búsqueda por fechas, número de huéspedes y filtros
- **📅 Gestión de Reservas**: Proceso completo de reserva con verificación de disponibilidad en tiempo real
- **👤 Sistema de Usuario**: Registro e inicio de sesión seguro con validación de datos
- **📱 Diseño Responsivo**: Optimizado para dispositivos móviles y tablets
- **🎨 Interfaz Moderna**: Animaciones suaves, gradientes y efectos visuales premium

### 🛠️ **Para Administradores**
- **👨‍💼 Panel de Administración**: Gestión completa de habitaciones, precios y servicios
- **📊 Gestión de Reservas**: Visualización, modificación y cancelación de reservas de clientes
- **🏨 Administración de Habitaciones**: Control de disponibilidad, precios por noche y servicios incluidos
- **📈 Reportes**: Seguimiento de reservas y ocupación del hotel

### 🔒 **Seguridad y Validación**
- **🚫 Prevención de Solapamiento**: Sistema que evita reservas duplicadas en las mismas fechas
- **✅ Validación en Tiempo Real**: Verificación de disponibilidad antes de confirmar reservas
- **🔐 Autenticación Segura**: Sistema de roles (Usuario/Administrador) con sesiones persistentes
- **📝 Validación de Formularios**: Verificación de datos de registro y reservas

## 🎯 Objetivo

Desarrollar un sitio web **sencillo, agradable y funcional** que permita al Hotel el Rincón del Carmen:

1. **Atraer más clientes** a través de una presencia web profesional
2. **Facilitar el proceso de reservas** con una interfaz intuitiva y moderna
3. **Gestionar eficientemente** las habitaciones y reservas del hotel
4. **Proporcionar una experiencia móvil** optimizada para la mayoría de usuarios
5. **Automatizar procesos** de consulta de disponibilidad y gestión de reservas

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con Flexbox, Grid, animaciones y diseño responsivo
- **JavaScript ES6+**: Lógica de aplicación, manejo de eventos y APIs modernas

### **Almacenamiento**
- **Local Storage**: Simulación de base de datos para persistencia de datos
- **Session Management**: Gestión de sesiones de usuario y administrador

### **Arquitectura**
- **Web Components**: Componentes reutilizables para modularidad
- **CSS Modular**: Separación de estilos por páginas y componentes
- **JavaScript Modular**: Separación de lógica por funcionalidades

### **Características Técnicas**
- **Responsive Design**: Adaptable a todos los dispositivos
- **Progressive Enhancement**: Funcionalidad básica garantizada en todos los navegadores
- **Performance Optimized**: Carga rápida y animaciones fluidas
- **Código Optimizado**: Proyecto simplificado sin archivos innecesarios

## 🔑 Credenciales de Administrador

### **Acceso al Panel de Administración**
```
📧 Email: admin@hotel.com
🔐 Contraseña: admin123
```


```

> **Nota**: El usuario administrador se crea automáticamente al cargar la aplicación por primera vez.

## 🏗️ Estructura del Sistema

```
Hotel-el-Rinc-n-del-Carmen-main/
├── 📁 css/                          # Estilos CSS modulares (8 archivos)
│   ├── common.css                   # Estilos comunes (header, footer, botones)
│   ├── index.css                    # Estilos específicos del index
│   ├── disponibilidad.css           # Estilos de la página de disponibilidad
│   ├── ubicacion.css                # Estilos de la página de ubicación
│   ├── login.css                    # Estilos del formulario de login
│   ├── register.css                 # Estilos del formulario de registro
│   ├── admin.css                    # Estilos del panel de administración
│   └── mis-reservas.css             # Estilos de la página de reservas del usuario
│
├── 📁 html/                         # Páginas HTML (6 archivos)
│   ├── admin.html                   # Panel de administración
│   ├── disponibilidad.html          # Consulta y reserva de habitaciones
│   ├── ubicacion.html               # Información de ubicación y contacto
│   ├── login.html                   # Formulario de inicio de sesión
│   ├── register.html                # Formulario de registro de usuario
│   └── mis-reservas.html            # Reservas del usuario logueado
│
├── 📁 js/                          # JavaScript del sistema
│   ├── script.js                   # Funciones globales y utilidades
│   └── 📁 components/              # Componentes JavaScript modulares (6 archivos)
│       ├── admin.js                # Lógica del panel de administración
│       ├── disponibilidad.js       # Lógica de consulta y reserva
│       ├── index-carousel.js       # Carrusel de habitaciones destacadas
│       ├── login.js                # Lógica de autenticación
│       ├── register.js             # Lógica de registro de usuarios
│       └── mis-reservas.js         # Lógica de gestión de reservas
│
├── 📁 images/                      # Recursos gráficos
│   ├── 📁 Habitaciones/            # Imágenes de habitaciones
│   ├── 📁 Hotel/                   # Imágenes del hotel
│   ├── 📁 Restaurantes/            # Imágenes del restaurante
│   └── 📁 spa/                     # Imágenes del spa
│
├── index.html                      # Página principal (Landing Page)
└── README.md                       # Este archivo de documentación
```

## 📄 Qué Hace Cada Archivo

### **🏠 Páginas Principales**

#### **`index.html`** - Página de Inicio
- **Landing page** principal del hotel
- **Carrusel de habitaciones** destacadas
- **Galería de servicios** (restaurante, spa, zonas húmedas)
- **Navegación** a todas las secciones del sitio
- **Header dinámico** que cambia según el estado de login

#### **`html/disponibilidad.html`** - Consulta y Reserva
- **Formulario de búsqueda** por fechas y número de huéspedes
- **Resultados de habitaciones** disponibles con detalles completos
- **Proceso de reserva** con validación de disponibilidad
- **Restricciones de acceso** (solo usuarios registrados pueden reservar)

#### **`html/ubicacion.html`** - Información de Contacto
- **Ubicación del hotel** con información detallada
- **Formulario de contacto** para consultas
- **Información de servicios** y amenidades
- **Mapa de ubicación** (preparado para integración)

### **🔐 Autenticación y Usuario**

#### **`html/login.html`** - Inicio de Sesión
- **Formulario de login** con validación
- **Acceso para usuarios** y administradores
- **Redirección automática** según el rol del usuario
- **Mensajes de error** descriptivos

#### **`html/register.html`** - Registro de Usuario
- **Formulario completo** con validación de datos
- **Campos requeridos**: identificación, nombre, nacionalidad, email, teléfono, contraseña
- **Verificación de email** único en el sistema
- **Confirmación de registro** exitoso

#### **`html/mis-reservas.html`** - Gestión Personal
- **Lista de reservas** del usuario logueado
- **Detalles completos** de cada reserva
- **Opción de cancelación** con confirmación
- **Historial de reservas** anteriores

### **👨‍💼 Panel de Administración**

#### **`html/admin.html`** - Panel Admin
- **Dashboard** con estadísticas generales
- **Gestión de habitaciones**: agregar, editar, eliminar
- **Gestión de reservas**: ver, modificar, cancelar reservas de clientes
- **Control de precios** y servicios por habitación
- **Acceso restringido** solo a administradores

### **⚙️ Archivos de Sistema**

#### **`js/script.js`** - Funciones Globales
- **Inicialización** de datos en Local Storage
- **Funciones de autenticación**: `login()`, `logout()`, `register()`
- **Gestión de reservas**: `createReservation()`, `cancelReservation()`
- **Validación de disponibilidad**: `isRoomAvailable()`
- **Utilidades globales**: `showAlert()`, `formatDate()`

#### **`js/components/`** - Componentes Modulares
- **`admin.js`**: Lógica completa del panel de administración
- **`disponibilidad.js`**: Lógica de búsqueda y reserva de habitaciones
- **`login.js`**: Manejo del formulario de inicio de sesión
- **`register.js`**: Manejo del formulario de registro
- **`mis-reservas.js`**: Gestión de reservas del usuario
- **`index-carousel.js`**: Carrusel dinámico de habitaciones destacadas

### **🎨 Archivos CSS**

#### **`css/common.css`** - Estilos Compartidos
- **Reset CSS** y variables globales
- **Header y footer** con diseño consistente
- **Botones y formularios** base
- **Animaciones** y transiciones globales

#### **`css/[página].css`** - Estilos Específicos
- **Estilos únicos** para cada página
- **Diseño responsivo** optimizado
- **Animaciones específicas** de cada sección

## 👨‍💻 Autor

**Desarrollado por**: Kevin Santiago Pinto Monsalve  
