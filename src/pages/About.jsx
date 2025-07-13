import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiTrendingUp, 
  FiUsers, 
  FiAward, 
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

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const stats = [
    { icon: FiHome, value: '10,000+', label: 'Properties Listed' },
    { icon: FiUsers, value: '50,000+', label: 'Happy Customers' },
    { icon: FiTrendingUp, value: '98%', label: 'Success Rate' },
    { icon: FiAward, value: '15+', label: 'Years Experience' }
  ];

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
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      description: 'Technology leader passionate about innovation in real estate.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Sales',
      description: 'Customer experience expert dedicated to client satisfaction.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <motion.section 
        className="about-hero"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        <motion.div className="hero-content" variants={fadeInUp}>
          <h1>About NestFindr</h1>
          <p>Your trusted partner in finding the perfect property</p>
        </motion.div>
        <motion.div className="hero-image" variants={fadeInUp}>
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80" 
            alt="Modern real estate office" 
          />
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="stats-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div key={index} className="stat-card" variants={fadeInUp}>
              <stat.icon className="stat-icon" />
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        className="values-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
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
        variants={staggerChildren}
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
      <motion.section 
        className="team-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
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
        variants={staggerChildren}
      >
        <motion.h2 variants={fadeInUp}>Get In Touch</motion.h2>
        <motion.p variants={fadeInUp}>
          Ready to find your dream property? Our team is here to help you every step of the way.
        </motion.p>
        <div className="contact-grid">
          <motion.div className="contact-card" variants={fadeInUp}>
            <FiPhone className="contact-icon" />
            <h3>Call Us</h3>
            <p>+1 (555) 123-4567</p>
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
          <button className="btn-primary">Browse Properties</button>
          <button className="btn-secondary">Contact Sales</button>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
