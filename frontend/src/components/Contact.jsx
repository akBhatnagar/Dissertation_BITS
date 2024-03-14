import React from 'react'
import FooterMenu from './FooterMenu'
import HeaderMenu from './HeaderMenu'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaGoogle } from 'react-icons/fa';
import { facebookUrl, twitterUrl, gmailUrl, linkedinUrl } from '../utils/Constants';
import FeedbackForm from './FeedbackForm';

export default function Contact() {

  return (
    <React.Fragment>
      <HeaderMenu />
      <div className="flex items-center justify-center min-h-screen bg-gray-400">
        <div className="flex flex-col max-w-2xl p-8 shadow-md rounded-lg bg-gray-300">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <div className="flex flex-col mb-4">
            <div className="contact-item flex items-center mb-2">
              <FaPhone className="text-xl" />
              <span className="ml-2">Phone: +91 123-456-7890</span>
            </div>
            <div className="contact-item flex items-center mb-2">
              <FaEnvelope className="text-xl" />
              <span className="ml-2">Email: info@ems.com</span>
            </div>
            <div className="contact-item flex items-center">
              <FaMapMarkerAlt className="text-xl" />
              <span className="ml-2">Address: 2nd Street, Bengaluru, India</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-w-2xl p-8 shadow-md rounded-lg ml-4 bg-gray-300">
          <h2 className="text-3xl font-bold mb-4">Connect with Us</h2>
          <div className="flex flex-col mb-4">
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="social-link flex items-center mb-2">
              <FaFacebook className="text-xl" />
              <span className="ml-2">Facebook</span>
            </a>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="social-link flex items-center mb-2">
              <FaTwitter className="text-xl" />
              <span className="ml-2">Twitter</span>
            </a>
            <a href={gmailUrl} className="social-link flex items-center mb-2">
              <FaEnvelope className="text-xl" />
              <span className="ml-2">Email</span>
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-link flex items-center">
              <FaLinkedin className="text-xl" />
              <span className="ml-2">LinkedIn</span>
            </a>
            {/* <a href="https://gmail.com" target="_blank" rel="noopener noreferrer" className="social-link flex items-center">
            <FaGoogle className="text-xl" />
            <span className="ml-2 mt-2">Gmail</span>
          </a> */}
          </div>
        </div>
        <div className="flex flex-col max-w-2xl rounded-lg ml-32 bg-gray-300">
          <FeedbackForm />
        </div>
      </div>
      <FooterMenu />
    </React.Fragment>
  )
}
