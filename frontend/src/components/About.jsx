import React from 'react'
import FooterMenu from './FooterMenu'
import HeaderMenu from './HeaderMenu'

export default function About() {

  return (
    <React.Fragment>
      <HeaderMenu />
      <div className="flex items-center justify-center min-h-screen bg-gray-400">
        <div className="max-w-2xl p-8 shadow-md rounded-lg bg-gray-300">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="mb-4">
            Hi there! I'm Akshay Bhatnagar, a passionate Senior Software Engineer based in Bengaluru. With a strong background in software development and a love for building innovative solutions, I thrive on challenges that push me to think outside the box.
          </p>
          <p className="mb-4">
            In my journey as a software engineer, I've had the opportunity to work on diverse projects, ranging from web applications to enterprise solutions. My expertise lies in full-stack development, where I enjoy crafting elegant frontend experiences with React and Vue.js, backed by robust backend systems using Node.js, Python, and Java.
          </p>
          <p className="mb-4">
            I believe in continuous learning and staying updated with the latest technologies to deliver cutting-edge solutions. Collaborating with talented teams and leveraging my problem-solving skills, I'm dedicated to creating software that not only meets but exceeds expectations.
          </p>
        </div>
      </div>
      <FooterMenu />
    </React.Fragment>
  )
}