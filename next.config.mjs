/** @type {import('next').NextConfig} */
const nextConfig = {
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: 'http://localhost:8081/:path*',
    //         },
    //     ];
    // },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: 'Authorization, Content-Type' },
                    { key: "Access-Control-Allow-Credentials", value: "true" }
                ]
            }
        ]
    },
    env: {
        BACKEND_URL: 'http://localhost:8081',
    }
};

export default nextConfig;
