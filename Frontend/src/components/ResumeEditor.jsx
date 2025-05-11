import React, { useState } from 'react';

const ResumeEditor = ({ initialData, onComplete, onBack }) => {
  // Initialize state with parsed resume data
  const [formData, setFormData] = useState({
    personalInfo: initialData?.personalInfo || {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: ''
    },
    summary: initialData?.summary || '',
    experience: initialData?.experience || [
      { company: '', position: '', startDate: '', endDate: '', description: '', highlights: [] }
    ],
    education: initialData?.education || [
      { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }
    ],
    skills: initialData?.skills || [],
    projects: initialData?.projects || [
      { name: '', description: '', technologies: [], link: '' }
    ],
    certifications: initialData?.certifications || []
  });

  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('personalInfo');

  // Handle input changes
  const handleChange = (section, field, value, index = null) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      
      if (index !== null && Array.isArray(newData[section])) {
        // For array fields like experience, education, etc.
        newData[section] = [...newData[section]];
        newData[section][index] = { ...newData[section][index], [field]: value };
      } else if (section === 'personalInfo') {
        // For nested objects like personalInfo
        newData.personalInfo = { ...newData.personalInfo, [field]: value };
      } else {
        // For direct fields like summary
        newData[section] = value;
      }
      
      return newData;
    });
  };

  // Add new item to array fields
  const addItem = (section) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      
      if (section === 'experience') {
        newData.experience = [...newData.experience, { 
          company: '', position: '', startDate: '', endDate: '', description: '', highlights: [] 
        }];
      } else if (section === 'education') {
        newData.education = [...newData.education, { 
          institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' 
        }];
      } else if (section === 'projects') {
        newData.projects = [...newData.projects, { 
          name: '', description: '', technologies: [], link: '' 
        }];
      } else if (section === 'certifications') {
        newData.certifications = [...newData.certifications, ''];
      }
      
      return newData;
    });
  };

  // Remove item from array fields
  const removeItem = (section, index) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      
      if (Array.isArray(newData[section]) && newData[section].length > 1) {
        newData[section] = newData[section].filter((_, i) => i !== index);
      }
      
      return newData;
    });
  };

  // Handle skill changes
  const handleSkillChange = (value) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData(prevData => ({
      ...prevData,
      skills: skillsArray
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    // Validate personal info
    if (!formData.personalInfo.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.personalInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.personalInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Validate experience
    formData.experience.forEach((exp, index) => {
      if (!exp.company) {
        newErrors[`experience_${index}_company`] = 'Company name is required';
      }
      if (!exp.position) {
        newErrors[`experience_${index}_position`] = 'Position is required';
      }
    });
    
    // Validate education
    formData.education.forEach((edu, index) => {
      if (!edu.institution) {
        newErrors[`education_${index}_institution`] = 'Institution name is required';
      }
      if (!edu.degree) {
        newErrors[`education_${index}_degree`] = 'Degree is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete(formData);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Review & Edit Your Information</h2>
      <p className="text-gray-300 mb-6">
        We've extracted information from your resume. Please review and make any necessary changes.
      </p>
      
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700">
        {['personalInfo', 'experience', 'education', 'skills', 'projects', 'certifications'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-t-lg transition-all ${
              activeSection === section 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        {activeSection === 'personalInfo' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="fullName">
                  Full Name*
                </label>
                <input
                  type="text"
                  id="fullName"
                  className={`w-full bg-white/5 border ${errors.fullName ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  value={formData.personalInfo.fullName}
                  onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="title">
                  Professional Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={formData.personalInfo.title}
                  onChange={(e) => handleChange('personalInfo', 'title', e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="email">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  value={formData.personalInfo.email}
                  onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="phone">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="location">
                Location
              </label>
              <input
                type="text"
                id="location"
                className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={formData.personalInfo.location}
                onChange={(e) => handleChange('personalInfo', 'location', e.target.value)}
                placeholder="e.g. San Francisco, CA"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="website">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={formData.personalInfo.website}
                  onChange={(e) => handleChange('personalInfo', 'website', e.target.value)}
                  placeholder="e.g. https://yourwebsite.com"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="linkedin">
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedin"
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={formData.personalInfo.linkedin}
                  onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)}
                  placeholder="e.g. https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="github">
                GitHub
              </label>
              <input
                type="url"
                id="github"
                className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={formData.personalInfo.github}
                onChange={(e) => handleChange('personalInfo', 'github', e.target.value)}
                placeholder="e.g. https://github.com/yourusername"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="summary">
                Professional Summary
              </label>
              <textarea
                id="summary"
                rows="4"
                className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={formData.summary}
                onChange={(e) => handleChange('summary', null, e.target.value)}
                placeholder="Write a brief professional summary..."
              ></textarea>
            </div>
          </div>
        )}
        
        {/* Experience Section */}
        {activeSection === 'experience' && (
          <div>
            {formData.experience.map((exp, index) => (
              <div key={index} className="mb-8 p-4 bg-white/5 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Experience #{index + 1}</h3>
                  {formData.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('experience', index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor={`company-${index}`}>
                      Company*
                    </label>
                    <input
                      type="text"
                      id={`company-${index}`}
                      className={`w-full bg-white/5 border ${errors[`experience_${index}_company`] ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      value={exp.company}
                      onChange={(e) => handleChange('experience', 'company', e.target.value, index)}
                    />
                    {errors[`experience_${index}_company`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`experience_${index}_company`]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor={`position-${index}`}>
                      Position*
                    </label>
                    <input
                      type="text"
                      id={`position-${index}`}
                      className={`w-full bg-white/5 border ${errors[`experience_${index}_position`] ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      value={exp.position}
                      onChange={(e) => handleChange('experience', 'position', e.target.value, index)}
                    />
                    {errors[`experience_${index}_position`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`experience_${index}_position`]}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor={`startDate-${index}`}>
                      Start Date
                    </label>
                    <input
                      type="text"
                      id={`startDate-${index}`}
                      className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      value={exp.startDate}
                      onChange={(e) => handleChange('experience', 'startDate', e.target.value, index)}
                      placeholder="e.g. Jan 2020"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor={`endDate-${index}`}>
                      End Date
                    </label>
                    <input
                      type="text"
                      id={`endDate-${index}`}
                      className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      value={exp.endDate}
                      onChange={(e) => handleChange('experience', 'endDate', e.target.value, index)}
                      placeholder="e.g. Present"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2" htmlFor={`description-${index}`}>
                    Description
                  </label>
                  <textarea
                    id={`description-${index}`}
                    rows="4"
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={exp.description}
                    onChange={(e) => handleChange('experience', 'description', e.target.value, index)}
                    placeholder="Describe your responsibilities and achievements..."
                  ></textarea>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addItem('experience')}
              className="w-full py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              + Add Experience
            </button>
          </div>
        )}
        
        {/* Education Section */}
        {activeSection === 'education' && (
          <div>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-8 p-4 bg-white/5 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Education #{index + 1}</h3>
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('education', index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor={`institution-${index}`}>
                      Institution*
                    </label>
                    <input
                      type="text"
                      id={`institution-${index}`}
                      className={`w-full bg-white/5 border ${errors[`education_${index}_institution`] ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      value={edu.institution}
                      onChange={(e) => handleChange('education', 'institution', e.target.value, index)}
                    />
                    {errors[`education_${index}_institution`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`education_${index}_institution`]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor={`degree-${index}`}>
                      Degree*
                    </label>
                    <input
                      type="text"
                      id={`degree-${index}`}
                      className={`w-full bg-white/5 border ${errors[`education_${index}_degree`] ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      value={edu.degree}
                      onChange={(e) => handleChange('education', 'degree', e.target.value, index)}
                    />
                    {errors[`education_${index}_degree`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`education_${index}_degree`]}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2" htmlFor={`field-${index}`}>
                    Field of Study
                  </label>
                  <input
                    type="text"
                    id={`field-${index}`}
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={edu.field}
                    onChange={(e) => handleChange('education', 'field', e.target.value, index)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor={`eduStartDate-${index}`}>
                      Start Date
                    </label>
                    <input
                      type="text"
                      id={`eduStartDate-${index}`}
                      className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      value={edu.startDate}
                      onChange={(e) => handleChange('education', 'startDate', e.target.value, index)}
                      placeholder="e.g. 2018"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor={`eduEndDate-${index}`}>
                      End Date
                    </label>
                    <input
                      type="text"
                      id={`eduEndDate-${index}`}
                      className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      value={edu.endDate}
                      onChange={(e) => handleChange('education', 'endDate', e.target.value, index)}
                      placeholder="e.g. 2022"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor={`gpa-${index}`}>
                    GPA
                  </label>
                  <input
                    type="text"
                    id={`gpa-${index}`}
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={edu.gpa}
                    onChange={(e) => handleChange('education', 'gpa', e.target.value, index)}
                    placeholder="e.g. 3.8/4.0"
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addItem('education')}
              className="w-full py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              + Add Education
            </button>
          </div>
        )}
        
        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="skills">
              Skills (comma separated)
            </label>
            <textarea
              id="skills"
              rows="4"
              className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={formData.skills.join(', ')}
              onChange={(e) => handleSkillChange(e.target.value)}
              placeholder="e.g. JavaScript, React, Node.js, Python"
            ></textarea>
            
            <div className="mt-4">
              <p className="text-gray-300 mb-2">Your Skills:</p>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div>
            {formData.projects.map((project, index) => (
              <div key={index} className="mb-8 p-4 bg-white/5 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Project #{index + 1}</h3>
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('projects', index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2" htmlFor={`projectName-${index}`}>
                    Project Name
                  </label>
                  <input
                    type="text"
                    id={`projectName-${index}`}
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={project.name}
                    onChange={(e) => handleChange('projects', 'name', e.target.value, index)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2" htmlFor={`projectDescription-${index}`}>
                    Description
                  </label>
                  <textarea
                    id={`projectDescription-${index}`}
                    rows="3"
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={project.description}
                    onChange={(e) => handleChange('projects', 'description', e.target.value, index)}
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2" htmlFor={`projectTech-${index}`}>
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    id={`projectTech-${index}`}
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={project.technologies.join(', ')}
                    onChange={(e) => {
                      const techArray = e.target.value.split(',').map(tech => tech.trim()).filter(Boolean);
                      handleChange('projects', 'technologies', techArray, index);
                    }}
                    placeholder="e.g. React, Node.js, MongoDB"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor={`projectLink-${index}`}>
                    Project Link
                  </label>
                  <input
                    type="url"
                    id={`projectLink-${index}`}
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={project.link}
                    onChange={(e) => handleChange('projects', 'link', e.target.value, index)}
                    placeholder="e.g. https://github.com/yourusername/project"
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addItem('projects')}
              className="w-full py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              + Add Project
            </button>
          </div>
        )}
        
        {/* Certifications Section */}
        {activeSection === 'certifications' && (
          <div>
            <label className="block text-gray-300 mb-2">Certifications</label>
            
            {formData.certifications.map((cert, index) => (
              <div key={index} className="flex items-center mb-3">
                <input
                  type="text"
                  className="flex-grow bg-white/5 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={cert}
                  onChange={(e) => handleChange('certifications', null, e.target.value, index)}
                  placeholder={`Certification #${index + 1}`}
                />
                
                {formData.certifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem('certifications', index)}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addItem('certifications')}
              className="w-full py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 mt-2"
            >
              + Add Certification
            </button>
          </div>
        )}
        
        {/* Form Actions */}
        <div className="mt-8 flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="w-1/3 bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-600 transition-all duration-300"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-2/3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeEditor;
