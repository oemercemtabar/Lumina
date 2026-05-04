import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("luminaDesktop", {
  getRuntimeInfo: () => ipcRenderer.invoke("lumina:get-runtime-info"),
  createSession: (session) => ipcRenderer.invoke("lumina:create-session", session),
  saveFrame: (payload) => ipcRenderer.invoke("lumina:save-frame", payload),
  completeSession: (payload) => ipcRenderer.invoke("lumina:complete-session", payload)
});
