/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(glb|gltf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/chunks/[path][name].[hash][ext]'
        }
      });
  
      return config;
    },
    // ... any other existing configurations
  };
  
  export default nextConfig;