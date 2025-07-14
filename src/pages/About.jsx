import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowRight,
  FiCheckCircle,
  FiAward,
  FiUsers,
  FiTrendingUp,
  FiShield,
  FiHeart,
  FiTarget,
  FiEye,
  FiStar,
  FiPhone,
  FiMail,
  FiMapPin
} from 'react-icons/fi';
import '../styles/About.css';
import aboutHeroImage from '../assets/ChatGPT Image Jul 12, 2025, 07_44_39 PM.png';
import Timeline from '../components/About/Timeline';

import Footer from '../components/Footer';

const About = () => {
  const navigate = useNavigate();

  const handleBrowseClick = () => {
    navigate('/listings');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeInOut' },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const values = [
    {
      icon: FiTarget,
      title: 'Our Mission',
      description: 'To revolutionize the real estate experience by providing innovative technology solutions that make buying and selling properties seamless, transparent, and efficient.'
    },
    {
      icon: FiEye,
      title: 'Our Vision',
      description: 'To become the leading digital platform that transforms how people discover, compare, and acquire their dream properties worldwide.'
    },
    {
      icon: FiHeart,
      title: 'Our Values',
      description: 'Integrity, Innovation, and Customer-centricity drive everything we do. We believe in building lasting relationships through trust and exceptional service.'
    }
  ];

  const features = [
    {
      icon: FiShield,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security measures and encryption.'
    },
    {
      icon: FiTrendingUp,
      title: 'Market Insights',
      description: 'Get real-time market data and analytics to make informed decisions.'
    },
    {
      icon: FiUsers,
      title: 'Expert Support',
      description: 'Our team of real estate experts is available 24/7 to assist you.'
    },
    {
      icon: FiStar,
      title: 'Premium Quality',
      description: 'Every property is verified and meets our high-quality standards.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      description: 'Real estate industry veteran with 20+ years of experience.',
      image: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      description: 'Technology leader passionate about innovation in real estate.',
      image: 'https://i.pravatar.cc/150?img=2'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Sales',
      description: 'Customer experience expert dedicated to client satisfaction.',
      image: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <motion.section className="about-hero-section" initial="initial" animate="animate" variants={stagger}>
        <div className="hero-content-container">
          <motion.h1 className="hero-title" variants={fadeInUp}>
            Revolutionizing Real Estate
          </motion.h1>
          <motion.p className="hero-subtitle" variants={fadeInUp}>
            NestFindr is a team of passionate innovators dedicated to making your property journey seamless and enjoyable.
          </motion.p>
          <motion.button className="hero-cta-button" variants={fadeInUp} onClick={handleBrowseClick}>
            Explore Properties <FiArrowRight />
          </motion.button>
        </div>
        <motion.div className="hero-image-container" variants={fadeInUp}>
          <img src={aboutHeroImage} alt="Modern architecture" />
        </motion.div>
      </motion.section>

      <Timeline />

      {/* Values Section */}
      <motion.section 
        className="values-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.h2 variants={fadeInUp}>Our Story</motion.h2>
        <motion.p className="story-text" variants={fadeInUp}>
          Founded in 2009, NestFindr began as a simple idea: to make real estate accessible to everyone. 
          What started as a small team of passionate individuals has grown into a leading platform that 
          serves thousands of customers worldwide. We've revolutionized the way people search for, 
          compare, and purchase properties by combining cutting-edge technology with personalized service.
        </motion.p>
        
        <div className="values-grid">
          {values.map((value, index) => (
            <motion.div key={index} className="value-card" variants={fadeInUp}>
              <value.icon className="value-icon" />
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.h2 variants={fadeInUp}>Why Choose NestFindr?</motion.h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div key={index} className="feature-card" variants={fadeInUp}>
              <feature.icon className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section className="team-section" initial="initial" whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.h2 variants={fadeInUp}>Meet Our Team</motion.h2>
        <div className="team-grid">
          {team.map((member, index) => (
            <motion.div key={index} className="team-card" variants={fadeInUp}>
              <div className="team-image">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-description">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className="contact-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.h2 variants={fadeInUp}>Get In Touch</motion.h2>
        <motion.p variants={fadeInUp}>
          Ready to find your dream property? Our team is here to help you every step of the way.
        </motion.p>
        <div className="contact-grid">
          <motion.div className="contact-card" variants={fadeInUp}>
            <FiPhone className="contact-icon" />
            <h3>Call Us</h3>
            <p>(+91) 1234567890</p>
          </motion.div>
          <motion.div className="contact-card" variants={fadeInUp}>
            <FiMail className="contact-icon" />
            <h3>Email Us</h3>
            <p>info@nestfindr.com</p>
          </motion.div>
          <motion.div className="contact-card" variants={fadeInUp}>
            <FiMapPin className="contact-icon" />
            <h3>Visit Us</h3>
            <p>123 Real Estate Ave<br />San Francisco, CA 94105</p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of satisfied customers who found their perfect property with NestFindr.</p>
        <div className="cta-buttons">
          <button className='btn-primary-about' onClick={handleBrowseClick}>Browse Properties</button>
          <button className='btn-secondary-about' onClick={handleContactClick}>Contact Sales</button>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default About;
