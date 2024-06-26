/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ipcRenderer, IpcRenderer } from "electron";

declare global {
  var ipcRenderer: IpcRenderer;
}

// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once("loaded", () => {
  global.ipcRenderer = ipcRenderer;
  const env = JSON.parse(
    process.argv.find((arg) => arg.startsWith("--env="))?.split("=")[1] || "{}"
  );
  (window as any).env = env;
});
