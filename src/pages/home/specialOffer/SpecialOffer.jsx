import React, { useState, useEffect } from "react";
import { useFetchCarouselQuery } from "../../../redux/features/spinnerAPI";
import "./SpecialOffer.css"; // Import your CSS file for styles

const SpecialOffer = ({ spinnerName = "special-offers" }) => {
  const { data, isLoading, isError } = useFetchCarouselQuery(spinnerName);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = data?.slides?.filter((slide) => slide.isActive) || [];
  const intervalTime = data?.settings?.interval || 3000;
  const autoplay = data?.settings?.autoplay && slides.length > 1;

  useEffect(() => {
    if (!autoplay || isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [slides.length, intervalTime, autoplay, isPaused]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), intervalTime * 2);
  };

  if (isLoading)
    return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />;
  if (isError || !slides.length)
    return (
      <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        Failed to load carousel
      </div>
    );

  return (
    <div className="overflow-hidden relative w-full">
      {/* Carousel Track */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-8 mt-6 rounded-xl min-w-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Content Section */}
            <div className="md:pl-8 mt-10 md:mt-0 md:max-w-[50%] px-4">
              <p className="md:text-base text-orange-600 pb-1">
                {slide.subtitle}
              </p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold max-[375px]:text-xl max-[375px]:leading-6 ">
                {slide.title}
              </h1>

              {/* Buttons Container */}
              <div className="flex items-center mt-6 md:mt-8 gap-5 max-[376px]:flex-col max-[375px]:w-full max-[375px]:gap-2">
                {slide.buttons.map((button, index) => (
                  <a
                    key={button._id}
                    href={button.url}
                    className={
                      index === 0
                        ? "btn-primary md:px-12 px-8 md:py-3.5 py-2.5 bg-orange-600 rounded-full text-white font-medium hover:bg-orange-700 transition-colors max-[375px]:w-full max-[375px]:justify-center"
                        : "flex items-center gap-2.5 px-7 py-3 font-medium text-gray-800 hover:text-orange-600 transition-colors max-[375px]:w-full max-[375px]:justify-center"
                    }
                  >
                    {button.text}
                    {index > 0 && (
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

            {/* Image Section */}
            <div className="flex items-center flex-1 justify-end md:pr-8 mt-10 md:mt-0">
              <img
                alt={slide.title}
                src={slide.image.url}
                className="md:w-72 w-40 sm:w-48 max-h-64 object-contain max-[376px]:w-82 max-[376px]:max-h-52"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-orange-600" : "bg-gray-500/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SpecialOffer;
