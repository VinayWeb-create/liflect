// vite.config.js
import react from '@vitejs/plugin-react';

export default {
  plugins: [
    react({
      fastRefresh: true, // default is true, but try false if problem persists
    }),
  ],
};
