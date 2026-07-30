import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mansuripaints.app',
  appName: 'Mansuri Paints',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
