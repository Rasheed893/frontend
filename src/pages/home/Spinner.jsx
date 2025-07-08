import React, { useEffect, useRef, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useFetchAllSpinnersQuery } from "../../redux/features/spinnerAPI";
import Loading from "../../components/Loading";

const BannerCarousel = () => {
  const { data: slides = [], isLoading } = useFetchAllSpinnersQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000); // auto-swipe every 4 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  if (isLoading) return <Loading />;

  return (
    <div className="overflow-hidden relative w-full max-w-6xl mx-auto mt-10">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-orange-600 pb-1">
                {slide.subtitle}
              </p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-6 md:mt-8 gap-5">
                {" "}
                {/* Buttons Container */}
                <div className="flex items-center mt-6 md:mt-8 gap-5">
                  {slide.buttons.map((button) => (
                    <a
                      key={button.id}
                      href={button.url}
                      className={
                        button.style === "primary"
                          ? "btn-primary md:px-12 px-8 md:py-3.5 py-2.5 bg-orange-600 rounded-full text-white font-medium hover:bg-orange-700 transition-colors"
                          : "flex items-center gap-2.5 px-7 py-3 font-medium text-gray-800 hover:text-orange-600 transition-colors"
                      }
                    >
                      {button.text}
                      {button.style !== "primary" && (
                        <svg
                          width="18"
                          height="14"
                          className="hover:translate-x-1.5 transition-transform"
                          viewBox="0 0 18 14"
                        >
                          <path
                            d="M10.5 1.5L16 7M16 7L10.5 12.5M16 7H1"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <img
                src={slide.image}
                alt={`Slide ${idx + 1}`}
                className="md:w-72 w-48"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;

// import React, { useEffect, useRef, useState } from "react";
// import { FaArrowRightLong } from "react-icons/fa6";
// import { useFetchAllSpinnersQuery } from "../../redux/features/spinnerAPI";
// import Loading from "../../components/Loading";

// const Carousel = () => {
//   const { data, isLoading } = useFetchAllSpinnersQuery();
//   const [spinnerIndex, setSpinnerIndex] = useState(0);
//   const [slideIndex, setSlideIndex] = useState(0);
//   const sliderRef = useRef(null);

//   const spinners = data?.spinners || [];
//   const currentSpinner = spinners[spinnerIndex] || {};
//   const slides = currentSpinner.slides || [];
//   const settings = currentSpinner.settings || {
//     autoplay: true,
//     interval: 3000,
//   };

//   // Auto-advance slides
//   useEffect(() => {
//     if (!settings.autoplay || slides.length === 0) return;
//     const interval = setInterval(() => {
//       setSlideIndex((prev) => (prev + 1) % slides.length);
//     }, settings.interval);
//     return () => clearInterval(interval);
//   }, [settings, slides.length]);

//   // Auto-advance to next spinner
//   useEffect(() => {
//     if (spinners.length === 0) return;
//     const spinnerTimer = setInterval(() => {
//       setSpinnerIndex((prev) => (prev + 1) % spinners.length);
//       setSlideIndex(0);
//     }, slides.length * settings.interval);
//     return () => clearInterval(spinnerTimer);
//   }, [spinners.length, settings, slides.length]);

//   // Apply sliding transform
//   useEffect(() => {
//     if (!sliderRef.current || slides.length === 0) return;

//     const slideWidth = sliderRef.current.offsetWidth / slides.length;
//     sliderRef.current.style.transform = `translateX(-${
//       slideIndex * slideWidth
//     }px)`;
//   }, [slideIndex, slides.length]);

//   if (isLoading) return <Loading />;

//   return (
//     <div className="overflow-hidden relative w-full mt-10">
//       <h2 className="text-center font-semibold text-lg mb-2 text-gray-500">
//         {currentSpinner.name}
//       </h2>

//       <div
//         ref={sliderRef}
//         className="flex transition-transform duration-700 ease-in-out"
//         style={{ width: `${slides.length * 100}%` }}
//       >
//         {slides.map((slide, index) => (
//           <div
//             key={slide._id || index}
//             className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 rounded-xl"
//             style={{
//               width: `${100 / slides.length}%`,
//               minWidth: `${100 / slides.length}%`,
//               height: `${100 / slides.height}%`,
//               minHeight: `${100 / slides.height}%`,
//             }}
//           >
//             <div className="md:pl-8 mt-10 md:mt-0 md:max-w-[50%]">
//               <p className="text-orange-600 pb-1">{slide.subtitle}</p>
//               <h1 className="max-w-lg md:text-[40px] text-2xl font-semibold">
//                 {slide.title}
//               </h1>
//               <div className="flex items-center mt-4 md:mt-6">
//                 {slide.buttons?.[0] && (
//                   <button className="md:px-10 px-7 md:py-2.5 py-2 bg-orange-600 rounded-full text-white font-medium">
//                     {slide.buttons[0].text}
//                   </button>
//                 )}
//                 {slide.buttons?.[1] && (
//                   <button className="group flex items-center gap-2 px-6 py-2.5 font-medium">
//                     {slide.buttons[1].text}
//                     <FaArrowRightLong />
//                   </button>
//                 )}
//               </div>
//             </div>
//             <div className="flex items-center flex-1 justify-end">
//               <img
//                 src={slide.image?.url}
//                 alt={`Slide ${index + 1}`}
//                 className="md:w-72 w-48"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                   console.error("Failed to load image:", slide.image?.url);
//                 }}
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Carousel;

// import React, { useEffect, useRef, useState } from "react";
// import { FaArrowRightLong } from "react-icons/fa6";

// const slides = [
//   {
//     title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
//     subtitle: "Limited Time Offer 30% Off",
//     button1: "Buy now",
//     button2: "Find more",
//     image: "/RFS.png",
//   },
//   {
//     title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
//     subtitle: "Hurry up only few left!",
//     button1: "Shop Now",
//     button2: "Explore Deals",
//     image: "/RFS.png",
//   },
//   {
//     title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
//     subtitle: "Exclusive Deal 40% Off",
//     button1: "Get MacBook",
//     button2: "View Details",
//     image: "/RFS.png",
//   },
// ];

// const Carousel = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const sliderRef = useRef(null);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % slides.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (sliderRef.current) {
//       const slideWidth = sliderRef.current.offsetWidth / slides.length;
//       sliderRef.current.style.transform = `translateX(-${
//         currentIndex * slideWidth
//       }px)`;
//     }
//   }, [currentIndex]);

//   return (
//     <div className="overflow-hidden relative w-full mt-10">
//       <div
//         ref={sliderRef}
//         className="flex transition-transform duration-700 ease-in-out"
//         style={{ width: `${slides.length * 100}%` }}
//       >
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 rounded-xl"
//             style={{
//               width: `${100 / slides.length}%`,
//               minWidth: `${100 / slides.length}%`,
//             }}
//           >
//             <div className="md:pl-8 mt-10 md:mt-0 md:max-w-[50%]">
//               <p className="text-orange-600 pb-1">{slide.subtitle}</p>
//               <h1 className="max-w-lg md:text-[40px] text-2xl font-semibold">
//                 {slide.title}
//               </h1>
//               <div className="flex items-center mt-4 md:mt-6">
//                 <button className="md:px-10 px-7 md:py-2.5 py-2 bg-orange-600 rounded-full text-white font-medium">
//                   {slide.button1}
//                 </button>
//                 <button className="group flex items-center gap-2 px-6 py-2.5 font-medium">
//                   {slide.button2}
//                   <FaArrowRightLong />
//                 </button>
//               </div>
//             </div>
//             <div className="flex items-center flex-1 justify-end">
//               <img
//                 src={slide.image}
//                 alt={`Slide ${index + 1}`}
//                 className="md:w-72 w-48"
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Carousel;
