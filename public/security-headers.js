/**
 * Content Security Policy configuration
 * This script adds security headers to the application
 */

// Add Content Security Policy headers
const addSecurityHeaders = () => {
  try {
    // Define allowed sources for different resource types
    const cspDirectives = {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "*.googleapis.com", "*.gstatic.com"],
      'style-src': ["'self'", "'unsafe-inline'", "*.googleapis.com", "*.gstatic.com"],
      'img-src': ["'self'", "data:", "*.googleapis.com", "*.gstatic.com", "maps.google.com", "*.freepik.com", "images.squarespace-cdn.com"],
      'font-src': ["'self'", "*.googleapis.com", "*.gstatic.com"],
      'connect-src': ["'self'", "*.googleapis.com"],
      'frame-src': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"]
    };

    // Build CSP string
    const cspString = Object.entries(cspDirectives)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');

    // Create meta tag for CSP
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = cspString;
    document.head.appendChild(cspMeta);

    // Add additional security headers as meta tags
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };

    // Add security header meta tags
    Object.entries(securityHeaders).forEach(([header, value]) => {
      const meta = document.createElement('meta');
      meta.httpEquiv = header;
      meta.content = value;
      document.head.appendChild(meta);
    });

    console.log('Security headers applied successfully');
  } catch (error) {
    console.error('Failed to apply security headers:', error);
  }
};

// Execute when DOM is loaded
document.addEventListener('DOMContentLoaded', addSecurityHeaders);
