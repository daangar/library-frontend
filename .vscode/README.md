# VS Code Configuration

Este directorio contiene la configuración optimizada de Visual Studio Code para el proyecto de la Biblioteca.

## Archivos Incluidos

### `launch.json`
Configuraciones de debugging para:
- **Launch Chrome - Development**: Lanza Chrome con debugging habilitado
- **Attach to Chrome**: Se conecta a una instancia existente de Chrome
- **Launch Edge - Development**: Lanza Microsoft Edge con debugging
- **Debug Node.js (API Tests)**: Para debugging de tests (cuando se implementen)

### `tasks.json`
Tareas automatizadas para:
- `npm: dev` - Inicia el servidor de desarrollo
- `npm: build` - Construye la aplicación para producción
- `npm: lint` - Ejecuta ESLint para verificar código
- `npm: format` - Formatea código con Prettier
- `npm: preview` - Vista previa del build de producción

### `settings.json`
Configuraciones del workspace optimizadas para:
- **Formateo automático** al guardar con Prettier
- **ESLint** integrado con fix automático
- **TypeScript** con import automático y organización
- **File nesting** para mejor organización
- **Exclusiones** de archivos innecesarios

### `extensions.json`
Extensiones recomendadas para desarrollo óptimo:
- **Esenciales**: TypeScript, ESLint, Prettier
- **React**: Snippets y herramientas específicas
- **Productividad**: Git, iconos, path intellisense
- **Debugging**: Error lens, auto-rename tags

## Cómo Usar

### 1. Debugging
1. Presiona `F5` o ve a `Run and Debug` (Ctrl/Cmd + Shift + D)
2. Selecciona "Launch Chrome - Development"
3. Se abrirá Chrome con el proyecto ejecutándose
4. Coloca breakpoints en VS Code y debuggea normalmente

### 2. Tareas Rápidas
- `Ctrl/Cmd + Shift + P` → "Tasks: Run Task"
- Selecciona la tarea que necesites
- O usa los shortcuts de teclado configurados

### 3. Formateo Automático
- El código se formatea automáticamente al guardar
- ESLint se ejecuta y corrige automáticamente
- Los imports se organizan automáticamente

## Extensiones Recomendadas

Al abrir el proyecto, VS Code te sugerirá instalar las extensiones recomendadas. Se recomienda instalarlas todas para la mejor experiencia de desarrollo.

### Esenciales
- **ESLint**: Linting en tiempo real
- **Prettier**: Formateo de código
- **TypeScript Hero**: Mejor soporte para TypeScript
- **Auto Rename Tag**: Renombra tags HTML automáticamente

### Productividad  
- **GitLens**: Información detallada de Git
- **Path Intellisense**: Autocompletado de rutas
- **Error Lens**: Errores inline
- **Material Icon Theme**: Iconos mejorados

## Debugging Tips

### Breakpoints
- Coloca breakpoints directamente en VS Code
- Funciona con TypeScript y JSX
- Inspecciona variables en tiempo real
- Call stack completo disponible

### Source Maps
- Configurado automáticamente con Vite
- Debug del código TypeScript original
- No del código transpilado

### Hot Reload
- Los cambios se reflejan automáticamente
- Mantiene el estado de la aplicación
- Debugging sin interrupciones

## Shortcuts Útiles

- `F5`: Inicio debugging
- `Ctrl/Cmd + Shift + P`: Command palette
- `Ctrl/Cmd + Shift + E`: Explorer
- `Ctrl/Cmd + Shift + D`: Debug panel
- `Ctrl/Cmd + Shift + G`: Git panel
- `Ctrl/Cmd + Shift + X`: Extensions

## Troubleshooting

### Debugging no funciona
1. Verificar que el servidor de desarrollo esté corriendo (`npm run dev`)
2. Comprobar que el puerto sea 3000
3. Reinstalar extensiones de Chrome/Edge debugging

### Formateo no automático
1. Verificar que Prettier esté instalado
2. Comprobar configuración de `editor.formatOnSave`
3. Reiniciar VS Code

### ESLint no funciona
1. Verificar que ESLint extension esté habilitada
2. Ejecutar `npm install` para dependencias
3. Comprobar archivo `.eslintrc.js`