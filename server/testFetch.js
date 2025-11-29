import fetch from 'node-fetch';

(async () => {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'GET' });
    console.log('Status:', res.status);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
})();
