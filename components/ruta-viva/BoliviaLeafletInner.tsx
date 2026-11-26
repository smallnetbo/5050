"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FeatureCollection, Geometry } from "geojson";
import { TERRITORIAL_PINS, TerritorialPin } from "@/lib/ruta-viva-data";

interface DeptFeatureProps {
  id: string;
  name: string;
  iso: string;
}

type BoliviaFeatureCollection = FeatureCollection<Geometry, DeptFeatureProps>;

interface BoliviaLeafletInnerProps {
  activeDeptId: string;
  selectedPinId: string | null;
  onSelectPin: (pin: TerritorialPin) => void;
  onSelectDept: (deptId: string) => void;
}

const BOLIVIA_CENTER: [number, number] = [-16.5, -64.6];
const BOLIVIA_ZOOM = 5;

function getPinHex(accent: TerritorialPin["accent"]): string {
  if (accent === "red") return "#dd3146";
  if (accent === "gold") return "#c79d47";
  return "#3ac167";
}

export default function BoliviaLeafletInner({
  activeDeptId,
  selectedPinId,
  onSelectPin,
  onSelectDept,
}: BoliviaLeafletInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoLayerRef = useRef<L.GeoJSON | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const onSelectPinRef = useRef(onSelectPin);
  const onSelectDeptRef = useRef(onSelectDept);

  onSelectPinRef.current = onSelectPin;
  onSelectDeptRef.current = onSelectDept;

  // Inicializar mapa Leaflet + CartoDB Positron
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: BOLIVIA_CENTER,
      zoom: BOLIVIA_ZOOM,
      minZoom: 4,
      maxZoom: 12,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const tilePane = map.getPane("tilePane");
    if (tilePane) {
      tilePane.style.filter = "grayscale(85%) contrast(0.95) brightness(1.05)";
    }

    mapRef.current = map;

    // Cargar GeoJSON oficial de los 9 departamentos
    fetch("/data/bolivia-departamentos.json")
      .then((res) => res.json())
      .then((geoData: BoliviaFeatureCollection) => {
        if (!mapRef.current) return;

        const geoLayer = L.geoJSON(geoData, {
          style: (feature) => {
            const isSelected = feature?.properties?.id === activeDeptId;
            return {
              fillColor: isSelected ? "#1B2533" : "#94a3b8",
              fillOpacity: isSelected ? 0.28 : 0.12,
              color: isSelected ? "#c79d47" : "#475569",
              weight: isSelected ? 2.5 : 1.2,
            };
          },
          onEachFeature: (feature, layer) => {
            const deptName = feature.properties?.name || "";
            const deptId = feature.properties?.id || "";

            layer.bindTooltip(deptName, {
              sticky: true,
              direction: "top",
              className: "font-sans text-xs font-bold",
            });

            layer.on("click", () => {
              onSelectDeptRef.current(deptId);
            });

            layer.on("mouseover", () => {
              (layer as L.Path).setStyle({
                fillOpacity: 0.32,
                weight: 2,
              });
            });

            layer.on("mouseout", () => {
              geoLayer.resetStyle(layer as L.Path);
            });
          },
        }).addTo(map);

        geoLayerRef.current = geoLayer;

        const bounds = geoLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [18, 18] });
        }
      })
      .catch(() => {});

    // Agregar los 6 pines geolocalizados con pulso animado
    TERRITORIAL_PINS.forEach((pin) => {
      const color = getPinHex(pin.accent);
      const isSelected = pin.id === selectedPinId;

      const icon = L.divIcon({
        className: "custom-5050-pin",
        html: `
          <div style="position:relative;display:flex;align-items:center;gap:6px;transform:translate(-9px,-9px);cursor:pointer;">
            <span style="position:relative;display:inline-flex;width:18px;height:18px;align-items:center;justify-content:center;">
              <span style="position:absolute;inset:-4px;border-radius:9999px;background:${color};opacity:${isSelected ? "0.45" : "0.28"};animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></span>
              <span style="position:relative;width:${isSelected ? "14px" : "11px"};height:${isSelected ? "14px" : "11px"};border-radius:9999px;background:${color};border:2.5px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></span>
            </span>
            <span style="background:${isSelected ? "#1B2533" : "rgba(255,255,255,0.94)"};color:${isSelected ? "#ffffff" : "#1B2533"};border:1px solid ${isSelected ? "#c79d47" : "rgba(27,37,51,0.2)"};padding:2px 7px;border-radius:6px;font-size:11px;font-weight:800;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.12);">
              ${pin.city}
            </span>
          </div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker([pin.lat, pin.lon], { icon, zIndexOffset: isSelected ? 500 : 100 }).addTo(map);
      marker.on("click", () => {
        onSelectPinRef.current(pin);
      });
      markersRef.current[pin.id] = marker;
    });

    return () => {
      map.remove();
      mapRef.current = null;
      geoLayerRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar estilos al cambiar departamento o pin seleccionado
  useEffect(() => {
    if (geoLayerRef.current) {
      geoLayerRef.current.eachLayer((layer) => {
        const feature = (layer as L.GeoJSON & { feature?: { properties?: DeptFeatureProps } }).feature;
        const isSelected = feature?.properties?.id === activeDeptId;
        (layer as L.Path).setStyle({
          fillColor: isSelected ? "#1B2533" : "#94a3b8",
          fillOpacity: isSelected ? 0.28 : 0.12,
          color: isSelected ? "#c79d47" : "#475569",
          weight: isSelected ? 2.5 : 1.2,
        });
      });
    }

    TERRITORIAL_PINS.forEach((pin) => {
      const marker = markersRef.current[pin.id];
      if (!marker) return;
      const color = getPinHex(pin.accent);
      const isSelected = pin.id === selectedPinId;
      marker.setZIndexOffset(isSelected ? 500 : 100);
      marker.setIcon(
        L.divIcon({
          className: "custom-5050-pin",
          html: `
            <div style="position:relative;display:flex;align-items:center;gap:6px;transform:translate(-9px,-9px);cursor:pointer;">
              <span style="position:relative;display:inline-flex;width:18px;height:18px;align-items:center;justify-content:center;">
                <span style="position:absolute;inset:-4px;border-radius:9999px;background:${color};opacity:${isSelected ? "0.45" : "0.28"};animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></span>
                <span style="position:relative;width:${isSelected ? "14px" : "11px"};height:${isSelected ? "14px" : "11px"};border-radius:9999px;background:${color};border:2.5px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></span>
              </span>
              <span style="background:${isSelected ? "#1B2533" : "rgba(255,255,255,0.94)"};color:${isSelected ? "#ffffff" : "#1B2533"};border:1px solid ${isSelected ? "#c79d47" : "rgba(27,37,51,0.2)"};padding:2px 7px;border-radius:6px;font-size:11px;font-weight:800;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.12);">
                ${pin.city}
              </span>
            </div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        })
      );
    });
  }, [activeDeptId, selectedPinId]);

  const handleResetView = () => {
    if (!mapRef.current) return;
    if (geoLayerRef.current) {
      const bounds = geoLayerRef.current.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [18, 18] });
        return;
      }
    }
    mapRef.current.setView(BOLIVIA_CENTER, BOLIVIA_ZOOM);
  };

  return (
    <div className="relative w-full h-full min-h-[430px] rounded-2xl overflow-hidden border border-amber-900/10 dark:border-slate-800">
      <div ref={containerRef} className="w-full h-full min-h-[430px] z-10" />
      <button
        type="button"
        onClick={handleResetView}
        className="absolute top-3 right-3 z-[400] rounded-xl bg-white/95 hover:bg-white text-[#1B2533] border border-slate-200 px-3 py-1.5 text-[11px] font-black shadow-sm transition cursor-pointer"
      >
        Vista Bolivia
      </button>
    </div>
  );
}
