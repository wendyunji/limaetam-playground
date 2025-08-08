import { withContentlayer } from "next-contentlayer";

const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ["*"] }
  }
};

export default withContentlayer(nextConfig);
