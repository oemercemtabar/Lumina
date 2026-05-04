import { create } from "zustand";

interface CoverageStore {
  bins: Record<string, boolean>;
  markCovered: (bin: string) => void;
}

export const useCoverageStore = create<CoverageStore>((set) => ({
  bins: {},
  markCovered: (bin) =>
    set((state) => ({
      bins: {
        ...state.bins,
        [bin]: true
      }
    }))
}));
