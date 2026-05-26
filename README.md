# Calculo Mental

Juego offline de calculos mentales hecho con Expo, React Native y TypeScript.

## Funcionalidades

- 4 modos de juego: clasico, verdadero/falso, multiple choice y contra reloj.
- Dificultad facil, media y dificil.
- Cantidad de preguntas configurable para rondas normales.
- Puntaje por velocidad, error y timeout.
- Timer visual por pregunta y timer global en contra reloj.
- Dificultad dinamica con reduccion progresiva del tiempo.
- Persistencia local con AsyncStorage.
- Historial y mejores puntajes por modo/dificultad.
- Estadisticas finales con grafico.
- Feedback visual con Animated y sonidos locales offline.

## Instalacion

```bash
npm install
```

## Ejecutar

```bash
npm run start
```

Luego escanea el QR con Expo Go o abre el emulador desde la terminal de Expo.

## Pruebas manuales recomendadas

1. Jugar una partida en cada modo.
2. Verificar que acierto rapido suma 100.
3. Verificar que acierto dentro del tiempo suma 70.
4. Verificar que error resta 30.
5. Verificar que timeout resta 50.
6. Confirmar que contra reloj termina al fallar o al agotarse el tiempo global.
7. Finalizar una partida, cerrar y abrir la app, y revisar historial/mejores puntajes.
8. Activar modo avion y confirmar que todo sigue funcionando.

