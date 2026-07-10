import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Image optimization for better performance and SEO
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "media.giphy.com",
                port: "",
                pathname: "/media/**",
            },
        ],
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000, // 1 year
    },
    
    // Compression for better performance
    compress: true,
    
    // Experimental features for better performance
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-label', '@radix-ui/react-slot'],
    },

    // ✅ ADDED: Rewrites to proxy the tracking script and bypass adblockers
    async rewrites() {
        return [
            {
                // Disguise the external script as a local file
                source: "/assets/js/app-script.js",
                destination: "https://cdn.engagetrack.net/sdk.js",
            },
            // Note: If you want to proxy the DATA being sent (to fully bypass adblockers),
            // you will need a second rewrite here pointing to EngageTrack's API endpoint.
        ];
    },

    // SEO-friendly redirects
    async redirects() {
        return [
            {
                source: "/:path*",
                has: [
                    {
                        type: "host",
                        value: "www.ideacomp.cz",
                    },
                ],
                destination: "https://ideacomp.cz/:path*",
                permanent: true,
            },
            // Redirect common typos and variations
            {
                source: "/solution",
                destination: "/solutions",
                permanent: true,
            },
            {
                source: "/services",
                destination: "/solutions", 
                permanent: true,
            },
            {
                source: "/about",
                destination: "/",
                permanent: true,
            },
        ];
    },

    // Security and performance headers
    async headers() {
        return [
            {
                // Apply these headers to all routes
                source: "/(.*)",
                headers: [
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=31536000; includeSubDomains; preload",
                    },
                    {
                        key: "Permissions-Policy",
                        value:
                            'payment=(self "https://calendly.com" "https://*.calendly.com" "https://js.stripe.com" "https://*.stripe.com"), geolocation=(), microphone=(), camera=()',
                    },
                    {
                        key: "Content-Security-Policy",
                        value: [
                            "default-src 'self'",
                            // ✅ ADDED https://cdn.engagetrack.net below
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com https://*.calendly.com https://js.stripe.com https://*.stripe.com https://www.googletagmanager.com https://*.googletagmanager.com https://api.emailjs.com https://cdn.engagetrack.net",
                            "style-src 'self' 'unsafe-inline' https://assets.calendly.com https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com https://assets.calendly.com",
                            "img-src 'self' data: https: blob:",
                            // ✅ ADDED https://*.engagetrack.net below so the script can send data home
                            "connect-src 'self' https://calendly.com https://*.calendly.com https://api.stripe.com https://*.stripe.com https://api.emailjs.com https://*.emailjs.com https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.googletagmanager.com wss: https://*.engagetrack.net",
                            "frame-src 'self' https://calendly.com https://*.calendly.com",
                            "media-src 'self' data: blob:",
                        ].join("; "),
                    },
                ],
            },
            {
                // Cache static assets for better performance
                source: "/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2|ttf|eot|css|js)$",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                // Cache HTML pages with shorter duration
                source: "/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=3600, must-revalidate",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
