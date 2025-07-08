import React from "react";
import bannerImg from "../../assets/banner.png"; // replace with modern lifestyle ing
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import bgTexture from "../../assets/background.avif";
import smallBannerImg from "../../assets/acc.jpg";
import smallBgImg from "../../assets/Smallbackground.png";

const Banner = () => {
  const { scrollY } = useScroll();

  // Background transformations
  const scale = useTransform(scrollY, [0, 300], [1.2, 1]);
  const reactiveOpacity = useTransform(scrollY, [0, 300], [1, 0.1]);
  const [bgFaded, setBgFaded] = useState(false);
  const bgOpacity = bgFaded ? 0.3 : reactiveOpacity;

  // ✅ Detect if user has scrolled
  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    const unsubscribe = scrollY.onChange((y) => {
      if (y > 300 && !bgFaded) setBgFaded(true);
      if (y > 30 && !hasScrolled) setHasScrolled(true); // 👈 Trigger animation
    });
    return () => unsubscribe();
  }, [scrollY, bgFaded, hasScrolled]);

  const textRef = useRef(null);
  const imageRef = useRef(null);

  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-screen flex flex-col justify-end mt-5 md:mt-1 bg-gradient-to-t from-white/90 to-transparent"
    >
      {/* Background image */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ scale, opacity: bgOpacity }}
      >
        <picture>
          <source media="(max-width: 768px)" srcSet={smallBgImg} />
          <img
            src={bgTexture}
            alt="Soft background texture"
            className="w-full h-full object-cover object-center"
          />
        </picture>
        {/* <img
          src={bgTexture}
          alt="Soft background texture"
          className="w-full h-full object-cover object-center"
        /> */}
      </motion.div>

      {/* Foreground content */}
      <div className="relative z-10 w-full bg-gradient-to-t from-white/90 to-transparent px-6 md:px-16 pb-40">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          {/* Text */}
          <motion.div
            ref={textRef}
            initial={{ opacity: 0, x: -80 }}
            animate={hasScrolled ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:w-1/2 w-full text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Elevate Your Everyday
            </h1>
            <p className="text-gray-600 mb-8 text-lg md:pr-6">
              Discover curated accessories to complement your lifestyle — from
              chic bags to elegant home accents.
            </p>
            <Link
              to="/all-products"
              // className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-shadow shadow-md"
            >
              <button className="btn-primary">Shop Collection</button>
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: 80 }}
            animate={hasScrolled ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="md:w-1/2 w-full flex justify-center"
          >
            <picture>
              <source media="(max-width: 768px)" srcSet={smallBannerImg} />
              <img
                src={bannerImg}
                alt="Accessories banner"
                className="rounded-2xl shadow-xl w-full max-w-md mt-3 h-[400px] md:h-[450px] object-cover"
              />
            </picture>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
// const Banner = () => {
//   return (
//     <div className="flex flex-col md:flex-row-reverse items-center justify-between py-16 gap-12">
//       {/* Images side */}
//       <div className="md:w-1/2 w-full flex items-center md:justify-end">
//         <img src={bannerImg} alt="banner" />
//       </div>
//       {/* Text side */}
//       <div className="md:w-1/2 w-full">
//         <h1 className="md:text-5xl text-2xl font-medium mb-7">
//           New Releases This Week
//         </h1>
//         <p className="mb-10">
//           It's time to update your reading list with some of the latest and
//           greatest releases in the literary world. From heart-pumping thrillers
//           to captivating memoirs, this week's new releases offer something for
//           everyone
//         </p>
//         <button className="btn-primary">Subscribe</button>
//       </div>
//     </div>
//   );
// };

export default Banner;
