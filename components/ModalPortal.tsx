"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

let openModalCount = 0;
let previousBodyOverflow = "";

interface ModalPortalProps {
  children: ReactNode;
  lockScroll?: boolean;
}

/**
 * Renderiza un modal directamente en `document.body` mediante React Portal
 * para evitar que ancestros con `transform`, `will-change` o `backdrop-filter`
 * (como `ScrollSection`) recorten o atrapen el `position: fixed`.
 */
export function ModalPortal({ children, lockScroll = true }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (lockScroll) {
      if (openModalCount === 0) {
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }
      openModalCount += 1;
    }

    return () => {
      if (lockScroll) {
        openModalCount = Math.max(0, openModalCount - 1);
        if (openModalCount === 0) {
          document.body.style.overflow = previousBodyOverflow;
        }
      }
    };
  }, [lockScroll]);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
