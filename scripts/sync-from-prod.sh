#!/bin/bash

# Sincroniza la base de datos SQLite y los archivos subidos desde Producción hacia Desarrollo.
# Uso:
#   PROD_HOST=agenda50-50.sea.gob.bo PROD_USER=root PROD_PATH=/www/wwwroot/sea/5050 bash scripts/sync-from-prod.sh
# O pasando los valores como argumentos:
#   bash scripts/sync-from-prod.sh <usuario@servidor> <ruta_remota>

set -e

REMOTE="${1:-${PROD_USER:-root}@${PROD_HOST:-agenda50-50.sea.gob.bo}}"
REMOTE_PATH="${2:-${PROD_PATH:-/www/wwwroot/sea/5050}}"

LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=== Sincronizando datos desde Producción ($REMOTE:$REMOTE_PATH) ==="

if [ -f "$LOCAL_DIR/prisma/dev.db" ]; then
  BACKUP_LOCAL="$LOCAL_DIR/prisma/dev.db.bak.$(date +%Y%m%d-%H%M%S)"
  cp "$LOCAL_DIR/prisma/dev.db" "$BACKUP_LOCAL"
  echo "Respaldo local creado en: $BACKUP_LOCAL"
fi

echo "1/3: Descargando base de datos (prisma/dev.db)..."
rsync -avz --progress "$REMOTE:$REMOTE_PATH/prisma/dev.db*" "$LOCAL_DIR/prisma/"

echo "2/3: Descargando archivos subidos (public/uploads/)..."
mkdir -p "$LOCAL_DIR/public/uploads"
rsync -avz --delete --progress "$REMOTE:$REMOTE_PATH/public/uploads/" "$LOCAL_DIR/public/uploads/"

echo "3/3: Actualizando cliente Prisma local..."
cd "$LOCAL_DIR"
npx prisma generate

echo "=== Sincronización completada con éxito ==="
