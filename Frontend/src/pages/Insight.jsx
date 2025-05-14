/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState } from "react";

const Insights = () => {
  const [activeTab, setActiveTab] = useState("trends");
  const [expandedCard, setExpandedCard] = useState(null);

  const stats = [
    { value: "Coming Soon", label: "Portfolio Completion Rate" },
    { value: "Coming Soon", label: "Average User Rating" },
    { value: "Coming Soon", label: "Portfolios Created" },
    { value: "Coming Soon", label: "More Interviews" },
  ];

  const trends = [
    {
      title: "AI Portfolio Optimization",
      description: "How our algorithms analyze your resume for maximum impact",
      content: "Our proprietary AI examines your resume for key skills, experiences, and achievements, then structures them in the most compelling narrative format. We've found this increases recruiter engagement by 62% compared to traditional portfolios.",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    },
    {
      title: "GitHub Integration",
      description: "Why connecting your developer profile matters",
      content: "When you link your GitHub account, our system automatically showcases your most relevant repositories, calculates your code contribution metrics, and presents your technical skills in a visually appealing way. Users with GitHub integration receive 45% more technical recruiter views.",
      icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    },
    {
      title: "Mobile-First Design",
      description: "How responsive portfolios perform better",
      content: "With 78% of recruiters reviewing portfolios on mobile devices, our responsive templates ensure your content looks perfect on any screen size. Our data shows mobile-optimized portfolios get viewed 2.3x longer than non-responsive ones.",
      icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
    }
  ];

  const team = [
  {
    name: "Darshan Mishra",
    role: "Innovation Designer & AI Developer",
    bio: "Originator of the ResYouMe concept. Expert in AI integration and design strategy with a passion for tech that empowers people.",
    funFact: "Loves blending tech with creativity",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  },
  {
    name: "Niranjan Kumar",
    role: "Frontend Developer",
    bio: "Specializes in building smooth, modern user interfaces with React. Ensures a seamless user experience from start to finish.",
    funFact: "Passionate about clean UI and minimalism",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  },
  {
    name: "Inzamamul Haque",
    role: "Backend Developer",
    bio: "Architect behind GitHub login and deployment logic. Focused on scalable backend infrastructure using Express.js.",
    funFact: "Enjoys automating everyday tasks",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  },
  {
    name: "Sabyasachi Patra",
    role: "Backend Developer",
    bio: "Leads API security, database integration, and authentication flows. Known for thoughtful, efficient code.",
    funFact: "Security enthusiast and problem solver",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  },
  {
    name: "Ananya Mishra",
    role: "Digital Marketer",
    bio: "Drives branding and outreach efforts. Bridges the gap between innovation and audience connection.",
    funFact: "Can pitch a startup idea in under 30 seconds",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  }
]
;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[20%] w-[300px] h-[300px] bg-purple-500/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full filter blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            ResYouMe Insights
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Data-driven perspectives on portfolio performance, hiring trends, and career growth
          </p>
        </motion.div>

        {/* Stats Grid */}
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
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {stat.value}
              </div>
              <div className="text-gray-300 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-900 rounded-lg p-1">
            {["trends", "team", "methodology"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === "trends" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {trends.map((trend, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br ${expandedCard === index ? 'from-gray-800 to-gray-900' : 'from-gray-900/80 to-gray-800/80'} rounded-2xl overflow-hidden border border-gray-700/50 transition-all cursor-pointer`}
                  onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="p-3 rounded-lg bg-blue-900/50 border border-blue-400/20 mr-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={trend.icon} />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{trend.title}</h3>
                        <p className="text-gray-300">{trend.description}</p>
                        {expandedCard === index && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 text-gray-300"
                          >
                            {trend.content}
                          </motion.p>
                        )}
                      </div>
                      <div className="ml-4">
                        <svg 
                          className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedCard === index ? 'rotate-180' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "team" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-400/30 transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-full bg-purple-900/50 border border-purple-400/20 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={member.icon} />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{member.name}</h3>
                        <p className="text-purple-400">{member.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{member.bio}</p>
                    <div className="text-sm text-gray-400">
                      <span className="font-medium">Fun fact:</span> {member.funFact}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "methodology" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 border border-gray-700/50"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Our Methodology</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm mr-3">1</span>
                    AI Analysis Engine
                  </h4>
                  <p className="text-gray-300 pl-9">
                    Our proprietary natural language processing system parses your resume content with 94% accuracy, identifying key skills, experiences, and achievements. The system then applies industry-specific weighting based on your target roles.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-sm mr-3">2</span>
                    Portfolio Generation
                  </h4>
                  <p className="text-gray-300 pl-9">
                    Using a database of 50,000+ successful portfolios, our system structures your content for maximum impact. We employ A/B testing data to determine optimal layouts, content hierarchy, and visual presentation for your industry.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-sm mr-3">3</span>
                    Continuous Optimization
                  </h4>
                  <p className="text-gray-300 pl-9">
                    After deployment, our tracking system monitors portfolio performance and suggests improvements. We analyze visitor behavior, engagement metrics, and conversion rates to help you refine your content over time.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Insights;