"use client"; // Indicates this is a client-side component in Next.js

// Importing necessary dependencies
import { useEffect, useRef } from "react";
import gsap from "gsap"; // For animations
import { ImageField } from "@prismicio/client"; // Prismic type for image fields
import { PrismicNextImage } from "@prismicio/next"; // Prismic component for Next.js images
import clsx from "clsx"; // Utility for conditionally joining classNames

// Defining the Avatar component
export default function Avatar({
  image, // Prismic ImageField prop
  className, // Optional className prop
}: {
  image: ImageField;
  className?: string;
}) {
  // Create a ref for the component
  const component = useRef(null);

  // Use effect for animations
  useEffect(() => {
    // Create a GSAP context
    let ctx = gsap.context(() => {
      // Initial animation: fade in and scale down
      gsap.fromTo(
        ".avatar",
        {
          opacity: 0,
          scale: 1.4,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.3,
          ease: "power3.inOut",
        },
      );

      // Mouse move event for interactive animations
      window.onmousemove = (e) => {
        if (!component.current) return; // Exit if component doesn't exist
        const componentRect = (
          component.current as HTMLElement
        ).getBoundingClientRect();
        const componentCenterX = componentRect.left + componentRect.width / 2;

        // Calculate mouse position relative to component center
        let componentPercent = {
          x: (e.clientX - componentCenterX) / componentRect.width / 2,
        };

        let distFromCenterX = 1 - Math.abs(componentPercent.x);

        // Create animation timeline
        gsap
          .timeline({
            defaults: { duration: 0.5, overwrite: "auto", ease: "power3.out" },
          })
          .to(
            ".avatar",
            {
              // Rotate avatar based on mouse position
              rotation: gsap.utils.clamp(-2, 2, 5 * componentPercent.x),
              duration: 0.5,
            },
            0,
          )
          .to(
            ".highlight",
            {
              // Move highlight based on mouse position
              opacity: distFromCenterX - 0.7,
              x: -10 + 20 * componentPercent.x,
              duration: 0.5,
            },
            0,
          );
      };
    }, component);
    return () => ctx.revert(); // Cleanup function to revert animations
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div ref={component} className={clsx("relative h-full w-full", className)}>
      <div
        className="avatar aspect-square overflow-hidden rounded-3xl border-2 border-slate-700 opacity-0"
        style={{ perspective: "500px", perspectiveOrigin: "150% 150%" }}
      >
        <PrismicNextImage
          field={image}
          className="avatar-image h-full w-full object-fill"
          imgixParams={{ q: 90 }} // Set image quality
        />
        {/* Highlight effect, hidden on small screens */}
        <div className="highlight absolute inset-0 hidden w-full scale-110 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 md:block"></div>
      </div>
    </div>
  );
}