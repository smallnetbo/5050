"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { getAllAgenda5050News, AgendaNewsArticle } from "@/lib/news-service";
import {
  Calendar,
  ExternalLink,
  Newspaper,
  Radio,
  Tag,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  ArrowUpDown,
  MoveHorizontal,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";

// Backup images if news articles do not supply an image or texture load fails
const FALLBACK_NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=600&auto=format&fit=crop&q=80",
];

interface ChronoArticle extends AgendaNewsArticle {
  timestamp: number;
  formattedDateStr: string;
}

interface SpriteUserData {
  index: number;
  article: ChronoArticle;
  nodeX: number;
  nodeY: number;
  baseScaleX: number;
  baseScaleY: number;
}

export function InteractiveNewsGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [allArticles, setAllArticles] = useState<ChronoArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("Todos");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<ChronoArticle | null>(null);
  const [isAscending, setIsAscending] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);

  const cameraTargetXRef = useRef<number>(0);

  // Fetch and process chronological news articles
  useEffect(() => {
    let isMounted = true;

    async function loadChronologicalNews() {
      try {
        const rawList = await getAllAgenda5050News("Todos");
        if (!isMounted) return;

        const processed: ChronoArticle[] = (rawList || []).map((item, idx) => {
          const dateObj = item.publishedAt ? new Date(item.publishedAt) : new Date();
          const timestamp = isNaN(dateObj.getTime()) ? Date.now() - idx * 86400000 : dateObj.getTime();
          const formattedDateStr = !isNaN(dateObj.getTime())
            ? dateObj.toLocaleDateString("es-BO", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Fecha Reciente";

          return {
            ...item,
            timestamp,
            formattedDateStr,
            imageUrl: item.imageUrl || FALLBACK_NEWS_IMAGES[idx % FALLBACK_NEWS_IMAGES.length],
          };
        });

        setAllArticles(processed);
      } catch (err) {
        console.error("Error al cargar noticias para la línea de tiempo:", err);
      }
    }

    loadChronologicalNews();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & sort articles dynamically based on search query, department & order
  const displayArticles = useMemo(() => {
    let result = [...allArticles];

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          (art.summary && art.summary.toLowerCase().includes(q)) ||
          art.source.toLowerCase().includes(q) ||
          art.department.toLowerCase().includes(q)
      );
    }

    // Filter by department
    if (selectedDepartment !== "Todos") {
      result = result.filter((art) => art.department === selectedDepartment);
    }

    // Sort chronologically
    result.sort((a, b) => (isAscending ? a.timestamp - b.timestamp : b.timestamp - a.timestamp));

    return result;
  }, [allArticles, searchQuery, selectedDepartment, isAscending]);

  // Three.js Interactive 3D Timeline Engine
  useEffect(() => {
    if (displayArticles.length === 0) {
      setIsLoaded(true);
      return;
    }

    let animFrameId: number;
    let isMounted = true;
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight || 520;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(0, 0, 480);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x070b12, 1); // Deep solid dark background with zero white haze

    // Empty container before appending
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Timeline Axis Parameters
    const SPACING = 300;
    const endX = (displayArticles.length - 1) * SPACING;

    cameraTargetXRef.current = 0;
    let currentCameraX = 0;

    // 3. Central Axis Rail (High contrast neon line)
    const railGeometry = new THREE.BufferGeometry();
    const railPoints = [
      new THREE.Vector3(-500, 0, 0),
      new THREE.Vector3(endX + 500, 0, 0),
    ];
    railGeometry.setFromPoints(railPoints);

    const railMaterial = new THREE.LineBasicMaterial({
      color: 0x3ac167,
      linewidth: 3,
    });
    const railLine = new THREE.Line(railGeometry, railMaterial);
    scene.add(railLine);

    // Dotted Grid Lines
    const topGridPoints = [new THREE.Vector3(-500, 115, -40), new THREE.Vector3(endX + 500, 115, -40)];
    const topGridGeo = new THREE.BufferGeometry().setFromPoints(topGridPoints);
    const topGridMat = new THREE.LineDashedMaterial({
      color: 0x1e293b,
      dashSize: 12,
      gapSize: 6,
    });
    const topGridLine = new THREE.Line(topGridGeo, topGridMat);
    topGridLine.computeLineDistances();
    scene.add(topGridLine);

    const botGridPoints = [new THREE.Vector3(-500, -115, -40), new THREE.Vector3(endX + 500, -115, -40)];
    const botGridGeo = new THREE.BufferGeometry().setFromPoints(botGridPoints);
    const botGridLine = new THREE.Line(botGridGeo, topGridMat);
    botGridLine.computeLineDistances();
    scene.add(botGridLine);

    // Background Subtle Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      particlePos[p * 3] = (Math.random() - 0.2) * (endX + 1000);
      particlePos[p * 3 + 1] = (Math.random() - 0.5) * 600;
      particlePos[p * 3 + 2] = (Math.random() - 0.5) * 400 - 100;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x3ac167,
      size: 2.5,
      transparent: true,
      opacity: 0.3,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Draw Crisp Dark News Card Canvas (NO WHITE Haze, with real Thumbnail)
    function drawNewsCardCanvas(
      article: ChronoArticle,
      dateStr: string,
      imgEl?: HTMLImageElement
    ): HTMLCanvasElement {
      const c = document.createElement("canvas");
      c.width = 460;
      c.height = 300;
      const ctx = c.getContext("2d");

      if (ctx) {
        // Deep solid dark card background with zero milky white layer
        ctx.fillStyle = "#0B111E";
        ctx.beginPath();
        ctx.roundRect(0, 0, 460, 300, 20);
        ctx.fill();

        // Inner solid contrast layer
        const innerGrad = ctx.createLinearGradient(0, 0, 460, 300);
        innerGrad.addColorStop(0, "#111A2E");
        innerGrad.addColorStop(1, "#070B14");
        ctx.fillStyle = innerGrad;
        ctx.beginPath();
        ctx.roundRect(2, 2, 456, 296, 18);
        ctx.fill();

        // Crisp neon green border stroke
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#3AC167";
        ctx.stroke();

        // Top Date Pill (Left)
        ctx.fillStyle = "#3AC167";
        ctx.beginPath();
        ctx.roundRect(20, 18, 140, 28, 8);
        ctx.fill();

        ctx.fillStyle = "#070B14";
        ctx.font = "bold 12px system-ui, sans-serif";
        ctx.fillText(dateStr.toUpperCase(), 28, 36);

        // Department Pill (Right)
        ctx.fillStyle = "#1E293B";
        ctx.beginPath();
        ctx.roundRect(300, 18, 140, 28, 8);
        ctx.fill();

        ctx.fillStyle = "#FCC74F";
        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.fillText((article.department || "NACIONAL").toUpperCase(), 312, 36);

        // Thumbnail Image Rendering (if present)
        let textLeft = 20;
        let textWidth = 420;

        if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
          const thumbX = 20;
          const thumbY = 62;
          const thumbW = 120;
          const thumbH = 175;

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(thumbX, thumbY, thumbW, thumbH, 12);
          ctx.clip();

          // Object-fit cover cropping math
          const imgRatio = imgEl.naturalWidth / imgEl.naturalHeight;
          const thumbRatio = thumbW / thumbH;
          let sWidth = imgEl.naturalWidth;
          let sHeight = imgEl.naturalHeight;
          let sX = 0;
          let sY = 0;

          if (imgRatio > thumbRatio) {
            sWidth = imgEl.naturalHeight * thumbRatio;
            sX = (imgEl.naturalWidth - sWidth) / 2;
          } else {
            sHeight = imgEl.naturalWidth / thumbRatio;
            sY = (imgEl.naturalHeight - sHeight) / 2;
          }

          ctx.drawImage(imgEl, sX, sY, sWidth, sHeight, thumbX, thumbY, thumbW, thumbH);
          ctx.restore();

          // Border around thumbnail
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(58, 193, 103, 0.4)";
          ctx.beginPath();
          ctx.roundRect(thumbX, thumbY, thumbW, thumbH, 12);
          ctx.stroke();

          textLeft = 155;
          textWidth = 285;
        }

        // Source Label
        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.fillText(`FUENTE: ${(article.source || "PRENSA").toUpperCase()}`, textLeft, 78);

        // Multi-line Title
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 16px system-ui, sans-serif";
        const words = article.title.split(" ");
        let line = "";
        let y = 104;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > textWidth && n > 0) {
            ctx.fillText(line, textLeft, y);
            line = words[n] + " ";
            y += 24;
            if (y > 225) break;
          } else {
            line = testLine;
          }
        }
        if (y <= 225) ctx.fillText(line, textLeft, y);

        // Action Link Text at Bottom
        ctx.fillStyle = "#3AC167";
        ctx.font = "bold 12px system-ui, sans-serif";
        ctx.fillText("HAZ CLIC PARA LEER DETALLES →", 20, 275);
      }

      return c;
    }

    // 5. Create Node Spheres and Sprites
    const sprites: THREE.Sprite[] = [];
    const nodeMeshes: THREE.Mesh[] = [];
    const connectionLines: THREE.Line[] = [];
    let loadedCount = 0;
    const totalArticles = displayArticles.length;

    displayArticles.forEach((art, idx) => {
      const nodeX = idx * SPACING;
      const isTop = idx % 2 === 0;
      const cardY = isTop ? 115 : -115;

      // 3D Sphere Node on Rail
      const nodeGeo = new THREE.SphereGeometry(9, 32, 32);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0xfcc74f : 0x3ac167,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(nodeX, 0, 0);
      scene.add(nodeMesh);
      nodeMeshes.push(nodeMesh);

      // Connecting Vertical Line
      const connPoints = [new THREE.Vector3(nodeX, 0, 0), new THREE.Vector3(nodeX, cardY, 0)];
      const connGeo = new THREE.BufferGeometry().setFromPoints(connPoints);
      const connMat = new THREE.LineBasicMaterial({
        color: 0x3ac167,
        transparent: true,
        opacity: 0.5,
      });
      const connLine = new THREE.Line(connGeo, connMat);
      scene.add(connLine);
      connectionLines.push(connLine);

      // Initial Canvas without Image
      const cardCanvas = drawNewsCardCanvas(art, art.formattedDateStr);
      const texture = new THREE.CanvasTexture(cardCanvas);
      texture.minFilter = THREE.LinearFilter;

      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        color: 0xffffff,
      });

      const sprite = new THREE.Sprite(spriteMat);
      const cardW = 185;
      const cardH = 120;
      sprite.scale.set(cardW, cardH, 1);
      sprite.position.set(nodeX, cardY, 0);

      const userData: SpriteUserData = {
        index: idx,
        article: art,
        nodeX,
        nodeY: cardY,
        baseScaleX: cardW,
        baseScaleY: cardH,
      };

      sprite.userData = userData;
      sprites.push(sprite);
      scene.add(sprite);

      // Asynchronously load thumbnail image for card
      if (art.imageUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = art.imageUrl;
        img.onload = () => {
          if (!isMounted) return;
          const updatedCanvas = drawNewsCardCanvas(art, art.formattedDateStr, img);
          texture.image = updatedCanvas;
          texture.needsUpdate = true;
        };
      }

      loadedCount++;
      setLoadingPercent(Math.round((loadedCount / totalArticles) * 100));
      if (loadedCount === totalArticles) setIsLoaded(true);
    });

    // 6. Pointer & Drag Interaction Handlers
    let isDragging = false;
    let startXPos = 0;
    let lastMouseX = 0;
    let dragVelocity = 0;
    let hoveredSprite: THREE.Sprite | null = null;

    function getPointerX(e: MouseEvent | TouchEvent) {
      return "touches" in e ? e.touches[0].clientX : e.clientX;
    }

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      startXPos = getPointerX(e);
      lastMouseX = startXPos;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) {
        if (e instanceof MouseEvent) {
          const rect = renderer.domElement.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          const raycaster = new THREE.Raycaster();
          const normalizedX = (mouseX / width) * 2 - 1;
          const normalizedY = -(mouseY / height) * 2 + 1;

          raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);
          const intersects = raycaster.intersectObjects(sprites);

          if (intersects.length > 0) {
            const hitSprite = intersects[0].object as THREE.Sprite;
            if (hoveredSprite !== hitSprite) {
              if (hoveredSprite) {
                const ud = hoveredSprite.userData as SpriteUserData;
                hoveredSprite.scale.set(ud.baseScaleX, ud.baseScaleY, 1);
              }
              hoveredSprite = hitSprite;
              const ud = hitSprite.userData as SpriteUserData;
              hitSprite.scale.set(ud.baseScaleX * 1.08, ud.baseScaleY * 1.08, 1);
              container.style.cursor = "pointer";
            }
          } else {
            if (hoveredSprite) {
              const ud = hoveredSprite.userData as SpriteUserData;
              hoveredSprite.scale.set(ud.baseScaleX, ud.baseScaleY, 1);
              hoveredSprite = null;
            }
            container.style.cursor = "grab";
          }
        }
        return;
      }

      const x = getPointerX(e);
      const dx = x - lastMouseX;
      lastMouseX = x;
      dragVelocity = dx * 1.8;

      cameraTargetXRef.current = Math.max(-100, Math.min(endX + 100, cameraTargetXRef.current - dragVelocity));
    };

    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      isDragging = false;

      if (Math.abs(getPointerX(e) - startXPos) < 6 && e instanceof MouseEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const raycaster = new THREE.Raycaster();
        const normalizedX = (mouseX / width) * 2 - 1;
        const normalizedY = -(mouseY / height) * 2 + 1;

        raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);

        const intersects = raycaster.intersectObjects([...sprites, ...nodeMeshes]);
        if (intersects.length > 0) {
          const hitObj = intersects[0].object;
          let targetArticle: ChronoArticle | null = null;
          let targetIndex = -1;

          if (hitObj instanceof THREE.Sprite) {
            const ud = hitObj.userData as SpriteUserData;
            targetArticle = ud.article;
            targetIndex = ud.index;
          } else if (hitObj instanceof THREE.Mesh) {
            const nodeIdx = nodeMeshes.indexOf(hitObj);
            if (nodeIdx >= 0) {
              targetArticle = displayArticles[nodeIdx];
              targetIndex = nodeIdx;
            }
          }

          if (targetArticle && targetIndex >= 0) {
            setSelectedArticle(targetArticle);
            setCurrentIndex(targetIndex);
            cameraTargetXRef.current = targetIndex * SPACING;
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY) * 130;
      cameraTargetXRef.current = Math.max(-100, Math.min(endX + 100, cameraTargetXRef.current + delta));
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onPointerDown);
    dom.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    dom.addEventListener("touchstart", onPointerDown, { passive: true });
    dom.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    dom.addEventListener("wheel", onWheel, { passive: false });

    function handleResize() {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight || 520;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    // 7. Render Loop with Smooth Camera Lerp
    function animate() {
      const now = performance.now();

      currentCameraX += (cameraTargetXRef.current - currentCameraX) * 0.09;
      camera.position.x = currentCameraX;

      const activeIdx = Math.max(0, Math.min(displayArticles.length - 1, Math.round(currentCameraX / SPACING)));
      setCurrentIndex(activeIdx);

      nodeMeshes.forEach((mesh, idx) => {
        mesh.position.y = Math.sin(now * 0.002 + idx) * 3;
        const isCurrent = idx === activeIdx;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.color.setHex(isCurrent ? 0xfcc74f : 0x3ac167);
      });

      sprites.forEach((sp) => {
        const ud = sp.userData as SpriteUserData;
        sp.position.y = ud.nodeY + Math.sin(now * 0.0015 + ud.index) * 4;
      });

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);

      dom.removeEventListener("mousedown", onPointerDown);
      dom.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);

      dom.removeEventListener("touchstart", onPointerDown);
      dom.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);

      dom.removeEventListener("wheel", onWheel);

      sprites.forEach((s) => {
        scene.remove(s);
        s.material.dispose();
      });
      nodeMeshes.forEach((n) => {
        scene.remove(n);
        n.geometry.dispose();
      });
      railGeometry.dispose();
      railMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [displayArticles]);

  const handleJumpToStep = (idx: number) => {
    if (idx >= 0 && idx < displayArticles.length) {
      setCurrentIndex(idx);
      cameraTargetXRef.current = idx * 300;
    }
  };

  const departmentsList = ["Todos", "Nacional", "Santa Cruz", "La Paz", "Tarija", "Cochabamba", "Chuquisaca"];

  return (
    <section
      id="galeria-noticias"
      className="relative bg-slate-950 text-white py-16 border-t border-b border-slate-800 overflow-hidden transition-colors duration-300"
    >
      {/* Subtle Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="container-page relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-black uppercase text-[#3ac167] tracking-wider mb-3">
            <Radio size={14} className="animate-pulse" />
            <span>Monitoreo Cronológico WebGL 3D</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Últimas Noticias
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-400 font-medium max-w-2xl mx-auto">
            Línea de tiempo interactiva y cronológica de la cobertura periodística de la Agenda 50/50.
          </p>

          {/* Integrated Subtle Search Bar & Filters */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            {/* Subtle Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="text"
                placeholder="Buscar por palabra clave, medio o ciudad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title="Limpiar búsqueda"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Department Filter Selector */}
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl text-xs overflow-x-auto max-w-full">
              <Filter size={13} className="text-amber-400 ml-2 shrink-0" />
              {departmentsList.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] whitespace-nowrap transition ${
                    selectedDepartment === dept
                      ? "bg-[#3ac167] text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Sort Order Toggle */}
            <button
              onClick={() => setIsAscending(!isAscending)}
              className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 cursor-pointer"
              title="Cambiar sentido cronológico"
            >
              <ArrowUpDown size={14} />
              <span>{isAscending ? "Antiguas primero" : "Recientes primero"}</span>
            </button>
          </div>

          {/* Search Results Feedback Counter */}
          {searchQuery && (
            <div className="mt-3 text-xs font-extrabold text-emerald-400">
              Encontradas <b>{displayArticles.length}</b> noticias para "<span className="text-white">{searchQuery}</span>"
            </div>
          )}
        </div>

        {/* WebGL 3D Timeline Viewport */}
        <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-slate-800 bg-[#070B12] shadow-2xl group">
          {/* Three.js Canvas Node */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* No Search Results Fallback Overlay */}
          {displayArticles.length === 0 && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md p-6 text-center">
              <Search size={40} className="text-slate-600 mb-3 animate-bounce" />
              <h3 className="text-lg font-black text-white">No se encontraron noticias</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                No hay coincidencias para "<span className="text-amber-300">{searchQuery}</span>" en el departamento seleccionado.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDepartment("Todos");
                }}
                className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500 text-slate-950 font-black px-4 py-2 text-xs hover:bg-emerald-400 transition shadow-md"
              >
                <RefreshCw size={14} /> Restablecer filtros
              </button>
            </div>
          )}

          {/* Loading Overlay */}
          {!isLoaded && displayArticles.length > 0 && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
              <div className="relative h-12 w-12 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin mb-4" />
              <span className="text-sm font-extrabold text-white">
                Cargando línea de tiempo 3D... {loadingPercent}%
              </span>
              <span className="text-xs text-slate-400 mt-1">Generando tarjetas en alta resolución</span>
            </div>
          )}

          {/* Navigation Overlay: Previous / Next Step buttons */}
          {displayArticles.length > 0 && (
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 z-10 flex justify-between pointer-events-none">
              <button
                onClick={() => handleJumpToStep(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/80 border border-slate-700 text-white hover:bg-emerald-600 hover:border-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-lg backdrop-blur-md cursor-pointer"
                aria-label="Anterior Hito Cronológico"
                title="Anterior Hito"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => handleJumpToStep(currentIndex + 1)}
                disabled={currentIndex >= displayArticles.length - 1}
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/80 border border-slate-700 text-white hover:bg-emerald-600 hover:border-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-lg backdrop-blur-md cursor-pointer"
                aria-label="Siguiente Hito Cronológico"
                title="Siguiente Hito"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Bottom Timeline Scrubber Navigation Rail */}
          {displayArticles.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4 z-10 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Clock size={14} /> Hito {currentIndex + 1} de {displayArticles.length}
                </span>
                <span>
                  {displayArticles[currentIndex]?.formattedDateStr || ""} · {displayArticles[currentIndex]?.department || ""}
                </span>
              </div>

              {/* Horizontal Timeline Scrubber Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {displayArticles.map((art, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={art.id}
                      onClick={() => handleJumpToStep(idx)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                        isActive
                          ? "bg-emerald-500 text-slate-950 shadow-md scale-105"
                          : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                      }`}
                    >
                      {art.formattedDateStr}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected News Article Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-white relative"
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              aria-label="Cerrar modal de noticia"
            >
              <X size={18} />
            </button>

            {selectedArticle.imageUrl && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-slate-800">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 rounded-full bg-slate-950/90 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase text-[#3ac167] border border-white/10">
                  {selectedArticle.source}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-2">
              <span className="flex items-center gap-1 text-emerald-400">
                <Tag size={13} /> {selectedArticle.department}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {selectedArticle.formattedDateStr}
              </span>
            </div>

            <h3 className="text-xl font-black leading-snug text-white mb-3">
              {selectedArticle.title}
            </h3>

            {selectedArticle.summary && (
              <p className="text-sm text-slate-300 font-medium leading-relaxed mb-6">
                {selectedArticle.summary}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">
                Fuente: {selectedArticle.source}
              </span>

              <a
                href={selectedArticle.url}
                target={selectedArticle.url.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-[#3ac167] hover:bg-[#2ea354] text-slate-950 font-black px-4 py-2.5 text-xs transition shadow-md"
              >
                <span>Leer Cobertura Periodística</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
