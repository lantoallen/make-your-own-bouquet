const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: 'tests',
  timeout: 60000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  webServer: { command: 'node tests/serve.js', url: 'http://localhost:4173', reuseExistingServer: !process.env.CI },
  use: {
    baseURL: 'http://localhost:4173',
    // set PW_CHANNEL=chrome to use an installed Chrome instead of the downloaded Chromium
    channel: process.env.PW_CHANNEL || undefined,
    // a fake microphone so the real MediaRecorder runs in the voice note test
    launchOptions: { args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] },
    permissions: ['microphone'],
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL || undefined } }],
});
