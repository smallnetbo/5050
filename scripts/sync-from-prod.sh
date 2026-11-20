#!/bin/bash

# Sincroniza la base de datos SQLite y los archivos subidos desde Producción hacia Desarrollo por HTTPS.
# No requiere acceso SSH al servidor de producción (ideal cuando está detrás de Guacamole/firewall).
#
# Requisitos:
#   Definir SYNC_TOKEN en .env.local (o como variable de entorno) igual en Producción y Desarrollo.
# Uso:
#   npm run sync:prod
#   PROD_URL=https://agenda50-50.sea.gob.bo SYNC_TOKEN=... bash scripts/sync-from-prod.sh

set -e

LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Cargar SYNC_TOKEN desde .env o .env.local si no está en el entorno
if [ -z "$SYNC_TOKEN" ] && [ -f "$LOCAL_DIR/.env.local" ]; then
  SYNC_TOKEN=$(grep -E '^SYNC_TOKEN=' "$LOCAL_DIR/.env.local" | tail -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'")
fi
if [ -z "$SYNC_TOKEN" ] && [ -f "$LOCAL_DIR/.env" ]; then
  SYNC_TOKEN=$(grep -E '^SYNC_TOKEN=' "$LOCAL_DIR/.env" | tail -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'")
fi

PROD_URL="${1:-${PROD_URL:-https://agenda50-50.sea.gob.bo}}"
ENDPOINT="${PROD_URL%/}/api/admin/sync-export"

if [ -z "$SYNC_TOKEN" ]; then
  echo "Error: SYNC_TOKEN no está definido. Agrégalo en .env.local o pásalo como variable de entorno."
  exit 1
fi

echo "=== Sincronizando datos desde Producción ($ENDPOINT) ==="

TMP_ARCHIVE="$(mktemp /tmp/agenda5050-sync-XXXXXX.tar.gz)"
trap 'rm -f "$TMP_ARCHIVE"' EXIT

echo "1/4: Descargando paquete de datos por HTTPS..."
HTTP_CODE=$(curl -sS -w "%{http_code}" -H "Authorization: Bearer $SYNC_TOKEN" -o "$TMP_ARCHIVE" "$ENDPOINT")

if [ "$HTTP_CODE" != "200" ]; then
  echo "Error: El servidor respondió con HTTP $HTTP_CODE"
  cat "$TMP_ARCHIVE" 2>/dev/null || true
  echo ""
  exit 1
fi

echo "2/4: Verificando integridad del archivo descargado..."
tar -tzf "$TMP_ARCHIVE" >/dev/null

if [ -f "$LOCAL_DIR/prisma/dev.db" ]; then
  BACKUP_LOCAL="$LOCAL_DIR/prisma/dev.db.bak.$(date +%Y%m%d-%H%M%S)"
  cp "$LOCAL_DIR/prisma/dev.db" "$BACKUP_LOCAL"
  echo "Respaldo local creado en: $BACKUP_LOCAL"
fi

echo "3/4: Extrayendo prisma/dev.db y public/uploads/..."
rm -f "$LOCAL_DIR/prisma/dev.db-wal" "$LOCAL_DIR/prisma/dev.db-shm" "$LOCAL_DIR/prisma/dev.db-journal"
tar -xzf "$TMP_ARCHIVE" -C "$LOCAL_DIR"

echo "4/4: Actualizando cliente Prisma local..."
cd "$LOCAL_DIR"
npx prisma generate

echo "=== Sincronización completada con éxito ==="
