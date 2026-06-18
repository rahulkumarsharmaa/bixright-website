"use client";

import { startTransition, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement | null;
}

export default function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
      setTarget(container || document.body);
    });
    return () => setMounted(false);
  }, [container]);

  if (!mounted || !target) return null;

  return createPortal(children, document.body);
}
