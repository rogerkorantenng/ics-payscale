"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CampusContextType {
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
}

const CampusContext = createContext<CampusContextType>({
  selectedCampus: "all",
  setSelectedCampus: () => {},
});

export function CampusProvider({ children }: { children: ReactNode }) {
  const [selectedCampus, setSelectedCampus] = useState("all");
  return (
    <CampusContext.Provider value={{ selectedCampus, setSelectedCampus }}>
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  return useContext(CampusContext);
}
