export interface UploadProgressEvent {
  percent: number;
  loaded: number;
  total: number;
}

/**
 * Sube un archivo a través de XMLHttpRequest para obtener progreso real (0 - 100%)
 */
export function uploadFileWithProgress(
  file: File,
  folder: string = "multimedia",
  onProgress?: (progress: UploadProgressEvent) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    if (xhr.upload && onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && e.total > 0) {
          const percent = Math.min(100, Math.round((e.loaded / e.total) * 100));
          onProgress({ percent, loaded: e.loaded, total: e.total });
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success && data.fileUrl) {
            resolve(data.fileUrl);
          } else {
            reject(new Error(data.error || "Error al procesar el archivo en el servidor."));
          }
        } catch {
          reject(new Error("Respuesta inválida recibida del servidor."));
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          reject(new Error(data.error || `Error del servidor HTTP ${xhr.status}`));
        } catch {
          reject(new Error(`Error del servidor HTTP ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Error de conexión durante la subida del archivo. Verifique su red."));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("La subida fue cancelada."));
    });

    xhr.open("POST", "/api/admin/upload");
    xhr.send(formData);
  });
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
