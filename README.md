# Sistema de Biblioteca

App web para gestión de biblioteca con préstamos de libros. Tiene dos tipos de usuarios: bibliotecarios (que pueden gestionar usuarios, libros y préstamos) y estudiantes (que pueden buscar libros y hacer préstamos).

## ¿Qué hace?

**Bibliotecarios pueden:**
- Crear usuarios y asignarles contraseñas
- Agregar, ver y eliminar libros
- Ver todos los préstamos y marcar devoluciones
- Filtrar préstamos por estudiante o estado

**Estudiantes pueden:**
- Buscar libros por título, autor o género
- Ver detalles de libros y su disponibilidad
- Solicitar préstamos de libros disponibles
- Ver su historial de préstamos

## Stack Técnico

- **React + TypeScript + Vite** - Frontend
- **React Router** - Navegación entre páginas
- **Redux Toolkit** - Estado de préstamos
- **CSS Modules** - Estilos
- **JWT** - Autenticación

## Estructura del Proyecto

```
src/
├── components/          # Todos los componentes React
├── contexts/           # AuthContext para login/usuario
├── store/             # Redux para gestión de préstamos
├── types/             # Tipos TypeScript
└── utils/             # Servicio de API
```

## 🚀 Setup de Desarrollo

### Prerrequisitos
- Node.js 18+ (recomendado: versión 20)
- Backend Django corriendo en `http://localhost:8000`

### Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar entorno**
   
   Crear archivo `.env.local`:
   ```env
   VITE_API_BASE_URL=
   ```
   
   > Nota: Se deja vacío para usar el proxy de Vite que redirige a localhost:8000

3. **Iniciar desarrollo**
   ```bash
   npm run dev
   ```
   
   Abre: `http://localhost:3000`

### ¡Listo! Ya puedes usar la app

## Scripts Útiles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run lint         # Revisar código
npm run format       # Formatear con Prettier
```

## Cómo Funciona

### Autenticación
- Login con usuario/contraseña
- JWT tokens en localStorage
- Rutas protegidas por rol (bibliotecario/estudiante)

### API
El frontend se conecta a Django backend en `localhost:8000`:
- `/api/token/` - Login
- `/api/users/` - Gestión de usuarios 
- `/api/books/` - Gestión de libros
- `/api/loans/` - Gestión de préstamos

## Problemas Comunes

**"Failed to fetch"**
- Asegúrate que el backend Django esté corriendo en puerto 8000

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Puerto 3000 ocupado**
```bash
export VITE_PORT=3001
npm run dev
```

**Problemas de login**
- Limpia localStorage en DevTools: `localStorage.clear()`

## Desarrollo

Para contribuir:
1. Crea un branch: `git checkout -b feature/algo-nuevo`
2. Haz tus cambios
3. `npm run lint` para revisar código
4. Push y PR

El proyecto usa TypeScript + ESLint + Prettier para mantener código limpio.
