# 🧾 Martínez & Asociados - Sitio Web Corporativo

> Landing page profesional para estudio contable con más de 30 años de trayectoria en Olavarría, Buenos Aires.

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-4500%2B_líneas-6e9f18?logo=vitest)](https://vitest.dev/)

## 📋 Descripción

Sitio web moderno y profesional desarrollado para un estudio contable local, diseñado para captar clientes y optimizar la presencia digital del negocio. El proyecto demuestra capacidades avanzadas en desarrollo front-end, arquitectura de componentes y optimización de performance.

**Cliente ficticio:** Estudio contable "Martínez & Asociados" en Olavarría, Buenos Aires.

### 🎯 Objetivos del Proyecto

- ✅ **Conversión:** Diseño orientado a generar leads a través de WhatsApp y formulario de contacto
- ✅ **Performance:** Optimización para Google PageSpeed (90+ score)
- ✅ **Accesibilidad:** WCAG 2.1 AA compliance
- ✅ **SEO:** Estructura semántica y meta tags optimizados
- ✅ **Responsive:** Diseño mobile-first adaptable a todos los dispositivos

## ✨ Características Destacadas

### 🔧 Técnicas

- **Arquitectura modular** con separación de concerns (components, hooks, utils, data)
- **TypeScript estricto** con tipado completo y types personalizados
- **Custom Hooks reutilizables** para lógica de negocio
- **Lazy Loading** de componentes para optimizar carga inicial
- **Error Boundaries** granulares para mejor UX en caso de errores
- **Animaciones suaves** con CSS y Intersection Observer API
- **Tests comprehensivos** con 4500+ líneas de cobertura (Vitest + Testing Library)

### 🎨 Visuales

- **Diseño moderno** con sistema de colores profesional
- **Componentes UI reutilizables** (Button, Card, Input, Textarea)
- **Animaciones on-scroll** con delays progresivos
- **WhatsApp flotante** para contacto directo
- **Responsive design** con breakpoints optimizados
- **Tipografía escalable** con sistema de design tokens

## 🛠️ Stack Tecnológico

### Core

- **React 18.3** - UI library con Concurrent Features
- **TypeScript 5.6** - Type safety y mejor DX
- **Vite 6.0** - Build tool ultra-rápido con HMR

### Styling

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS** - Procesamiento de CSS
- **Custom Design System** - Tokens y variables personalizadas

### Testing

- **Vitest** - Test runner compatible con Vite
- **Testing Library** - Testing de componentes React
- **@testing-library/user-event** - Simulación de interacciones
- **jsdom** - DOM environment para tests

### Tooling

- **ESLint** - Linting con reglas estrictas
- **Prettier** - Code formatting
- **TypeScript ESLint** - Type-aware linting rules

### Icons & Assets

- **Lucide React** - Iconos SVG optimizados
- **WebP** - Imágenes optimizadas

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── home/              # Secciones de la landing page
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── About.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   └── Contact.tsx
│   ├── layout/            # Componentes de layout
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/                # Componentes UI reutilizables
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── ErrorBoundary.tsx
│       ├── WhatsAppFloat.tsx
        └── WhatsAppIcon.tsx
├── hooks/                 # Custom React hooks
│   ├── useContactForm.ts
│   ├── useScrollAnimation.ts
│   ├── useScrollToSection.ts
│   ├── useToggle.tsx
│   ├── useFocusTrap.ts
│   └── useCounter.ts
├── data/                  # Datos estáticos
│   ├── services.ts
│   ├── testimonials.ts
│   └── faq.ts
├── config/                # Configuración del sitio
│   └── site.ts
├── constants/             # Constantes globales
│   ├── validationMessages.ts
│   ├── navbarItems.ts
│   └── iconSizes.ts
├── types/                 # TypeScript types
│   └── index.ts
├── utils/                 # Utilidades
│   └── logger.ts
└── test/                  # Test setup
    ├── setup.ts
    └── utils.tsx
```

## 🚀 Instalación y Uso

### Requisitos previos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/lautaro-ruspil/estudio-martinez.git

# Entrar al directorio
cd martinez-asociados

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (localhost:5173)
npm run build        # Build de producción
npm run preview      # Preview del build
npm run test         # Ejecutar tests
npm run test:ui      # UI de Vitest
npm run test:coverage # Coverage report
npm run lint         # Linting con ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🧪 Testing

El proyecto cuenta con una suite de tests comprehensiva:

- **4500+ líneas de código de testing**
- **Cobertura de componentes** (Hero, Services, About, Contact, etc.)
- **Cobertura de hooks** (useContactForm, useScrollAnimation, etc.)
- **Tests unitarios y de integración**
- **Accesibilidad testing** con @testing-library/jest-dom

```bash
# Ejecutar todos los tests
npm run test

# Watch mode
npm run test -- --watch

# Coverage report
npm run test:coverage

# UI interactiva
npm run test:ui
```

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
/* Primary (Verde profesional) */
--primary-50: #f0fdf4 --primary-600: #16a34a --primary-700: #15803d
    /* Neutrales */ --slate-50: #f8fafc --slate-600: #475569
    --slate-900: #0f172a;
```

### Breakpoints Responsive

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Componentes UI

- **Button:** Variantes (primary, secondary, outline, ghost, link) + tamaños (sm, md, lg)
- **Card:** Contenedor con sombras y hover effects
- **Input/Textarea:** Campos de formulario con validación y estados de error
- **ErrorBoundary:** Manejo graceful de errores en componentes

## 📱 Funcionalidades Implementadas

### Secciones

1. **Hero** - Introducción con CTA principal
2. **Servicios** - Grid de 6 servicios contables
3. **Sobre Nosotros** - Experiencia y valores
4. **Testimonios** - Reseñas de clientes
5. **FAQ** - Preguntas frecuentes
6. **Contacto** - Formulario con validación completa

### Características UX

- ✅ **Scroll suave** entre secciones
- ✅ **Animaciones on-scroll** con Intersection Observer
- ✅ **WhatsApp flotante** siempre accesible
- ✅ **Validación de formulario** en tiempo real
- ✅ **Estados de loading** en submit
- ✅ **Mensajes de error claros** y útiles
- ✅ **Focus management** para accesibilidad

## 🔐 Accesibilidad (A11y)

- ✅ Estructura semántica HTML5
- ✅ ARIA labels y roles apropiados
- ✅ Navegación por teclado completa
- ✅ Focus visible en todos los elementos interactivos
- ✅ Contraste de colores WCAG AA
- ✅ Alt text en imágenes
- ✅ Skip links para navegación
- ✅ Error announcements para screen readers

## ⚡ Optimizaciones de Performance

### Code Splitting

- Lazy loading de componentes below-the-fold
- Suspense boundaries con fallbacks
- Dynamic imports para reducir bundle inicial

### Assets

- Imágenes en formato WebP
- SVG para iconos y logos
- Lazy loading de imágenes

### CSS

- Purge de clases no utilizadas (Tailwind)
- Critical CSS inline
- Font subsetting

### JavaScript

- Tree shaking automático (Vite)
- Minificación en producción
- Gzip compression

## 📊 Métricas Objetivo

- **First Contentful Paint:** < 1.2s
- **Time to Interactive:** < 3.0s
- **Cumulative Layout Shift:** < 0.1
- **Lighthouse Score:** 90+

## 🔄 Próximas Mejoras

- [ ] Integración con backend (API REST)
- [ ] Sistema de citas online
- [ ] Blog de contenidos fiscales
- [ ] Panel de administración
- [ ] Multi-idioma (español/inglés)
- [ ] PWA (Progressive Web App)
- [ ] Analytics y tracking
- [ ] A/B testing de CTAs

## 📝 Aprendizajes Clave

Este proyecto me permitió profundizar en:

1. **Arquitectura escalable** - Organización de código para proyectos reales
2. **TypeScript avanzado** - Tipos genéricos, utility types, type guards
3. **Testing comprehensivo** - TDD y cobertura completa de edge cases
4. **Performance optimization** - Lazy loading, code splitting, asset optimization
5. **Accesibilidad** - WCAG compliance y UX inclusiva
6. **Design systems** - Tokens, componentes reutilizables, consistencia visual

## 👨‍💻 Autor

**Lautaro Ruspil**

- [Portfolio](https://lautaro-ruspil.web.app)
- [LinkedIn](https://www.linkedin.com/in/lautaro-ruspil)
- [GitHub](https://github.com/lautaro-ruspil)
- Email: lauruspil@gmail.com

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

⭐ Si este proyecto te resultó útil o interesante, considera darle una estrella en GitHub!
