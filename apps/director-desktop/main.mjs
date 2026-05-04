import { app, BrowserWindow, ipcMain } from "electron";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    backgroundColor: "#0f1319",
    title: "Lumina Director",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    window.loadURL("http://127.0.0.1:5173");
    window.webContents.openDevTools({ mode: "detach" });
    return;
  }

  window.loadFile(path.join(__dirname, "../director-web/dist/index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("lumina:get-runtime-info", () => ({
    platform: process.platform,
    arch: process.arch,
    appVersion: app.getVersion()
  }));

  ipcMain.handle("lumina:create-session", async (_event, session) => {
    const sessionsRoot = path.join(os.homedir(), "Documents", "LuminaSessions");
    const sessionDir = path.join(sessionsRoot, session.sessionId);
    const framesDir = path.join(sessionDir, "frames");
    await ensureDir(framesDir);

    const manifestPath = path.join(sessionDir, "manifest.json");
    const manifest = {
      ...session,
      status: "active",
      acceptedFrames: []
    };

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

    return { sessionDir, manifestPath };
  });

  ipcMain.handle("lumina:save-frame", async (_event, payload) => {
    const sessionsRoot = path.join(os.homedir(), "Documents", "LuminaSessions");
    const sessionDir = path.join(sessionsRoot, payload.sessionId);
    const framesDir = path.join(sessionDir, "frames");
    const manifestPath = path.join(sessionDir, "manifest.json");
    const framePath = path.join(framesDir, `${payload.frameId}.jpeg`);
    const buffer = Buffer.from(payload.imageBase64, "base64");

    await ensureDir(framesDir);
    await fs.writeFile(framePath, buffer);

    const manifestRaw = await fs.readFile(manifestPath, "utf8");
    const manifest = JSON.parse(manifestRaw);
    manifest.acceptedFrames.push({
      frameId: payload.frameId,
      poseId: payload.poseId,
      capturedAt: payload.capturedAt,
      metrics: payload.metrics,
      fileName: `${payload.frameId}.jpeg`
    });

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

    return { framePath };
  });

  ipcMain.handle("lumina:complete-session", async (_event, payload) => {
    const sessionsRoot = path.join(os.homedir(), "Documents", "LuminaSessions");
    const manifestPath = path.join(sessionsRoot, payload.sessionId, "manifest.json");
    const manifestRaw = await fs.readFile(manifestPath, "utf8");
    const manifest = JSON.parse(manifestRaw);
    manifest.status = "completed";
    manifest.completedAt = payload.completedAt;
    manifest.summary = payload.summary;
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
    return { manifestPath };
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
