# 🏛️ Agenda 50/50 — Portal Oficial y Plataforma de Monitoreo

Plataforma oficial de transparencia activa, pedagogía ciudadana, monitoreo departamental en tiempo real y co-construcción ciudadana basada en el **Acuerdo N° 001/2026 de Sucre (Agenda 50/50)** para la descentralización tributaria y el pacto fiscal en Bolivia.

---

## 📋 Tabla de Contenidos
1. [Especificaciones Técnicas](#-especificaciones-técnicas)
2. [Arquitectura y Módulos](#-arquitectura-y-módulos)
   - [Portal Público (Landing & Herramientas)](#portal-público)
   - [Panel Administrativo CMS (/admin)](#panel-administrativo-cms-admin)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Variables de Entorno](#-variables-de-entorno)
5. [Guía Paso a Paso para Despliegue en un Servidor Nuevo](#-guía-paso-a-paso-para-despliegue-en-un-servidor-nuevo)
   - [Paso 1: Requisitos del Servidor](#paso-1-requisitos-del-servidor)
   - [Paso 2: Clonación del Repositorio](#paso-2-clonación-del-repositorio)
   - [Paso 3: Instalación de Dependencias](#paso-3-instalación-de-dependencias)
   - [Paso 4: Variables de Entorno](#paso-4-variables-de-entorno)
   - [Paso 5: Base de Datos y Semillas (Prisma & SQLite)](#paso-5-base-de-datos-y-semillas-prisma--sqlite)
   - [Paso 6: Carpetas de Subidas y Archivos Clave](#paso-6-carpetas-de-subidas-y-archivos-clave)
   - [Paso 7: Compilación de Producción](#paso-7-compilación-de-producción)
   - [Paso 8: Configuración de PM2 (Daemon)](#paso-8-configuración-de-pm2-daemon)
   - [Paso 9: Configuración de Proxy Inverso en Nginx](#paso-9-configuración-de-proxy-inverso-en-nginx)
   - [Paso 10: Certificado SSL con Let's Encrypt](#paso-10-certificado-ssl-con-lets-encrypt)
   - [Despliegue Alternativo en Servidores con aaPanel](#despliegue-alternativo-en-servidores-con-aapanel)
6. [Credenciales Administrativas por Defecto](#-credenciales-administrativas-por-defecto)
7. [Mantenimiento, Respaldos y Actualizaciones](#-mantenimiento-respaldos-y-actualizaciones)
8. [Resolución de Problemas Frecuentes](#-resolución-de-problemas-frecuentes)

---

## ⚙️ Especificaciones Técnicas

| Componente | Detalle / Versión |
| :--- | :--- |
| **Framework Web** | [Next.js](https://nextjs.org/) v15.4 (App Router, Server Actions, Dynamic Rendering) |
| **Librería UI** | [React](https://react.dev/) v19.1 |
| **Entorno de Ejecución** | [Node.js](https://nodejs.org/) v18.x LTS o v20.x LTS *(Recomendado: Node v20 LTS)* |
| **Gestor de Paquetes** | npm v10+ |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) v5.8 |
| **Base de Datos** | [SQLite](https://www.sqlite.org/) (archivo local de alta velocidad, sin servidor externo requerido) |
| **ORM** | [Prisma](https://www.prisma.io/) v5.22 |
| **Diseño y Estilos** | [Tailwind CSS](https://tailwindcss.com/) v3.4 + PostCSS + Autoprefixer |
| **Componentes e Iconos** | [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) v12 |
| **3D & Gráficos** | [Three.js](https://threejs.org/) (Isólogo 3D interactivo en canvas), [Recharts](https://recharts.org/) |
| **Autenticación CMS** | Sesiones basadas en JWT cifrado con [jose](https://github.com/panva/jose) + passwords con [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **Mailing / Notificaciones**| [Nodemailer](https://nodemailer.com/) v10 (integrado con SMTP para propuestas ciudadanas) |
| **Puerto por Defecto** | `3010` (configurable mediante scripts o variables) |

---

## 🏛️ Arquitectura y Módulos

### Portal Público
- **Hero Institucional & 3D Isólogo**: Banner principal dinámico con el Isólogo interactivo 3D / WebM, texto oficial del acuerdo y enlace de descarga directa del PDF oficial.
- **Conceptos 50/50**: Acordeón interactivo y pedagógico que detalla la transición hacia el 50/50 en recursos, competencias y toma de decisiones.
- **Monitor 50/50 Departamental**: Mapa vectorial interactivo de Bolivia con métricas de los 9 departamentos (estado de adhesión, gobernadores, impacto fiscal y proyectos estratégicos).
- **Galería de Noticias Dinámica (`InteractiveNewsGallery3`)**: Módulo interactivo con consumo de API externa de prensa en tiempo real (`/api/news`), soporte de paginación, filtros departamentales y fallback local en caso de intermitencia de red.
- **Pilares Autonómicos**: Bloques interactivos de los 4 ejes: Fiscal, Competencial, Institucional y Normativo.
- **Línea de Tiempo / Hitos**: Ruta crítica de implementación y cumplimiento del acuerdo con badges de estado (Cumplido, En proceso, Programado, Meta) y participantes.
- **Centro Multimedia (`MultimediaHub`)**: Reproducción y filtrado de Audios/Podcasts, Videos, Entrevistas en Medios, Webinars y Actas de Reuniones Técnicas.
- **Repositorio Documental (`DocumentHub`)**: Buscador avanzado de documentos normativos, proyectos de ley y decretos con filtro por categoría/departamento y conteo de descargas.
- **Buzón de Co-construcción Ciudadana**: Formulario interactivo con persistencia directa en base de datos para aportes de organizaciones y ciudadanos, con notificación por correo electrónico.
- **Soporte de Tema**: Selector de Modo Claro / Modo Oscuro con persistencia en localStorage.

### Panel Administrativo CMS (`/admin`)
- **Control de Acceso Seguro**: Autenticación vía JWT en cookies seguras protegidas por `middleware.ts`.
- **Dashboard Resumen**: Conteo y métricas en tiempo real de propuestas, documentos, recursos multimedia e hitos.
- **Gestión de Propuestas (`/admin/proposals`)**: Revisión de aportes ciudadanos, cambio de estados (*Pendiente*, *Revisado*, *Derivado*, *Archivado*) y notas internas.
- **Centro Multimedia (`/admin/multimedia`)**: Alta, edición y baja de audios, videos de YouTube, enlaces de medios o archivos multimedia.
- **Conceptos 50/50 (`/admin/concepts`)**: Edición de la guía conceptual y pedagógica del portal.
- **Hitos / Timeline (`/admin/timeline`)**: Administración de la ruta crítica y estado de cumplimiento.
- **Repositorio Documental (`/admin/documents`)**: Carga de archivos PDF al servidor (`public/uploads/documents/`) y actualización de metadatos.
- **Pilares Autonómicos (`/admin/pillars`)**: Modificación de objetivos y acciones por pilar.
- **Monitor Regional (`/admin/departments`)**: Actualización de indicadores y notas departamentales.
- **Perfil & Seguridad (`/admin/profile`)**: Modificación de nombre, correo y contraseña del usuario administrador.

---

## 📂 Estructura del Proyecto

```text
├── app/
│   ├── admin/                 # Panel Administrativo CMS
│   │   ├── concepts/          # Gestión de conceptos 50/50
│   │   ├── departments/       # Gestión del monitor territorial
│   │   ├── documents/         # Gestión de documentos descargables
│   │   ├── login/             # Página de autenticación administrativa
│   │   ├── multimedia/        # Gestión de audios, videos y podcasts
│   │   ├── pillars/           # Gestión de pilares autonómicos
│   │   ├── profile/           # Configuración de usuario y contraseña
│   │   ├── proposals/         # Bandeja de propuestas ciudadanas
│   │   ├── timeline/          # Gestión de hitos y cronograma
│   │   ├── layout.tsx         # Layout con sidebar del panel CMS
│   │   └── page.tsx           # Dashboard principal administrativo
│   ├── api/
│   │   └── news/route.ts      # API proxy de noticias con cache y fallback
│   ├── globals.css            # Estilos globales y utilidades Tailwind
│   ├── layout.tsx             # Layout raíz del portal
│   └── page.tsx               # Landing page principal
├── components/                # Componentes modulares de interfaz
│   ├── AnimatedIsologo.tsx    # Componente 3D Canvas / Three.js
│   ├── CitizenFeedback.tsx    # Formulario de propuestas ciudadanas
│   ├── Concepts.tsx           # Acordeón de conceptos
│   ├── DocumentHub.tsx        # Repositorio documental público
│   ├── Header.tsx / Footer.tsx# Encabezado y pie de página
│   ├── Hero.tsx               # Sección hero principal
│   ├── InteractiveNewsGallery3.tsx # Galería de noticias avanzada
│   ├── Monitor.tsx            # Mapa interactivo de Bolivia
│   ├── MultimediaHub.tsx      # Hub de podcasts/videos/audios
│   ├── Pillars.tsx            # Pilares de autonomía
│   ├── ThemeProvider.tsx      # Gestor de tema claro/oscuro
│   └── Timeline.tsx           # Línea de tiempo de hitos
├── lib/
│   ├── actions/               # Server Actions de Next.js (mutaciones seguras)
│   ├── agenda-data.ts         # Datos estáticos iniciales y tipos TypeScript
│   ├── auth.ts                # Utilidades de hashing y verificación de sesión
│   ├── data-service.ts        # Servicio de consulta con fallback a memoria
│   ├── db.ts                  # Instancia singleton de PrismaClient
│   ├── mailer.ts              # Envío de correos SMTP
│   ├── news-service.ts        # Cliente de integración de noticias
│   ├── sync-seeds.ts          # Sincronización entre base de datos y esquema
│   └── uploads.ts             # Almacenamiento de archivos en disco local
├── middleware.ts              # Middleware para protección de rutas /admin
├── prisma/
│   ├── dev.db                 # Base de datos SQLite (almacén de datos)
│   └── schema.prisma          # Definición de modelos relacionales
├── public/
│   ├── Acuerdo-001-2026-Agenda-50-50.pdf # Documento PDF oficial
│   ├── assets/                # Isologos vectoriales, logos y sellos
│   ├── uploads/               # Archivos subidos desde el CMS (PDFs, audios)
│   └── videos/                # Recursos multimedia locales
├── scripts/
│   └── seed.ts                # Inicialización de datos por defecto
├── package.json
└── tailwind.config.ts
```

---

## 🔐 Variables de Entorno

Crear un archivo `.env` o `.env.local` en la raíz del proyecto:

```env
# ==============================================================================
# Variables de Entorno - Portal Agenda 50/50
# ==============================================================================

# Conexión de Base de Datos SQLite (Ruta relativa o absoluta)
DATABASE_URL="file:./dev.db"

# Clave secreta para firmar tokens JWT de sesión del panel administrativo
JWT_SECRET="agenda-5050-super-secret-key-sucre-2026"

# Integración con el feed de noticias externo
NEXT_PUBLIC_NEWS_API_URL="https://seamovil.com/noticias/api/agenda5050.php"
NEWS_INTERNAL_API_URL="https://seamovil.com/noticias/api/agenda5050.php"
NEWS_API_TOKEN="sea_agenda_5050_secure_token_2026"

# Configuración opcional de correo SMTP (puede configurarse también en BD)
# SMTP_HOST="mail.tudominio.gob.bo"
# SMTP_PORT=587
# SMTP_USER="notificaciones@tudominio.gob.bo"
# SMTP_PASS="tu_contraseña_smtp"
# SMTP_FROM="Agenda 50/50 <notificaciones@tudominio.gob.bo>"
```

> **IMPORTANTE**: Para un servidor en producción, cambie el valor de `JWT_SECRET` por una cadena aleatoria y segura de al menos 32 caracteres.

---

## 🚀 Guía Paso a Paso para Despliegue en un Servidor Nuevo

Esta guía está diseñada para desplegar el portal en cualquier servidor Linux (Ubuntu 20.04/22.04/24.04, Debian 11/12, Rocky Linux o similares).

### Paso 1: Requisitos del Servidor
Conectarse al servidor mediante SSH como usuario con privilegios `sudo`:

```bash
# Actualizar repositorios
sudo apt update && sudo apt upgrade -y

# Instalar dependencias básicas (Git, SQLite, herramientas de compilación)
sudo apt install -y git curl wget sqlite3 build-essential

# Instalar Node.js v20 LTS mediante NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar versiones
node -v   # Debe responder v20.x.x
npm -v    # Debe responder v10.x.x

# Instalar PM2 de manera global para gestión de procesos en segundo plano
sudo npm install -g pm2
```

---

### Paso 2: Clonación del Repositorio
Clonar el proyecto en el directorio web deseado (por ejemplo `/var/www/agenda5050` o `/www/wwwroot/5050`):

```bash
sudo mkdir -p /var/www/agenda5050
sudo chown -R $USER:$USER /var/www/agenda5050
cd /var/www/agenda5050

# Clonar mediante Git
git clone https://github.com/smallnetbo/5050.git .
```

---

### Paso 3: Instalación de Dependencias
Instalar las dependencias de Node.js:

```bash
npm install
```

---

### Paso 4: Variables de Entorno
Crear el archivo `.env.local`:

```bash
nano .env.local
```

Pegar el contenido configurando tus valores:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="genera_una_clave_aleatoria_y_robusta_para_produccion"

NEXT_PUBLIC_NEWS_API_URL="https://seamovil.com/noticias/api/agenda5050.php"
NEWS_INTERNAL_API_URL="https://seamovil.com/noticias/api/agenda5050.php"
NEWS_API_TOKEN="sea_agenda_5050_secure_token_2026"
```

Guardar y cerrar (`Ctrl + O`, `Enter`, `Ctrl + X`).

---

### Paso 5: Base de Datos y Semillas (Prisma & SQLite)
Inicializar el cliente de Prisma, crear las tablas en SQLite y poblar los datos iniciales:

```bash
# 1. Generar cliente de Prisma
npm run db:generate

# 2. Sincronizar el esquema con la base de datos SQLite (crea dev.db automáticamente)
npm run db:push

# 3. Poblar las tablas con los datos base oficiales y crear el usuario administrador inicial
npm run db:seed
```

> **Nota:** Si prefieres usar comandos `npx` directos:
> - `npx prisma generate`
> - `npx prisma db push`
> - `npx tsx scripts/seed.ts`

---

### Paso 6: Carpetas de Subidas y Archivos Clave
Asegurar que existan las carpetas donde el panel administrativo guarda documentos y multimedia subidos:

```bash
# Crear carpetas de uploads si no existen
mkdir -p public/uploads/documents
mkdir -p public/uploads/multimedia

# Asegurar permisos de lectura y escritura para el proceso de Node
chmod -R 775 public/uploads
chmod -R 775 prisma
```

#### Archivo PDF Oficial:
Verificar que el PDF oficial del Acuerdo esté presente en:
```text
public/Acuerdo-001-2026-Agenda-50-50.pdf
```
*(Si no estuviera presente, copiar el archivo PDF oficial con ese nombre exacto dentro de la carpeta `public/`)*.

---

### Paso 7: Compilación de Producción
Generar el paquete optimizado de Next.js para producción:

```bash
npm run build
```

Si la compilación finaliza exitosamente con `Compiled successfully`, el proyecto está listo para ser servido.

---

### Paso 8: Configuración de PM2 (Daemon)

Para mantener la aplicación en ejecución constante, que reinicie automáticamente ante fallos o tras reiniciar el servidor:

1. Crear el archivo `ecosystem.config.js` en la raíz del proyecto:

```javascript
module.exports = {
  apps: [
    {
      name: "agenda-5050",
      script: "node_modules/.bin/next",
      args: "start -p 3010",
      cwd: "/var/www/agenda5050", // Ajustar a la ruta real de tu servidor
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3010
      }
    }
  ]
};
```

2. Iniciar la aplicación con PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
*(Ejecutar el comando de entorno que imprima `pm2 startup` para asegurar el arranque automático).*

3. Comandos útiles de PM2:
```bash
pm2 status               # Ver estado del proceso
pm2 logs agenda-5050     # Ver logs en tiempo real
pm2 restart agenda-5050  # Reiniciar el portal
pm2 reload agenda-5050   # Recargar sin caída de servicio
```

---

### Paso 9: Configuración de Proxy Inverso en Nginx

Instalar Nginx si aún no está instalado:

```bash
sudo apt install -y nginx
```

Crear un bloque de configuración para el sitio (ejemplo `/etc/nginx/sites-available/agenda5050.conf`):

```nginx
server {
    listen 80;
    server_name agenda5050.gob.bo www.agenda5050.gob.bo; # Reemplazar con tu dominio o IP

    # Límite de carga para archivos PDF y videos en el panel administrativo
    client_max_body_size 64M;

    # Compresión gzip
    gzip on;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;

        # Soporte para WebSockets y Server-Sent Events
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Headers originales del cliente
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts generosos para subidas de archivos
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }

    # Cache para archivos estáticos de Next.js
    location /_next/static {
        proxy_pass http://127.0.0.1:3010;
        proxy_cache_bypass $http_upgrade;
        expires 365d;
        access_log off;
    }

    # Archivos públicos de subidas
    location /uploads/ {
        alias /var/www/agenda5050/public/uploads/;
        expires 30d;
        access_log off;
    }
}
```

Habilitar el sitio y reiniciar Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/agenda5050.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Paso 10: Certificado SSL con Let's Encrypt

Para habilitar HTTPS de manera gratuita y automática:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d agenda5050.gob.bo -d www.agenda5050.gob.bo
```

Certbot renovará automáticamente los certificados antes de que expiren.

---

### Despliegue Alternativo en Servidores con aaPanel

Si el nuevo servidor utiliza **aaPanel** (igual que el entorno de desarrollo actual):

1. **Crear Sitio Node**:
   - Ir a **Website** > **Node project** > **Add Node Project**.
   - **Path**: Seleccionar el directorio donde está el proyecto (ej. `/www/wwwroot/5050`).
   - **Run Opt**: `npm run start` (o seleccionar `start` en Scripts).
   - **Port**: `3010`.
   - **Node Version**: Seleccionar Node 20.x.
2. **Terminal de aaPanel**:
   - Abrir terminal en la carpeta del proyecto y ejecutar:
     ```bash
     npm install
     npm run db:push
     npm run db:seed
     npm run build
     ```
3. **Mapeo / Reverse Proxy**:
   - En la configuración del sitio en aaPanel, verificar que el proxy apunte a `http://127.0.0.1:3010`.
   - Asignar el dominio y activar el certificado SSL con Let's Encrypt desde la pestaña **SSL**.

---

## 🔑 Credenciales Administrativas por Defecto

Una vez ejecutado el comando de semillas (`npm run db:seed`), se genera el usuario inicial:

| Campo | Valor Inicial |
| :--- | :--- |
| **URL de Acceso** | `https://tu-dominio.com/admin/login` |
| **Correo Electrónico** | `admin@agenda5050.gob.bo` |
| **Contraseña** | `Admin50502026!` |

> ⚠️ **RECOMENDACIÓN CRÍTICA DE SEGURIDAD**:
> Al iniciar sesión por primera vez, ingrese inmediatamente a **Mi Perfil & Seguridad** (`/admin/profile`) y actualice tanto el correo electrónico como la contraseña por una combinación robusta.

---

## 🛠️ Mantenimiento, Respaldos y Actualizaciones

### Cómo Aplicar Actualizaciones de Código (Git Pull)
Cuando existan cambios en el repositorio oficial:

```bash
cd /var/www/agenda5050

# 1. Traer los últimos cambios
git pull origin main

# 2. Instalar posibles nuevas dependencias
npm install

# 3. Aplicar migraciones o cambios en el esquema de BD si los hubiera
npm run db:push

# 4. Recompilar Next.js
npm run build

# 5. Recargar la aplicación sin caída de servicio
pm2 reload agenda-5050
```

### Respaldos de la Base de Datos y Archivos
Toda la información dinámica se almacena en dos ubicaciones:
1. `prisma/dev.db` (Base de datos SQLite: usuarios, propuestas, hitos, configuración, multimedia).
2. `public/uploads/` (Archivos PDF y recursos subidos).

Script rápido para crear un backup comprimido diario:
```bash
tar -czvf /backup/agenda5050_backup_$(date +%F).tar.gz prisma/dev.db public/uploads .env.local
```

---

## ❓ Resolución de Problemas Frecuentes

1. **Error: `Port 3010 is already in use`**:
   - Verificar qué proceso está ocupando el puerto: `lsof -i :3010` o `netstat -tulnp | grep 3010`.
   - Detener el proceso previo o cambiar el puerto en `package.json` (`-p 3010`) y en la configuración de Nginx.

2. **Error al subir archivos en el CMS (`Permission denied`)**:
   - Asegurarse de que el usuario que ejecuta Node tenga permisos sobre `public/uploads`:
     ```bash
     chmod -R 775 public/uploads
     ```

3. **La base de datos SQLite dice `database is locked`**:
   - Ocurre si múltiples procesos acceden simultáneamente en modo de escritura sin liberar la conexión. Asegurarse de que la aplicación solo se ejecute con 1 instancia en PM2 (`instances: 1`), ya que SQLite maneja concurrencia de lectura pero requiere bloqueo exclusivo por escritura.

4. **El feed de noticias muestra el mensaje de respaldo**:
   - Si la API externa no está disponible, el sistema cambia automáticamente al modo fallback local sin romper la interfaz del usuario. Para revisar la conexión con la API externa, verifique el token y las URLs en el `.env.local`.

---

© 2026 Agenda 50/50 — Sucre, Bolivia. Desarrollado para la transparencia activa y el fortalecimiento de las autonomías departamentales.
