// Standard SVG placeholders for movie posters and backdrops

export const FALLBACK_POSTER = 
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450" fill="%231a1a1a"><rect width="300" height="450" fill="%231e1e1e"/><circle cx="150" cy="180" r="50" fill="%232c2c2c"/><polygon points="140,160 170,180 140,200" fill="%23e50914"/><text x="150" y="270" fill="%23888888" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">Netflix Replica</text><text x="150" y="300" fill="%23555555" font-family="sans-serif" font-size="12" text-anchor="middle">Poster Unavailable</text></svg>';

export const FALLBACK_BACKDROP = 
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" fill="%23141414"><rect width="1280" height="720" fill="%23181818"/><text x="640" y="350" fill="%23e50914" font-family="sans-serif" font-size="48" font-weight="900" text-anchor="middle" letter-spacing="4">NETFLIX</text><text x="640" y="400" fill="%23666666" font-family="sans-serif" font-size="20" text-anchor="middle">Cinematic Backdrop Preview</text></svg>';

export const handleImageError = (e, fallback = FALLBACK_POSTER) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = fallback;
};
