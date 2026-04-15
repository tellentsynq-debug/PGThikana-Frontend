"use client";

import { Suspense } from "react";

export default function SuspenseWrapper({ children }: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}