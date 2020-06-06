const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const exec = require("child_process").exec;

// Check if the user is logged into the league client
const isRunning = (query, cb) => {
  let platform = process.platform;
  let cmd = "";
  switch (platform) {
    case "win32":
      cmd = `tasklist`;
      break;
    case "darwin":
      cmd = `ps -ax | grep ${query}`;
      break;
    case "linux":
      cmd = `ps -A`;
      break;
    default:
      break;
  }
  exec(cmd, (err, stdout, stderr) => {
    cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
  });
};

// status will be true or false
isRunning("LeagueClient.exe", (status) => {
  if (!status) {
    dialog.showErrorBox("Error", "Please login to the league client");
    process.exit();
  }
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 950,
    height: 650,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
    frame: false,
    icon: __dirname + "/images/icon.ico",
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});