const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

async function generatePDF() {
  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Agenda 50/50 - Instructivo de Despliegue en Producción</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      font-size: 11pt;
      background: #ffffff;
    }
    .header {
      border-bottom: 2px solid #0F2942;
      padding-bottom: 14px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .badge {
      display: inline-block;
      background: #ecfdf5;
      border: 1px solid #10b981;
      color: #065f46;
      font-weight: 800;
      font-size: 8.5pt;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    h1 {
      font-size: 19pt;
      color: #0F2942;
      font-weight: 900;
      line-height: 1.2;
    }
    .subtitle {
      font-size: 10pt;
      color: #64748b;
      margin-top: 4px;
      font-weight: 500;
    }
    .meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      font-size: 9pt;
    }
    .meta-item strong {
      color: #0F2942;
      display: block;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h2 {
      font-size: 13pt;
      color: #0F2942;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 5px;
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: 800;
      page-break-after: avoid;
    }
    h3 {
      font-size: 11pt;
      color: #047857;
      margin-top: 14px;
      margin-bottom: 6px;
      font-weight: 700;
      page-break-after: avoid;
    }
    p {
      margin-bottom: 8px;
      font-size: 10pt;
      color: #334155;
    }
    ul, ol {
      margin-left: 20px;
      margin-bottom: 12px;
      font-size: 10pt;
      color: #334155;
    }
    li {
      margin-bottom: 4px;
    }
    pre {
      background: #0F172A;
      color: #f1f5f9;
      padding: 10px 12px;
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8.5pt;
      overflow-x: auto;
      margin: 8px 0 12px 0;
      line-height: 1.45;
      page-break-inside: avoid;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8.5pt;
      background: #f1f5f9;
      color: #0F2942;
      padding: 2px 5px;
      border-radius: 4px;
      font-weight: 600;
    }
    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
      font-weight: normal;
    }
    .alert {
      padding: 10px 14px;
      border-radius: 8px;
      margin: 12px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    .alert-warning {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      color: #92400e;
    }
    .alert-info {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      color: #1e40af;
    }
    .alert-success {
      background: #f0fdf4;
      border-left: 4px solid #10b981;
      color: #166534;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      color: #0F2942;
      font-weight: 700;
    }
    .footer {
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      font-size: 8pt;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <span class="badge">Instructivo Técnico · Servidor de Producción</span>
      <h1>Agenda 50/50 — Guía de Despliegue</h1>
      <div class="subtitle">Consideraciones de Servidor Web, Permisos del Sistema Operativo y Procedimiento de Actualización</div>
    </div>
  </div>

  <div class="meta-box">
    <div class="meta-item">
      <strong>Plataforma</strong>
      Agenda 50/50 (Sucre 2026)
    </div>
    <div class="meta-item">
      <strong>Destinatario</strong>
      Administrador de Servidor / DevOps
    </div>
    <div class="meta-item">
      <strong>Versión / Fecha</strong>
      Release Octubre 2026
    </div>
  </div>

  <h2>1. Configuración del Servidor Web (Nginx / Apache)</h2>
  <p>
    En la versión actual de la plataforma, se ha habilitado la subida de archivos pesados (videos MP4 de hasta 500 MB y documentos normativos). Para que las solicitudes no sean rechazadas por el proxy inverso antes de alcanzar la aplicación Node.js, es imperativo actualizar la configuración del servidor web:
  </p>

  <h3>A. En Nginx (Recomendado)</h3>
  <p>
    En el archivo de configuración del sitio (o en el bloque <code>server</code> en <code>/etc/nginx/sites-available/</code> o en aaPanel en <code>/www/server/panel/vhost/nginx/node_5050.conf</code>):
  </p>
  <pre><code># 1. Ampliar el tamaño máximo de cuerpo permitido a 500 MB
client_max_body_size 500m;

# 2. Configurar timeouts generosos para subidas lentas o archivos grandes
proxy_read_timeout 300s;
proxy_send_timeout 300s;
client_body_timeout 300s;
proxy_connect_timeout 60s;</code></pre>

  <p>Verifique la sintaxis y recargue el servicio Nginx:</p>
  <pre><code>nginx -t
systemctl reload nginx  # o: service nginx reload</code></pre>

  <h3>B. Configuración de Next.js (Ya incluida en el repositorio)</h3>
  <p>
    El repositorio ya incorpora el archivo <code>next.config.mjs</code> que amplía la recepción tanto de Server Actions como de Middleware:
  </p>
  <pre><code>/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
    middlewareClientMaxBodySize: '500mb',
  },
};
export default nextConfig;</code></pre>

  <h2>2. Permisos de Archivos y Carpetas en el Sistema Operativo</h2>
  <p>
    El proceso de ejecución de Node.js normalmente corre bajo el usuario del sistema web (por ejemplo <code>www:www</code> o <code>node:node</code>). Es fundamental garantizar los permisos de escritura sobre dos áreas críticas:
  </p>

  <div class="alert alert-warning">
    <strong>¡Alerta Crítica con SQLite!</strong> Si el directorio <code>prisma/</code> o el archivo <code>dev.db</code> tienen como propietario a <code>root</code> con permisos de solo lectura, la base de datos arrojará el error <code>SqliteError: attempt to write a readonly database</code> al intentar iniciar sesión o registrar datos.
  </div>

  <h3>A. Base de Datos SQLite (Directorio prisma/)</h3>
  <pre><code># Asignar propietario al usuario del servidor web (ej. www)
chown -R www:www /ruta-al-proyecto/prisma

# Permisos de lectura/escritura/ejecución al directorio y base de datos
chmod 775 /ruta-al-proyecto/prisma
chmod 664 /ruta-al-proyecto/prisma/dev.db</code></pre>

  <h3>B. Directorio de Almacenamiento de Archivos (public/uploads/)</h3>
  <pre><code># Crear las carpetas de subida si no existieran
mkdir -p /ruta-al-proyecto/public/uploads/multimedia
mkdir -p /ruta-al-proyecto/public/uploads/documents

# Asignar propiedad y permisos de escritura recursivos
chown -R www:www /ruta-al-proyecto/public/uploads
chmod -R 775 /ruta-al-proyecto/public/uploads</code></pre>

  <h2>3. Procedimiento Paso a Paso para Despliegue en Producción</h2>

  <div class="alert alert-info">
    <strong>Recomendación Preventiva:</strong> Antes de actualizar el código, realice un respaldo inmediato de la base de datos de producción existente para proteger la información registrada por los usuarios.
  </div>

  <p>Ejecute en la terminal del servidor de producción:</p>

  <pre><code>cd /ruta-al-proyecto

# PASO 1: Respaldo preventivo de la base de datos SQLite
cp prisma/dev.db prisma/dev.db.backup_$(date +%Y%m%d_%H%M%S)

# PASO 2: Descargar las actualizaciones del repositorio oficial
git pull origin develop  # o main según la rama de producción

# PASO 3: Instalar o sincronizar paquetes de dependencias
npm install

# PASO 4: Asegurar propiedad y permisos del usuario web (www)
chown -R www:www .
chmod 775 prisma public/uploads
chmod 664 prisma/dev.db

# PASO 5: Compilar la aplicación para producción con los nuevos límites
npm run build

# PASO 6: Reiniciar el servicio
# Opción A (aaPanel): Reiniciar desde la pestaña "Node project" -> Restart
# Opción B (PM2):
pm2 restart 5050  # o: pm2 reload 5050
# Opción C (systemd):
systemctl restart agenda5050</code></pre>

  <h2>4. Mejoras y Funcionalidades Incluidas en Esta Versión</h2>
  <table>
    <thead>
      <tr>
        <th>Módulo / Componente</th>
        <th>Cambio Realizado</th>
        <th>Impacto Operativo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Límites de Carga</strong></td>
        <td>Ampliación a 500 MB en <code>next.config.mjs</code>.</td>
        <td>Permite subir videos MP4 de 70 MB a 500 MB sin error 413.</td>
      </tr>
      <tr>
        <td><strong>Indicador de Progreso</strong></td>
        <td>Ruta <code>/api/admin/upload</code> con XMLHttpRequest.</td>
        <td>Barra de progreso animada en tiempo real (0% a 100%) y detalle de MBs.</td>
      </tr>
      <tr>
        <td><strong>Co-construcción Ciudadana</strong></td>
        <td>Sustitución de FAQ por el concepto oficial 50/50.</td>
        <td>Narrativa clara sobre descentralización, competencias y diálogo plural.</td>
      </tr>
      <tr>
        <td><strong>Menú Superior y Footer</strong></td>
        <td>Reemplazo de "FAQ" por icono de correo directo.</td>
        <td>Enlace directo al buzón de aportes y consultas ciudadanas.</td>
      </tr>
      <tr>
        <td><strong>Seguridad en Login</strong></td>
        <td>Aislamiento de la actualización de <code>lastLoginAt</code>.</td>
        <td>Evita que fallos de bloqueo en disco impidan el inicio de sesión.</td>
      </tr>
    </tbody>
  </table>

  <h2>5. Verificación y Validación Post-Despliegue</h2>
  <ol>
    <li><strong>Acceso al Panel:</strong> Ingrese a <code>https://tu-dominio.com/admin/login</code> y compruebe el inicio de sesión exitoso.</li>
    <li><strong>Prueba de Subida de Video:</strong> Diríjase a <em>Multimedia</em> &gt; <em>Nuevo Recurso</em>, seleccione un video MP4 de prueba y verifique que la barra de progreso muestre el avance en porcentaje y megabytes.</li>
    <li><strong>Verificación Pública:</strong> Acceda a la portada principal y verifique que la sección inferior muestre <em>Co-construcción de la Agenda 50/50</em> y que el menú superior contenga el icono de correo.</li>
  </ol>

  <div class="footer">
    <span>Agenda 50/50 — Servicio Estatal de Autonomías (SEA)</span>
    <span>Documento Técnico Interno de Operaciones</span>
  </div>

</body>
</html>
`;

  console.log("Iniciando navegador headless para generar PDF...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const outputPathRoot = path.join(__dirname, "..", "INSTRUCTIVO_DESPLIEGUE_PRODUCCION.pdf");
  const outputPathPublic = path.join(__dirname, "..", "public", "INSTRUCTIVO_DESPLIEGUE_PRODUCCION.pdf");

  await page.pdf({
    path: outputPathRoot,
    format: "A4",
    printBackground: true,
    margin: {
      top: "16mm",
      bottom: "16mm",
      left: "14mm",
      right: "14mm",
    },
  });

  // Copiar también a public para que sea descargable desde la web
  fs.copyFileSync(outputPathRoot, outputPathPublic);

  await browser.close();
  console.log("✅ PDF generado exitosamente en:");
  console.log(" - " + outputPathRoot);
  console.log(" - " + outputPathPublic);
}

generatePDF().catch((err) => {
  console.error("Error generando PDF:", err);
  process.exit(1);
});
