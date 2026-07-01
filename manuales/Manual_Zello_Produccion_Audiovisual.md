# Manual de Zello para Producción Audiovisual
### Cómo crear y manejar un canal (grupo) de comunicación para tu equipo de rodaje

---

## 1. ¿Qué es Zello y por qué sirve para un rodaje?

Zello convierte el celular en un walkie-talkie (push-to-talk / PTT): presionas un botón, hablas, y todos los que están en el mismo **canal** te escuchan al instante, sin marcar ni esperar a que alguien conteste una llamada. Para un set de filmación esto reemplaza a los radios de comunicación tradicionales (mucho más caros) usando el celular de cada persona del equipo, con internet o datos móviles.

Ventajas para un proyecto audiovisual como los que manejas en Matrix Producciones:

- Comunicación instantánea entre dirección, cámara, sonido, arte, producción y locaciones sin interrumpir el rodaje con llamadas.
- Un solo canal puede tener a todo el equipo, o puedes dividir en varios canales por departamento.
- Queda historial de los mensajes de voz (se pueden re-escuchar si alguien no alcanzó a oír una instrucción).
- Funciona en Android, iPhone, y también hay versión de escritorio (útil para el productor de base o el director de producción sentado frente al monitor).

---

## 2. Instalación y primeros pasos

1. Descarga **Zello** desde la Play Store (Android) o App Store (iPhone). También existe Zello para PC/Mac si alguien va a monitorear desde un computador en base.
2. Abre la app y crea una cuenta: puede ser con número de teléfono o correo. Usa un nombre de usuario que identifique el rol de la persona (ej: `director_matrix`, `sonido_matrix`, `camara1_matrix`), esto ayuda mucho cuando el canal crece.
3. Todos los integrantes del equipo deben tener la app instalada y una cuenta creada **antes** del día de rodaje. Es el paso que más tiempo quita si se deja para el último momento.

---

## 3. Crear el canal (grupo) del proyecto

En Zello, "canal" y "grupo" son lo mismo: es el espacio donde varias personas hablan entre sí.

**Pasos para crear el canal:**

1. Abre la app → ve al menú (ícono de las tres líneas o el ícono de canales).
2. Entra a la sección **Canales**.
3. Presiona el botón azul **+**.
4. Selecciona **Crear un canal**.
5. Ponle nombre al canal. Recomendación: usa el nombre del proyecto, por ejemplo `MATRIX_UltimoCorte_Set` o `MATRIX_LaSalina_Rodaje`. Evita nombres genéricos como "Grupo 1" — cuando manejas varios proyectos en paralelo, un nombre claro evita confusiones.
6. Agrega una descripción corta (ej: "Canal oficial de rodaje — solo coordinación de set") y, si quieres, una foto (puede ser el logo de Matrix Producciones o el poster/clave visual del proyecto).
7. Define si el canal es **público** o **privado**. Para un rodaje, siempre déjalo **privado**, así solo entra quien tú invites.
8. Guarda el canal.

---

## 4. Invitar al equipo

Una vez creado el canal:

1. Entra al canal → toca el nombre del canal en la parte superior → busca el ícono de **compartir/invitar**.
2. Tienes dos formas de agregar gente:
   - **Por contacto directo**: si la persona ya tiene Zello, búscala por su usuario y agrégala.
   - **Por enlace de invitación**: genera un link y lo envías por WhatsApp (que ya usas para tus flujos de producción) — la persona toca el link, abre Zello y entra directo al canal.
3. Recomendación operativa: crea un mensaje de bienvenida fijo (Zello permite configurar un "mensaje de bienvenida" del canal) donde expliques en una línea las reglas básicas de uso (ver sección 6).

---

## 5. Roles dentro del canal: quién habla, quién escucha

Esto es clave para que el canal no se vuelva un caos con 15 personas hablando encima de la escena. Zello permite asignar **roles por usuario dentro del canal**:

| Rol | Qué puede hacer | A quién se lo asignas en un rodaje |
|---|---|---|
| **Administrador** | Crea, edita, borra el canal, agrega/quita gente, cambia roles | Director de producción / tú como responsable general |
| **Hablar y escuchar** | Puede transmitir y recibir | Director, asistente de dirección, jefe de cámara, sonido, producción |
| **Solo escuchar** | Recibe pero no transmite | Extras, personal de apoyo, visitas al set, practicantes |
| **Moderador (opcional)** | Puede silenciar a otros o dar prioridad a mensajes urgentes | AD (asistente de dirección), quien controla el ritmo del set |

