/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState } from "react";

const About = () => {
  const [activeTimeline, setActiveTimeline] = useState("company");

  const companyTimeline = [
    {
      year: "2025",
      title: "Founded",
      description: "ResYouMe was founded by Team Musafir after recognizing the gap between traditional resumes and modern hiring needs.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z"
    },
    {
      year: "Coming Soon",
      title: "Coming Soon",
      description: "Coming Soon",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      year: "Coming Soon",
      title: "Coming Soon",
      description: "Coming Soon",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    },
    {
      year: "Coming Soon",
      title: "Coming Soon",
      description: "Coming Soon",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    }
  ];

  const missionTimeline = [
    {
      year: "Vision",
      title: "Democratize Opportunity",
      description: "We believe everyone deserves access to tools that showcase their true potential, regardless of background or technical skill.",
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      year: "Mission",
      title: "Bridge the Gap",
      description: "Transform static resumes into dynamic professional stories that get noticed in today's competitive job market.",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    },
    {
      year: "Values",
      title: "Core Principles",
      description: "Innovation, Accessibility, Authenticity, and Impact drive everything we build at ResYouMe.",
      icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
    }
  ];

  const stats = [
    { value: "5", label: "Core Team Members", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { value: "Coming Soon", label: "Portfolios Created", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { value: "Coming Soon", label: "Accuracy Rate", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { value: "Coming Soon", label: "Funding Raised", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full filter blur-[120px]"></div>
        <div className="absolute bottom-0 right-[20%] w-[300px] h-[300px] bg-purple-500/10 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">ResYouMe</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            We're transforming how professionals showcase their skills and experience in the digital age
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-purple-400/30 transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  {stat.value}
                </div>
              </div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Our Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center"
          >
            Our Story
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg text-gray-300 mb-8 text-center"
          >
            ResYouMe was born from a simple observation: traditional resumes don't do justice to modern professionals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 border border-gray-700/50"
          >
            <p className="text-gray-300 mb-6">
              In 2025, Team Musafir launched the company after recognizing a major challenge in the hiring process: traditional resumes were static and one-dimensional, making it hard to truly assess a candidate’s potential—even when they were highly qualified.            </p>
            <p className="text-gray-300 mb-6">
              This shared frustration sparked an idea within Team Musafir: what if professionals could effortlessly create dynamic, visually engaging portfolios that truly reflected their skills and potential? And what if AI could automate this process, making it accessible to everyone—regardless of their technical or design background?
            </p>
            <p className="text-gray-300">
              Launched in 2025, Musafir has evolved into a platform empowering professionals around the globe to stand out in a competitive job market. Our mission is clear: to make powerful personal branding tools available to everyone.
            </p>

          </motion.div>
        </div>

        {/* Timeline Tabs */}
        <div className="mb-10">
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-900 rounded-lg p-1">
              <button
                onClick={() => setActiveTimeline("company")}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${activeTimeline === "company" ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Company Timeline
              </button>
              <button
                onClick={() => setActiveTimeline("mission")}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${activeTimeline === "mission" ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Mission & Values
              </button>
            </div>
          </div>

          {/* Timeline Content */}
          <div className="max-w-4xl mx-auto">
            {activeTimeline === "company" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Vertical line */}
                <div className="absolute left-6 h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>

                {companyTimeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="relative pl-20 pb-10"
                  >
                    {/* Dot */}
                    <div className="absolute left-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border-4 border-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50">
                      <div className="text-sm font-semibold text-purple-400 mb-1">{item.year}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTimeline === "mission" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {missionTimeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-6 border border-gray-700/50 hover:border-purple-400/30 transition-all"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                        </svg>
                      </div>
                      <div className="text-sm font-semibold text-purple-400">{item.year}</div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center"
          >
            Meet the Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg text-gray-300 mb-12 text-center max-w-3xl mx-auto"
          >
            A diverse team of innovators passionate about changing how professionals present themselves
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: "Darshan Mishra", role: "Innovation Designer & AI Developer", funFact: "Loves blending tech with creativity" },
              { name: "Niranjan Kumar", role: "Frontend Developer", funFact: "Passionate about clean UI and minimalism" },
              { name: "Inzamamul Haque", role: "Backend Developer", funFact: "Enjoys automating everyday tasks" },
              { name: "Sabyasachi Patra", role: "Backend Developer", funFact: "Security enthusiast and problem solver" },
              { name: "Ananya Mishra", role: "Digital Marketer", funFact: "Can pitch a startup idea in under 30 seconds" }
            ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-6 border border-gray-700/50 hover:border-purple-400/30 transition-all text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-purple-400 mb-3">{member.role}</p>
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Fun fact:</span> {member.funFact}
                  </p>
                </motion.div>
              ))}
          </div>
        </div>

{/*         
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Join the ResYouMe Community</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Be part of the movement transforming how professionals showcase their careers
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
            Get Started
          </button>
        </motion.div> */}
      </div>
    </div>
  );
};

export default About;