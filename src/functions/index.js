const functions = require('firebase-functions');

// Simple Cloud Function for generating social content
exports.generateSocialContent = functions.https.onRequest((req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }
  
  // For now, return a simple placeholder response
  const { event, platform, chapter_id } = req.body;
  
  const response = {
    platform: platform || 'linkedin',
    chapter_id: chapter_id || 'gdg-unknown',
    event_title: event?.title || 'GDG Event',
    content: `Join us for ${event?.title || 'our upcoming event'}! 🚀\n\n${event?.description || ''}\n\nDate: ${event?.date || 'TBD'}\nTime: ${event?.time || 'TBD'}\n\n#GDG #GoogleDevelopers #TechCommunity`,
    status: 'success'
  };
  
  res.status(200).json(response);
});

// Health check endpoint
exports.healthCheck = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});