#!/bin/bash

# Detener la ejecución si algún comando falla
set -e

echo "=== Iniciando actualización de Agenda 50/50 ==="

BACKUP_DIR="/tmp/agenda5050-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "0/5: Respaldando base de datos y archivos subidos..."
if [ -f "prisma/dev.db" ]; then
  cp prisma/dev.db* "$BACKUP_DIR/" 2>/dev/null || true
fi
if [ -d "public/uploads" ]; then
  cp -r public/uploads "$BACKUP_DIR/uploads"
fi

echo "1/5: Descargando últimos cambios de GitHub..."
REMOTE_NAME="origin"
if git remote | grep -q "^github$"; then
  REMOTE_NAME="github"
fi
git fetch "$REMOTE_NAME"
git reset --hard "$REMOTE_NAME/nueva_estructura"

# Restaurar datos si fueron eliminados durante una transición de Git
if [ ! -f "prisma/dev.db" ] && [ -f "$BACKUP_DIR/dev.db" ]; then
  echo "Restaurando prisma/dev.db desde respaldo..."
  cp "$BACKUP_DIR"/dev.db* prisma/ 2>/dev/null || true
fi
if [ ! -d "public/uploads" ] && [ -d "$BACKUP_DIR/uploads" ]; then
  echo "Restaurando public/uploads desde respaldo..."
  cp -r "$BACKUP_DIR/uploads" public/uploads
fi

echo "2/5: Instalando dependencias (si hay nuevas)..."
npm install

echo "3/5: Aplicando esquema de Prisma (sin borrar datos)..."
npx prisma generate
npx prisma db push

echo "4/5: Compilando la versión de producción..."
npm run build

echo "5/5: Reiniciando el servicio PM2..."
pm2 restart agenda-5050

echo "=== Actualización completada con éxito (respaldo en $BACKUP_DIR) ==="
