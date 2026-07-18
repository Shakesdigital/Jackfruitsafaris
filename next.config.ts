import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/tours-in-uganda",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/gorilla-tracking",
        destination: "/experiences/gorilla-trekking",
        permanent: true,
      },
      {
        source: "/3-days-gorilla-tracking",
        destination: "/safaris/3-days-gorilla-tracking",
        permanent: true,
      },
      {
        source: "/3-days-murchison-falls-np",
        destination: "/safaris/3-days-murchison-falls",
        permanent: true,
      },
      {
        source: "/uganda-national-parks",
        destination: "/safaris/10-days-uganda-safari",
        permanent: true,
      },
      {
        source: "/cycling-in-jinja",
        destination: "/experiences/jinja-adventures",
        permanent: true,
      },
      {
        source: "/airport-pickups",
        destination: "/transport/airport-transfers",
        permanent: true,
      },
      {
        source: "/cultural-experiences",
        destination: "/experiences/cultural-experiences",
        permanent: true,
      },
      {
        source: "/jackfruit-safaris",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/uganda-safari-tour-experience",
        destination: "/safaris/custom-uganda-safari",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
