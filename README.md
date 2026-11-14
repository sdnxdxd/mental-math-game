# Cálculo Mental — juego mobile offline

**Proyecto personal de desarrollo móvil** construido con **React Native, Expo y TypeScript**. Permite practicar cálculo mental en cuatro modalidades, ajustar la dificultad y consultar resultados anteriores, incluso sin conexión a Internet.

> **Qué demuestra este proyecto:** lógica de juego y puntuación, manejo de estado y temporizadores, navegación entre pantallas, persistencia local y visualización de estadísticas.

## Funcionalidades

- **Cuatro modos:** clásico, verdadero/falso, opción múltiple y contrarreloj.
- **Tres dificultades:** fácil, media y difícil.
- Cantidad de preguntas configurable en las rondas normales.
- Puntuación según velocidad, errores y tiempo agotado.
- Temporizador por pregunta y temporizador global en contrarreloj.
- Dificultad dinámica mediante una reducción progresiva del tiempo.
- Historial y mejores puntajes por modo y dificultad con **AsyncStorage**.
- Estadísticas finales con gráficos, animaciones y sonidos locales.

## Tecnologías y decisiones técnicas

| Área | Tecnologías / enfoque |
| --- | --- |
| Aplicación móvil | React Native, Expo y TypeScript |
| Navegación | React Navigation |
| Almacenamiento | AsyncStorage, sin depender de un servidor |
| Visualización | react-native-chart-kit y React Native SVG |
| Interfaz | React Native Animated y recursos de audio locales |

El proyecto está organizado en `src/` por responsabilidades: `screens/`, `components/`, `navigation/`, `hooks/`, `storage/`, `utils/`, `theme/` y `assets/`. Esta separación facilita localizar la lógica, la interfaz y los datos persistidos.

## Ejecutar localmente

**Requisitos:** Node.js, npm y un entorno compatible con Expo (Expo Go o emulador, según la plataforma).

```bash
git clone https://github.com/sdnxdxd/mental-math-game.git
cd mental-math-game
npm ci
npm run start
```

Abrí el proyecto en Expo Go mediante el QR o con un emulador desde Expo.

Comandos disponibles:

```bash
npm run start       # Inicia Expo
npm run android     # Abre en Android
npm run ios         # Abre en iOS
npm run web         # Abre versión web
npm run typecheck   # Comprueba los tipos con TypeScript
```

> Los scripts disponibles provienen de `package.json`. No se publica una suite automatizada de pruebas; las verificaciones funcionales indicadas abajo son manuales.

## Verificación funcional sugerida

1. Completar una partida en cada uno de los cuatro modos.
2. Verificar que un acierto rápido suma 100 puntos y otro dentro del tiempo suma 70.
3. Comprobar que un error resta 30 puntos y el tiempo agotado resta 50.
4. Confirmar que contrarreloj finaliza con un error o al consumirse el tiempo global.
5. Terminar una partida, cerrar y volver a abrir la aplicación para revisar historial y mejores puntajes.
6. Activar modo avión y confirmar que las partidas y la consulta de resultados siguen disponibles.
7. Ejecutar `npm run typecheck` como control estático del proyecto.

## Enlaces y portfolio

- [Código fuente](https://github.com/sdnxdxd/mental-math-game)
- [Perfil de GitHub](https://github.com/sdnxdxd)

**Siguiente mejora de presentación:** agregar capturas o un video breve del juego real. No se incluyen imágenes de ejemplo no verificadas.
