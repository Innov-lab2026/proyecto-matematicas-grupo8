#   Uso y Despliegue - "Mate+" (Back-End Equipo 8)

Este monorepo utiliza una arquitectura dual de variables de entorno y orquestación vía `pnpm` para facilitar el desarrollo local y el despliegue escalable.

## 1. Arquitectura de Variables (.env)

Usamos una división de variables en dos archivos `.env` simplificando el despliegue "web serverless" y garantizando la disponibilidad a las partes del Equipo con un costo de incremento minimizado, en mantenimiento y escalabilidad:

- **`/Back-End/.env`**: Contiene llaves "sensibles" (DATABASE_URL, GOOGLE_API_KEY, ADMIN_EMAILS). Estos valores nunca se exponen al cliente.
- **`/Front-End/.env`**: Debe contener *únicamente* URLs publicables y Keys de cliente (VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).


## 2. Comandos de Mantenimiento y Actualización

### Desde la raíz del proyecto

- **Sincronizar dependencias:**
  ```bash
  pnpm install
  ```
  *¿Cuándo usarlo?* Siempre después de un `git pull` si cambió el `pnpm-lock.yaml`, o si vos mismo agregaste un paquete nuevo.

- **Regenerar Cliente de Base de Datos:**
  ```bash
  pnpm build:back
  ```
  *¿Cuándo usarlo?* Obligatorio si se modifica el archivo `Back-End/prisma/schema.prisma`. Esto actualiza el motor de Prisma para que Node reconozca los nuevos modelos o campos.

---

## 3. Comandos de Desarrollo Local

Desde la raíz del proyecto, podés usar los siguientes comandos:

### Modo Mock (sin Bd, ejecución local con persistencia)

Utiliza archivos .CSV con Tablas conteniendo datos de ejemplo equivalentes a las sembradas en la Db de ejemplo.

```bash
pnpm dev:all-mock
```
*   **Back-End:** Corre con `DATA_SOURCE=MOCK`.
*   **Front-End:** Conecta a `localhost:3001/api`.


### Modo Database (con postgreSQL en Supabase)

Utilizará la Base de Datos en la nube, requiere la configuración correspondiente de tu archivo `Back-End/.env`.

```bash
pnpm dev:all
```
*   **Back-End:** Corre con `DATA_SOURCE=DB` y 'llaves requeridas' en el archivo `Back-End/.env`.
*   **Front-End:** Conecta a la API local que a su vez conecta a Supabase.


>
    > Podés tener DATA_SOURCE=DB escrito en tu .env del Back-End, pero si lanzás el comando de "Mock", el sistema va a ignorar lo que dice el archivo y va a usar el valor del comando y viceversa, con DATA_SOURCE=MOCK en el `.env` el `pnpm dev:all` despliega la versión con Database web.


### Integración con CLI de Asistencia Inteligente Modulable

El modelo implementa desde el Back-End el enlace con la API de Gemini y establece un prompt condicional de respuesta para la asistencia en casos de "respuesta incorrecta" de las actividades. Se optó por un condicional simple, de respuesta pedagógica no conclusiva ("pista").
Para su activación solo es necesario incluir en el archivo `Back-End/.env` la correspondiente llave de acceso, utilizándose en el test de integración exitosamente.
La mecánica cuenta con un fallback que responde desde un estático en el campo correspondiente de la Tabla en la Db.


## 4. Despliegue y Empaquetado

El proyecto está configurado para un despliegue modular:

- **Compilación Total:**
  ```bash
  pnpm build
  ```
  *¿Cuándo usarlo?* Es el comando que va a correr Vercel automáticamente al desplegar el proyecto. Ejecutarlo localmente sirve para validar que no haya errores de sintaxis en el Front o fallos en Prisma antes de subir los cambios.
---

>1.  **Build Settings en Vercel:** Se debe usar el comando `pnpm build` definido en la raíz.
>2.  **Serverless Functions:** La carpeta `Back-End/api/index.js` sirve como punto de entrada para la API.
>3.  **Variables en el Panel de Entorno:** Para configurar el despliegue, tenés que cargar las variables del `.env` para cada "mundo" en tu monorepo, en cada "proyecto" correspondiente del host, ***Project Front*** y ***Project Back*** (o los nombres que desees), en el panel de "Environment Variables" del mismo.


## Variables de Entorno

### CLI de Asistencia

**GOOGLE_API_KEY="api_key"**

### Front End
### URL de la correspondiente API del Backend

- **Local**: http://127.0.0.1:3001/api
- **Producción**: https://tu-backend.vercel.app/api (en "Domains" de tu "Proyecto_Back" en Vercel)

**VITE_API_URL="http://[URL]/api"**

### Configuración de Supabase (Auth de cliente)

- **Deben coincidir con SUPABASE_URL y SUPABASE_ANON_KEY del Back-End**

**VITE_SUPABASE_URL="https://[TU_PROYECTO].supabase.co"**
**VITE_SUPABASE_ANON_KEY="[ANON_KEY]"**

### Back End

- **Instrucciones en `.env_ejemplo_Back.md`**


**PORT=3001**

**SUPABASE_URL="https://[TU_PROYECTO].supabase.co"**

**SUPABASE_ANON_KEY="[ANON_KEY]"**

**DATABASE_URL="postgresql://postgres.[USUARIO]:[CONTRASEÑA]@aws-1-[ZONA].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"**

**DIRECT_URL="postgresql://postgres.[USUARIO]:[CONTRASEÑA]@aws-1-[ZONA].pooler.supabase.com:5432/postgres"**

**GOOGLE_API_KEY="[API_KEY]"**

**ADMIN_EMAILS="[ejemplo1@ejemplo.com],[ejemplo2@ejemplo.com]"**

**PRISMA_HIDE_UPDATE_MESSAGE=true**

---

## 5. Troubleshooting

- **Error de Puerto:** Si el puerto 3001 está ocupado, el servidor informará el error y el PID para matarlo.
- **Prisma Client:** (*Back End*) Si cambiás el esquema (`prisma/schema.prisma`), recordá correr `pnpm build:back` para regenerar el cliente.

---
(*Mantené este documento actualizado ante cualquier cambio en la infraestructura.*)
