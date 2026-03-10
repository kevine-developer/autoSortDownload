export function sendMessage(message) {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(message, response => {
        if (chrome.runtime.lastError) {
          console.warn("Chrome Runtime Error:", chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

export async function loadConfigAPI() {
  try {
    return await sendMessage({ action: 'getConfig' });
  } catch (e) {
    console.error("Failed to load config:", e);
    return null;
  }
}

export async function loadStatsAPI() {
  try {
    return await sendMessage({ action: 'getStats' });
  } catch (e) {
    console.error("Failed to load stats:", e);
    return null;
  }
}

export async function saveConfigAPI(config) {
  return await sendMessage({ action: 'saveConfig', config });
}
