import { useEffect, useState } from "react";

import type { DesktopRuntimeInfo } from "../../../app/desktop";

export function useDesktopRuntime() {
  const [runtimeInfo, setRuntimeInfo] = useState<DesktopRuntimeInfo | null>(null);

  useEffect(() => {
    window.luminaDesktop?.getRuntimeInfo().then(setRuntimeInfo).catch(() => {
      setRuntimeInfo(null);
    });
  }, []);

  return runtimeInfo;
}
