import { newsArticles as localFallbackArticles } from "./agenda-data";

export interface AgendaNewsArticle {
  id: number | string;
  title: string;
  summary: string | null;
  url: string;
  imageUrl: string | null;
  source: string;
  department: string;
  publishedAt: string;
  tags?: string[];
}

export interface NewsResponse {
  ok: boolean;
  articles: AgendaNewsArticle[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  isFallback: boolean;
  errorMessage?: string;
}

const NEWS_API_ENDPOINT =
  process.env.NEWS_INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_NEWS_API_URL ||
  "https://seamovil.com/noticias/api/agenda5050.php";

const API_TOKEN = process.env.NEWS_API_TOKEN || "sea_agenda_5050_secure_token_2026";

/**
 * Tabla de parches y correcciones para enlaces rotos o enlaces reestructurados por los medios de comunicación.
 */
const KNOWN_URL_CORRECTIONS: Record<string, string> = {
  // Corrección para la noticia de Brújula Digital del 03/09/2026
  "https://brujuladigital.net/economia/2026/09/03/dialogos-al-cafelas-autonomias-y-la-agenda-5050":
    "https://brujuladigital.net/economia/2026/09/03/dialogos-al-cafelas-autonomias-y-la-agenda-5050-65863",
};

/**
 * Sanitiza y aplica parches a los artículos de noticias para corregir enlaces rotos o desactualizados.
 */
export function sanitizeArticleUrl(article: AgendaNewsArticle): AgendaNewsArticle {
  if (!article) return article;

  let fixedUrl = article.url;

  // 1. Verificación por tabla de parches directos
  if (fixedUrl && KNOWN_URL_CORRECTIONS[fixedUrl]) {
    fixedUrl = KNOWN_URL_CORRECTIONS[fixedUrl];
  }

  // 2. Regla de resolución para la noticia específica "DIÁLOGOS AL CAFÉ" (03/09/2026)
  if (
    article.title &&
    (article.title.toUpperCase().includes("DIÁLOGOS AL CAFÉ") || article.title.includes("Las autonomías y la agenda 50/50"))
  ) {
    fixedUrl = "https://brujuladigital.net/economia/2026/09/03/dialogos-al-cafelas-autonomias-y-la-agenda-5050-65863";
  }

  // 3. Regla de resolución para Bolivia TV (boliviatv.bo): corregir enlaces sin "/principal/" que causan error 404
  if (fixedUrl && fixedUrl.includes("boliviatv.bo/") && !fixedUrl.includes("/principal/nota.php")) {
    fixedUrl = fixedUrl.replace("boliviatv.bo/nota.php", "boliviatv.bo/principal/nota.php");
  }

  return {
    ...article,
    url: fixedUrl,
  };
}

/**
 * Obtiene las noticias 50/50 paginadas desde seamovil.com con revalidación en caché y protección ante fallos.
 */
export async function getAgenda5050News(
  page: number = 1,
  limit: number = 12,
  department: string = "Todos"
): Promise<NewsResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (department && department !== "Todos") {
      params.set("department", department);
    }

    const res = await fetch(`${NEWS_API_ENDPOINT}?${params.toString()}`, {
      headers: {
        "X-Internal-Token": API_TOKEN,
        Accept: "application/json",
      },
      next: {
        revalidate: 300, // Revalidación ISR cada 5 minutos
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || !data.ok || !Array.isArray(data.articles)) {
      throw new Error("Formato de respuesta inválido");
    }

    const sanitizedArticles = data.articles.map(sanitizeArticleUrl);

    return {
      ok: true,
      articles: sanitizedArticles,
      page: Number(data.page) || page,
      limit: Number(data.limit) || limit,
      total: Number(data.total) || sanitizedArticles.length,
      totalPages: Number(data.totalPages) || 1,
      hasMore: Boolean(data.hasMore),
      isFallback: false,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn("[NewsService] Usando fallback local para noticias 50/50:", error?.message || error);

    // Mapeo seguro de fallback local si seamovil.com está en mantenimiento
    const fallbackList: AgendaNewsArticle[] = localFallbackArticles.map((item) =>
      sanitizeArticleUrl({
        id: item.id,
        title: item.title,
        summary: item.summary,
        url: "#descargas",
        imageUrl: item.imageUrl,
        source: "Secretaría de Coordinación",
        department: item.department,
        publishedAt: new Date().toISOString(),
        tags: ["50/50", "Autonomías"],
      })
    );

    return {
      ok: false,
      articles: fallbackList,
      page: 1,
      limit: fallbackList.length,
      total: fallbackList.length,
      totalPages: 1,
      hasMore: false,
      isFallback: true,
      errorMessage: "Feed en vivo en proceso de sincronización. Mostrando comunicados oficiales de contingencia.",
    };
  }
}

/**
 * Obtiene TODAS las noticias de la base de datos (desde la primera página hasta la última)
 * mediante peticiones en paralelo para garantizar la carga completa del histórico.
 */
export async function getAllAgenda5050News(department: string = "Todos"): Promise<AgendaNewsArticle[]> {
  try {
    const firstRes = await getAgenda5050News(1, 30, department);
    if (!firstRes.ok || !firstRes.articles || firstRes.articles.length === 0) {
      return (firstRes.articles || []).map(sanitizeArticleUrl);
    }

    const totalPages = Math.min(firstRes.totalPages || 1, 20); // Límite de seguridad
    let allArticles: AgendaNewsArticle[] = [...firstRes.articles];

    if (totalPages > 1) {
      const pageRequests = [];
      for (let p = 2; p <= totalPages; p++) {
        pageRequests.push(getAgenda5050News(p, 30, department));
      }

      const responses = await Promise.all(pageRequests);
      responses.forEach((res) => {
        if (res && res.articles && Array.isArray(res.articles)) {
          allArticles.push(...res.articles);
        }
      });
    }

    // Eliminar posibles duplicados por ID y sanitizar URLs
    const uniqueMap = new Map<string | number, AgendaNewsArticle>();
    allArticles.forEach((art) => {
      if (art && art.id) {
        uniqueMap.set(art.id, sanitizeArticleUrl(art));
      }
    });

    return Array.from(uniqueMap.values());
  } catch (err) {
    console.error("[NewsService] Error al obtener todo el historial de noticias:", err);
    const fallbackRes = await getAgenda5050News(1, 50, department);
    return (fallbackRes.articles || []).map(sanitizeArticleUrl);
  }
}


