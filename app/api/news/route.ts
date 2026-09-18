import { NextResponse } from "next/server";
import { newsArticles as localFallbackArticles } from "@/lib/agenda-data";

const NEWS_API_ENDPOINT =
  process.env.NEWS_INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_NEWS_API_URL ||
  "https://seamovil.com/noticias/api/agenda5050.php";

const API_TOKEN = process.env.NEWS_API_TOKEN || "sea_agenda_5050_secure_token_2026";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "30";
  const department = searchParams.get("department") || "Todos";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout on server side

  try {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (department && department !== "Todos") {
      params.set("department", department);
    }

    const res = await fetch(`${NEWS_API_ENDPOINT}?${params.toString()}`, {
      headers: {
        "X-Internal-Token": API_TOKEN,
        Accept: "application/json",
      },
      next: {
        revalidate: 180, // Revalidación en servidor cada 3 minutos
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=600",
      },
    });
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn("[API /api/news] Error al consultar API externa de noticias, usando fallback:", error?.message || error);

    const fallbackList = localFallbackArticles.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      url: "#descargas",
      imageUrl: item.imageUrl,
      source: "Secretaría de Coordinación",
      department: item.department,
      publishedAt: new Date().toISOString(),
      tags: ["50/50", "Autonomías"],
    }));

    return NextResponse.json({
      ok: false,
      articles: fallbackList,
      page: 1,
      limit: fallbackList.length,
      total: fallbackList.length,
      totalPages: 1,
      hasMore: false,
      isFallback: true,
      errorMessage: "Feed en vivo en proceso de sincronización.",
    });
  }
}
