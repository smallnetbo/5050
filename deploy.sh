#!/bin/bash

# Detener la ejecución si algún comando falla
set -e

echo "=== Iniciando actualización de Agenda 50/50 ==="

echo "1/4: Descargando últimos cambios de GitHub..."
#git pull github nueva_estructura
git fetch github
git reset --hard github/nueva_estructura

echo "2/4: Instalando dependencias (si hay nuevas)..."
npm install

echo "3/4: Compilando la versión de producción..."
npm run build

echo "4/4: Reiniciando el servicio PM2..."
pm2 restart agenda-5050

echo "=== Actualización completada con éxito ==="
