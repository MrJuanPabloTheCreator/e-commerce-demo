/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false,
    images: {
        domains: ['lh3.googleusercontent.com','voy-now-bucket.s3.amazonaws.com']
    },
};

export default nextConfig;