Para asignar roles: entra al canal → **Configuración del canal** → **Usuarios** → toca el nombre de la persona → elige su rol.

---

## 6. Organización recomendada para un proyecto audiovisual

Si el equipo es grande (más de 10-15 personas), un solo canal se satura. La recomendación para producciones tipo las tuyas (rodajes de "ÚltimoCorte", eventos como Nipon Flex, o jornadas de La Salina) es dividir en **sub-canales por departamento**, todos dentro del mismo proyecto:

- `MATRIX_[Proyecto]_General` → anuncios generales, "cámara y sonido listos", "vamos a rodar", "corten"
- `MATRIX_[Proyecto]_AD` → asistencia de dirección coordinando talento, extras, horarios
- `MATRIX_[Proyecto]_Produccion` → logística, transporte, catering, permisos, locación
- `MATRIX_[Proyecto]_Camara_Sonido` → ajustes técnicos entre el equipo de cámara y sonido sin interrumpir al resto

Cada persona clave (director, jefe de producción) puede estar en varios canales a la vez y saltar entre ellos según lo que necesite escuchar en ese momento. Esto es exactamente el mismo principio que usas en tus automatizaciones de n8n: separar por "categoría" para que la información llegue solo a quien le sirve.

---

## 7. Protocolo de uso en set (buenas prácticas de radio)

Para que la comunicación sea clara y no interrumpa la toma:

1. **Antes de hablar**, espera un segundo tras presionar el botón (el PTT tiene un pequeño retraso de conexión).
2. **Mensajes cortos y directos**: "Cámara lista", "Sonido listo", "Rodando", "Corten" — evita conversaciones largas por el canal general; para eso usa el sub-canal correspondiente o habla directo.
3. **Silencia el celular** durante la toma pero deja la app en primer plano o con notificación activa, porque los mensajes de Zello se reproducen automáticamente al recibirse (a menos que se ponga en modo silencioso).
4. Define una palabra o código simple para "silencio en set, vamos a rodar" (ej: "Rodando — silencio en canal") para que todos sepan que no deben transmitir salvo emergencia.
5. El moderador/AD puede pedir a todos bajar el volumen o pasar a "solo escuchar" en el momento exacto de la toma, y reactivar después de "corten".

---

## 8. Recomendaciones técnicas

- **Batería**: Zello consume batería por mantener conexión activa; lleva power bank para roles clave (AD, sonido, cámara).
- **Datos/wifi**: funciona con datos móviles o wifi. En locaciones sin buena señal (zonas rurales como El Cerrito para La Salina), prueba antes del día de rodaje si hay señal suficiente; si no, considera radios físicos como respaldo.
- **Auriculares con micrófono o manos libres**: para quienes están operando cámara o luces y no pueden sostener el celular.
- **Un dispositivo "base"**: si tienes la versión de escritorio, úsala en el punto de control (video assist / dirección) para monitorear todos los sub-canales a la vez desde una pantalla.

---

## 9. Cierre y mantenimiento del canal después del rodaje

- Al terminar el proyecto, puedes **archivar o eliminar** el canal (mantén presionado el canal → Eliminar canal) si ya no lo necesitas, o dejarlo activo si vas a tener post-producción con el mismo equipo coordinando entregas.
- Si maneja varios proyectos en paralelo (como sueles hacer entre Matrix, Ophalline y Cali Sky Store), usa siempre el prefijo del proyecto en el nombre del canal para no mezclar comunicaciones de un rodaje con las de otro.

---

**Resumen rápido (checklist para el día de rodaje):**

- [ ] Todo el equipo tiene Zello instalado y cuenta creada
- [ ] Canal creado con nombre claro del proyecto y privacidad activada
- [ ] Roles asignados (quién habla, quién solo escucha)
- [ ] Sub-canales creados si el equipo es grande
- [ ] Protocolo de "silencio en set" acordado con todos
- [ ] Dispositivo base cargado y con buena señal probada en locación
