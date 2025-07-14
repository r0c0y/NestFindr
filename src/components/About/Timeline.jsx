import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiTrendingUp, FiAward, FiUsers } from 'react-icons/fi';
import './Timeline.css';

const timelineData = [
  {
    year: '2009',
    title: 'NestFindr Founded',
    description: 'A small team of passionate real estate experts and tech enthusiasts set out to simplify the property search process.',
    icon: <FiBriefcase />,
  },
  {
    year: '2015',
    title: '1,000th Property Listed',
    description: 'Reached a major milestone, showcasing a growing and diverse portfolio of properties for our clients.',
    icon: <FiTrendingUp />,
  },
  {
    year: '2020',
    title: 'Innovator of the Year Award',
    description: 'Recognized for our cutting-edge technology and commitment to revolutionizing the real estate industry.',
    icon: <FiAward />,
  },
  {
    year: '2024',
    title: '50,000+ Happy Customers',
    description: 'Celebrated serving over 50,000 satisfied customers who found their dream homes with NestFindr.',
    icon: <FiUsers />,
  },
];

const Timeline = () => {
  const timelineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const timelineRect = timelineRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        const timelineTop = timelineRect.top;
        const timelineHeight = timelineRect.height;

        // Define the scroll range for the fill effect
        // Start when the bottom of the timeline element enters the viewport
        const startFillScrollPoint = viewportHeight - timelineHeight;
        // End when the top of the timeline element reaches the top of the viewport
        const endFillScrollPoint = 0;

        let scrollProgress = 0;

        // If the timeline is completely below the viewport, fill is 0
        if (timelineTop >= viewportHeight) {
          scrollProgress = 0;
        }
        // If the timeline is completely above the viewport, fill is 100
        else if (timelineTop <= -timelineHeight) { // When the entire element has scrolled past the top
          scrollProgress = 100;
        }
        // If the timeline is partially in view
        else {
          // Calculate progress based on its position within the defined scroll range
          const currentPosition = startFillScrollPoint - timelineTop;
          const totalRange = startFillScrollPoint - endFillScrollPoint;

          if (totalRange > 0) { // Avoid division by zero if timelineHeight is very small or viewport is huge
            scrollProgress = (currentPosition / totalRange) * 100;
          } else {
            scrollProgress = currentPosition > 0 ? 100 : 0; // Handle edge case for very small timelines
          }

          // Clamp the value between 0 and 100
          scrollProgress = Math.min(100, Math.max(0, scrollProgress));
        }

        timelineRef.current.style.setProperty('--scroll-progress', `${scrollProgress}%`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call to set the correct state on load

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeInOut' },
  };

  return (
    <div className="timeline-container">
      <motion.h2
        className="timeline-title"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        Our Journey
      </motion.h2>
      <div className="timeline" ref={timelineRef}>
        {timelineData.map((item, index) => (
          <motion.div
            key={index}
            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="timeline-icon">{item.icon}</div>
            <div className="timeline-content">
              <span className="timeline-year">{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;