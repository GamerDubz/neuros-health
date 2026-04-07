"use client";

import { createContext } from "react";
import type { AppStoreValue } from "@/types/store";

export const AppStoreContext = createContext<AppStoreValue | undefined>(undefined);
