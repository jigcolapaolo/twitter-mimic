"use client";

import { useEffect } from "react";
import { processRedirectResult } from "../../../firebase/client";

export default function AuthInitializer() {
  useEffect(() => {
    processRedirectResult();
  }, []);

  return null;
}