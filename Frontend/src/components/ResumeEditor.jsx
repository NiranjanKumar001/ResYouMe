import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/global.css';
import { UserContext } from '../context/AuthContext';

const ResumeEditor = ({ initialData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobRole: '',
    about: '',
    skills: [],
    socialLinks: {
      github: '',
      linkedin: '',
      email: ''
    },
    education: [{ institution: '', degree: '', field: '', startDate: '', endDate: '' }],
    experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
    projects: [{ name: '', description: '', technologies: [], url: '' }],
    certifications: [],
    languages: []
  });

  // Add a new state for raw text inputs
  const [rawInputs, setRawInputs] = useState({
    skills: '',
    certifications: '',
    languages: '',
    projectTechnologies: {}
  });

  const { user } = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const sections = ['personal', 'social', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'thank you'];

  // eslint-disable-next-line no-unused-vars
  const scrollbarHidingStyle = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    overflow: 'auto'
  };

  // Initialize form data with user verification
  useEffect(() => {
    if (!user) {
      setUnauthorized(true);
      return;
    }

    if (initialData) {
      // Verify that the resume belongs to the current user
      if (initialData.userId && initialData.userId !== user.id) {
        setUnauthorized(true);
        return;
      }

      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        jobRole: initialData.jobRole || '',
        about: initialData.about || '',
        skills: Array.isArray(initialData.skills) ? initialData.skills : [],
        socialLinks: {
          github: initialData.socialLinks?.github || '',
          linkedin: initialData.socialLinks?.linkedin || '',
          email: initialData.socialLinks?.email || ''
        },
        education: initialData.education?.length > 0 
          ? initialData.education.map(edu => ({
              institution: edu.institution || '',
              degree: edu.degree || '',
              field: edu.field || '',
              startDate: edu.startDate || '',
              endDate: edu.endDate || ''
            }))
          : [{ institution: '', degree: '', field: '', startDate: '', endDate: '' }],
        experience: initialData.experience?.length > 0
          ? initialData.experience.map(exp => ({
              company: exp.company || '',
              position: exp.position || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              description: exp.description || ''
            }))
          : [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
        projects: initialData.projects?.length > 0
          ? initialData.projects.map(proj => ({
              name: proj.name || '',
              description: proj.description || '',
              technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
              url: proj.url || ''
            }))
          : [{ name: '', description: '', technologies: [], url: '' }],
        certifications: Array.isArray(initialData.certifications) ? initialData.certifications : [],
        languages: Array.isArray(initialData.languages) ? initialData.languages : []
      });
      
      // Initialize the raw inputs state
      setRawInputs({
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : '',
        certifications: Array.isArray(initialData.certifications) ? initialData.certifications.join(', ') : '',
        languages: Array.isArray(initialData.languages) ? initialData.languages.join(', ') : '',
        projectTechnologies: initialData.projects?.length > 0
          ? initialData.projects.reduce((acc, proj, index) => {
              acc[index] = Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '';
              return acc;
            }, {})
          : { 0: '' }
      });
    }
  }, [initialData, user]);

  // Handle input changes
  const handleChange = (section, field, value, index = null) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      if (index !== null && Array.isArray(newData[section])) {
        newData[section] = [...newData[section]];
        newData[section][index] = { ...newData[section][index], [field]: value };
      } else if (section === 'socialLinks') {
        newData.socialLinks = { ...newData.socialLinks, [field]: value };
      } else if (field) {
        newData[field] = value;
      } else {
        newData[section] = value;
      }
      
      return newData;
    });
  };

  // Add new item to array fields
  const addItem = (section) => {
    setFormData(prevData => {
      const template = {
        experience: { company: '', position: '', startDate: '', endDate: '', description: '' },
        education: { institution: '', degree: '', field: '', startDate: '', endDate: '' },
        projects: { name: '', description: '', technologies: [], url: '' }
      };
      
      return {
        ...prevData,
        [section]: [...prevData[section], template[section]]
      };
    });

    // Initialize raw input for new project technologies if needed
    if (section === 'projects') {
      setRawInputs(prev => ({
        ...prev,
        projectTechnologies: {
          ...prev.projectTechnologies,
          [formData.projects.length]: ''
        }
      }));
    }
  };

  // Remove item from array fields
  const removeItem = (section, index) => {
    if (formData[section].length > 1) {
      setFormData(prevData => ({
        ...prevData,
        [section]: prevData[section].filter((_, i) => i !== index)
      }));

      // Update project technologies raw inputs if needed
      if (section === 'projects') {
        setRawInputs(prev => {
          const newProjectTechnologies = { ...prev.projectTechnologies };
          delete newProjectTechnologies[index];
          
          // Reindex the remaining items
          const updatedProjectTechnologies = {};
          Object.keys(newProjectTechnologies)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .forEach((key, i) => {
              updatedProjectTechnologies[i] = newProjectTechnologies[key];
            });
          
          return {
            ...prev,
            projectTechnologies: updatedProjectTechnologies
          };
        });
      }
    }
  };

  // Update the raw input state on change
  const handleRawInputChange = (field, value, index = null) => {
    if (index !== null) {
      // For project technologies
      setRawInputs(prev => ({
        ...prev,
        projectTechnologies: {
          ...prev.projectTechnologies,
          [index]: value
        }
      }));
    } else {
      // For other fields
      setRawInputs(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Process the raw input on blur
  const processArrayInput = (field, index = null) => {
    if (index !== null) {
      // For project technologies
      const itemsArray = rawInputs.projectTechnologies[index].split(',').map(item => item.trim()).filter(Boolean);
      setFormData(prevData => {
        const newProjects = [...prevData.projects];
        newProjects[index] = { ...newProjects[index], technologies: itemsArray };
        return {
          ...prevData,
          projects: newProjects
        };
      });
    } else {
      // For other fields
      const itemsArray = rawInputs[field].split(',').map(item => item.trim()).filter(Boolean);
      setFormData(prevData => ({
        ...prevData,
        [field]: itemsArray
      }));
    }
  };

  // Validate current section before moving to next
  const validateCurrentSection = () => {
    const newErrors = {};

    if (activeSection === 'personal') {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone is required';
      }

      if (!formData.jobRole.trim()) {
        newErrors.jobRole = 'Job Role is required';
      }

      if (!formData.about.trim()) {
        newErrors.about = 'About is required';
      }
    }

    if (activeSection === 'social') {
      if (!formData.socialLinks.github.trim()) {
        newErrors.github = 'GitHub URL is required';
      }
      
      if (!formData.socialLinks.linkedin.trim()) {
        newErrors.linkedin = 'LinkedIn URL is required';
      }
      
      if (!formData.socialLinks.email.trim()) {
        newErrors.socialEmail = 'Email for social links is required';
      }
    }

    if (activeSection === 'experience') {
      formData.experience.forEach((exp, index) => {
        if (!exp.company.trim()) {
          newErrors[`experience_${index}_company`] = 'Company name is required';
        }
        if (!exp.position.trim()) {
          newErrors[`experience_${index}_position`] = 'Position is required';
        }
        if (!exp.startDate.trim()) {
          newErrors[`experience_${index}_startDate`] = 'Start date is required';
        }
        if (!exp.endDate.trim()) {
          newErrors[`experience_${index}_endDate`] = 'End date is required';
        }
        if (!exp.description.trim()) {
          newErrors[`experience_${index}_description`] = 'Description is required';
        }
      });
    }

    if (activeSection === 'education') {
      formData.education.forEach((edu, index) => {
        if (!edu.institution.trim()) {
          newErrors[`education_${index}_institution`] = 'Institution name is required';
        }
        if (!edu.degree.trim()) {
          newErrors[`education_${index}_degree`] = 'Degree is required';
        }
        if (!edu.field.trim()) {
          newErrors[`education_${index}_field`] = 'Field of study is required';
        }
        if (!edu.startDate.trim()) {
          newErrors[`education_${index}_startDate`] = 'Start date is required';
        }
        if (!edu.endDate.trim()) {
          newErrors[`education_${index}_endDate`] = 'End date is required';
        }
      });
    }

    if (activeSection === 'skills') {
      if (formData.skills.length === 0) {
        newErrors.skills = 'At least one skill is required';
      }
    }

    if (activeSection === 'projects') {
      formData.projects.forEach((proj, index) => {
        if (!proj.name.trim()) {
          newErrors[`project_${index}_name`] = 'Project name is required';
        }
        if (!proj.description.trim()) {
          newErrors[`project_${index}_description`] = 'Project description is required';
        }
        if (proj.technologies.length === 0) {
          newErrors[`project_${index}_technologies`] = 'At least one technology is required';
        }
        // URL is not required
      });
    }

    if (activeSection === 'certifications') {
      if (formData.certifications.length === 0) {
        newErrors.certifications = 'At least one certification is required';
      }
    }

    if (activeSection === 'languages') {
      if (formData.languages.length === 0) {
        newErrors.languages = 'At least one language is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next section navigation
  const handleNext = () => {
    if (!validateCurrentSection()) {
      return;
    }

    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    }
  };

  // Handle previous section navigation
  const handlePrevious = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1]);
    }
  };

  // Handle form submission with user verification
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCurrentSection()) {
      return;
    }

    if (!user) {
      setErrors({ submit: 'You must be logged in to save a resume' });
      return;
    }

    setIsSubmitting(true);

    try {
      const resumeId = initialData?._id || localStorage.getItem('resumeId');
      const API_BASE_URL = import.meta.env.VITE_API_URL;

      if (!resumeId) {
        throw new Error("No resume ID found");
      }

      const authToken = Cookies.get('authToken');
      
      // Prepare data according to Mongoose schema
      const requestData = {
        parsedData: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          jobRole: formData.jobRole.trim() || undefined,
          about: formData.about.trim() || undefined,
          skills: formData.skills.filter(skill => skill.trim() !== ''),
          socialLinks: {
            github: formData.socialLinks.github.trim() || undefined,
            linkedin: formData.socialLinks.linkedin.trim() || undefined,
            email: formData.socialLinks.email.trim() || undefined
          },
          education: formData.education
            .filter(edu => edu.institution.trim() !== '')
            .map(edu => ({
              institution: edu.institution.trim(),
              degree: edu.degree.trim(),
              field: edu.field.trim() || undefined,
              startDate: edu.startDate.trim() || undefined,
              endDate: edu.endDate.trim() || undefined
            })),
          experience: formData.experience
            .filter(exp => exp.company.trim() !== '')
            .map(exp => ({
              company: exp.company.trim(),
              position: exp.position.trim(),
              startDate: exp.startDate.trim() || undefined,
              endDate: exp.endDate.trim() || undefined,
              description: exp.description.trim() || undefined
            })),
          projects: formData.projects
            .filter(proj => proj.name.trim() !== '')
            .map(proj => ({
              name: proj.name.trim(),
              description: proj.description.trim() || undefined,
              technologies: proj.technologies.filter(tech => tech.trim() !== ''),
              url: proj.url.trim() || undefined
            })),
          certifications: formData.certifications.filter(cert => cert.trim() !== ''),
          languages: formData.languages.filter(lang => lang.trim() !== ''),
          rawContent: initialData?.parsedData?.rawContent || ''
        }
      };

      // Remove undefined values to prevent schema validation errors
      const cleanData = JSON.parse(JSON.stringify(requestData));
      console.log("Sending data to server:", cleanData);

      const response = await axios.patch(
        `${API_BASE_URL}/api/resumes/${resumeId}`,
        cleanData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
          },
          withCredentials: true
        }
      );

      console.log('Resume updated successfully:', response.data);
      onComplete(response.data);
    } catch (error) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      
      setErrors({
        submit: error.response?.data?.message || 
               (error.response?.data?.errors && JSON.stringify(error.response.data.errors)) ||
               error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (unauthorized) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
        <p>You don't have permission to access this resume.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-white">Review & Edit Your Information</h2>
      <p className="text-sm text-gray-300 mb-6">
        We've extracted information from your resume. Please review and make any necessary changes.
      </p>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-3 py-1.5 text-xs md:text-sm rounded-t-lg transition-all ${
              activeSection === section
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {activeSection === 'personal' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="name">
                Full Name*
              </label>
              <input
                type="text"
                id="name"
                className={`w-full bg-gray-800 border ${
                  errors.name ? 'border-red-500' : 'border-gray-600'
                } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.name}
                onChange={(e) => handleChange(null, 'name', e.target.value)}
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="email">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full bg-gray-800 border ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={formData.email}
                  onChange={(e) => handleChange(null, 'email', e.target.value)}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-gray-300 mb-2" htmlFor="phone">
                  Phone*
                </label>
                <input
                  type="tel"
                  id="phone"
                  className={`w-full bg-gray-800 border ${
                    errors.phone ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={formData.phone}
                  onChange={(e) => handleChange(null, 'phone', e.target.value)}
                  required
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2" htmlFor="jobRole">
                Job Role*
              </label>
              <input
                type="text"
                id="jobRole"
                className={`w-full bg-gray-800 border ${
                  errors.jobRole ? 'border-red-500' : 'border-gray-600'
                } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.jobRole}
                onChange={(e) => handleChange(null, 'jobRole', e.target.value)}
                required
              />
              {errors.jobRole && <p className="text-red-500 text-sm mt-1">{errors.jobRole}</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2" htmlFor="about">
                About*
              </label>
              <textarea
                style={scrollbarHidingStyle}
                id="about"
                rows="3"
                className={`w-full bg-gray-800 resize-none border ${
                  errors.about ? 'border-red-500' : 'border-gray-600'
                } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.about}
                onChange={(e) => handleChange(null, 'about', e.target.value)}
                required
              ></textarea>
              {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
            </div>
          </div>
        )}

        {activeSection === 'social' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="github">
                GitHub*
              </label>
              <input
                type="url"
                id="github"
                className={`w-full bg-gray-800 border ${
                  errors.github ? 'border-red-500' : 'border-gray-600'
                } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.socialLinks.github}
                onChange={(e) => handleChange('socialLinks', 'github', e.target.value)}
                placeholder="https://github.com/username"
                required
              />
              {errors.github && <p className="text-red-500 text-sm mt-1">{errors.github}</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2" htmlFor="linkedin">
                LinkedIn*
              </label>
              <input
                type="url"
                id="linkedin"
                className={`w-full bg-gray-800 border ${
                  errors.linkedin ? 'border-red-500' : 'border-gray-600'
                } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleChange('socialLinks', 'linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                required
              />
              {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}
            </div>

            <div>
              <label className="block text-gray-300 mb-2" htmlFor="socialEmail">
                Email (for social links)*
              </label>
              <input
                type="email"
                id="socialEmail"
                className={`w-full bg-gray-800 border ${
                  errors.socialEmail ? 'border-red-500' : 'border-gray-600'
                } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.socialLinks.email}
                onChange={(e) => handleChange('socialLinks', 'email', e.target.value)}
                required
              />
              {errors.socialEmail && <p className="text-red-500 text-sm mt-1">{errors.socialEmail}</p>}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {activeSection === 'experience' && (
          <div>
            {formData.experience.map((exp, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Experience #{index + 1}</h3>
                  {formData.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('experience', index)}
                      className="text-red-400 hover:text-red-300"
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
                      className={`w-full bg-gray-800 border ${
                        errors[`experience_${index}_company`] ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={exp.company}
                      onChange={(e) => handleChange('experience', 'company', e.target.value, index)}
                      required
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
                      className={`w-full bg-gray-800 border ${
                        errors[`experience_${index}_position`] ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={exp.position}
                      onChange={(e) => handleChange('experience', 'position', e.target.value, index)}
                      required
                    />
                    {errors[`experience_${index}_position`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`experience_${index}_position`]}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor={`startDate-${index}`}>
                      Start Date*
                    </label>
                    <input
                      type="text"
                      id={`startDate-${index}`}
                      className={`w-full bg-gray-800 border ${
                        errors[`experience_${index}_startDate`] ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={exp.startDate}
                      onChange={(e) => handleChange('experience', 'startDate', e.target.value, index)}
                      placeholder="YYYY-MM-DD or MM/DD/YYYY"
                      required
                    />
                    {errors[`experience_${index}_startDate`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`experience_${index}_startDate`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor={`endDate-${index}`}>
                      End Date*
                    </label>
                    <input
                      type="text"
                      id={`endDate-${index}`}
                      className={`w-full bg-gray-800 border ${
                        errors[`experience_${index}_endDate`] ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={exp.endDate}
                      onChange={(e) => handleChange('experience', 'endDate', e.target.value, index)}
                      placeholder="YYYY-MM-DD or MM/DD/YYYY"
                      required
                    />
                    {errors[`experience_${index}_endDate`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`experience_${index}_endDate`]}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2" htmlFor={`description-${index}`}>
                    Description*
                  </label>
                  <textarea
                    style={scrollbarHidingStyle}
                    id={`description-${index}`}
                    rows="3"
                    className={`w-full bg-gray-800 resize-none border ${
                      errors[`experience_${index}_description`] ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={exp.description}
                    onChange={(e) => handleChange('experience', 'description', e.target.value, index)}
                    required
                  ></textarea>
                  {errors[`experience_${index}_description`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`experience_${index}_description`]}</p>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem('experience')}
              className="w-full py-1.5 text-xs md:text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 mb-4"
            >
              + Add Experience
            </button>
          </div>
        )}

        {/* Education Section */}
        {activeSection === 'education' && (
          <div>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Education #{index + 1}</h3>
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('education', index)}
                      className="text-red-400 hover:text-red-300"
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
                      className={`w-full bg-gray-800 border ${
                        errors[`education_${index}_institution`] ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={edu.institution}
                      onChange={(e) => handleChange('education', 'institution', e.target.value, index)}
                      required
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
                      className={`w-full bg-gray-800 border ${
                        errors[`education_${index}_degree`] ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={edu.degree}
                      onChange={(e) => handleChange('education', 'degree', e.target.value, index)}
                      required
                    />
                    {errors[`education_${index}_degree`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`education_${index}_degree`]}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2" htmlFor={`field-${index}`}>
                    Field of Study*
                  </label>
                  <input
                    type="text"
                    id={`field-${index}`}
                    className={`w-full bg-gray-800 border ${
                      errors[`education_${index}_field`] ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={edu.field}
                    onChange={(e) => handleChange('education', 'field', e.target.value, index)}
                    required
                  />
                  {errors[`education_${index}_field`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`education_${index}_field`]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor={`eduStartDate-${index}`}>
                      Start Date*
                    </label>
                    <input
                      type="text"
                      id={`eduStartDate-${index}`}
                      className={`w-full bg-gray-800 border ${
                        errors[`education_${index}_startDate`] ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={edu.startDate}
                      onChange={(e) => handleChange('education', 'startDate', e.target.value, index)}
                      placeholder="YYYY-MM-DD or MM/DD/YYYY"
                      required
                    />
                    {errors[`education_${index}_startDate`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`education_${index}_startDate`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor={`eduEndDate-${index}`}>
                      End Date*
                    </label>
                    <input
                      type="text"
                      id={`eduEndDate-${index}`}
                      className={`w-full bg-gray-800 border ${
                        errors[`education_${index}_endDate`] ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={edu.endDate}
                      onChange={(e) => handleChange('education', 'endDate', e.target.value, index)}
                      placeholder="YYYY-MM-DD or MM/DD/YYYY"
                      required
                    />
                    {errors[`education_${index}_endDate`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`education_${index}_endDate`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem('education')}
              className="w-full py-1.5 text-xs md:text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 mb-4"
            >
              + Add Education
            </button>
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="skills">
              Skills (comma separated)*
            </label>
            <textarea
              style={scrollbarHidingStyle}
              id="skills"
              rows="4"
              className={`w-full bg-gray-800 border resize-none ${
                errors.skills ? 'border-red-500' : 'border-gray-600'
              } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={rawInputs.skills}
              onChange={(e) => handleRawInputChange('skills', e.target.value)}
              onBlur={() => processArrayInput('skills')}
              placeholder="e.g., JavaScript, React, Node.js, Python"
              required
            ></textarea>
            {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}

            <div className="mt-4">
              <p className="text-gray-300 mb-2">Your Skills:</p>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm"
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
              <div key={index} className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Project #{index + 1}</h3>
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('projects', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2" htmlFor={`projectName-${index}`}>
                    Project Name*
                  </label>
                  <input
                    type="text"
                    id={`projectName-${index}`}
                    className={`w-full bg-gray-800 border ${
                      errors[`project_${index}_name`] ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={project.name}
                    onChange={(e) => handleChange('projects', 'name', e.target.value, index)}
                    required
                  />
                  {errors[`project_${index}_name`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`project_${index}_name`]}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2" htmlFor={`projectDescription-${index}`}>
                    Description*
                  </label>
                  <textarea
                    style={scrollbarHidingStyle}
                    id={`projectDescription-${index}`}
                    rows="3"
                    className={`w-full bg-gray-800 border resize-none ${
                      errors[`project_${index}_description`] ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={project.description}
                    onChange={(e) => handleChange('projects', 'description', e.target.value, index)}
                    required
                  ></textarea>
                  {errors[`project_${index}_description`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`project_${index}_description`]}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-2" htmlFor={`projectTech-${index}`}>
                    Technologies (comma separated)*
                  </label>
                  <input
                    type="text"
                    id={`projectTech-${index}`}
                    className={`w-full bg-gray-800 border ${
                      errors[`project_${index}_technologies`] ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={rawInputs.projectTechnologies[index] || ''}
                    onChange={(e) => handleRawInputChange('projectTechnologies', e.target.value, index)}
                    onBlur={() => processArrayInput('projectTechnologies', index)}
                    required
                  />
                  {errors[`project_${index}_technologies`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`project_${index}_technologies`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2" htmlFor={`projectUrl-${index}`}>
                    Project URL
                  </label>
                  <input
                    type="url"
                    id={`projectUrl-${index}`}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={project.url}
                    onChange={(e) => handleChange('projects', 'url', e.target.value, index)}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem('projects')}
              className="w-full py-1.5 text-xs md:text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 mb-4"
            >
              + Add Project
            </button>
          </div>
        )}

        {/* Certifications Section */}
        {activeSection === 'certifications' && (
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="certifications">
              Certifications (comma separated)*
            </label>
            <textarea
              style={scrollbarHidingStyle}
              id="certifications"
              rows="4"
              className={`w-full resize-none bg-gray-800 border ${
                errors.certifications ? 'border-red-500' : 'border-gray-600'
              } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={rawInputs.certifications}
              onChange={(e) => handleRawInputChange('certifications', e.target.value)}
              onBlur={() => processArrayInput('certifications')}
              placeholder="e.g., AWS Certified, Google Analytics, PMP — or, if not certified write: Proven hands-on expertise and a results-driven mindset in place of formal credentials."
              required
            ></textarea>
            {errors.certifications && <p className="text-red-500 text-sm mt-1">{errors.certifications}</p>}

            <div className="mt-4">
              <p className="text-gray-300 mb-2">Your Certifications:</p>
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Languages Section */}
        {activeSection === 'languages' && (
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="languages">
              Languages (comma separated)*
            </label>
            <textarea
              style={scrollbarHidingStyle}
              id="languages"
              rows="4"
              className={`w-full resize-none bg-gray-800 border ${
                errors.languages ? 'border-red-500' : 'border-gray-600'
              } rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={rawInputs.languages}
              onChange={(e) => handleRawInputChange('languages', e.target.value)}
              onBlur={() => processArrayInput('languages')}
              placeholder="e.g., English, Spanish, French"
              required
            ></textarea>
            {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}

            <div className="mt-4">
              <p className="text-gray-300 mb-2">Your Languages:</p>
              <div className="flex flex-wrap gap-2">
                {formData.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Thank you section */}
        {activeSection === 'thank you' && (
          <div className="text-center py-8">
            <h3 className="text-xl font-bold text-white mb-4">Almost Done!</h3>
            <p className="text-gray-300 mb-6">
              Thank you for providing all the information. Click the button below to save your resume.
            </p>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {errors.submit}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {activeSection === 'personal' ? (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors md:px-5 md:py-2.5"
              disabled={isSubmitting}
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors md:px-5 md:py-2.5"
              disabled={isSubmitting}
            >
              Previous
            </button>
          )}

          {activeSection !== sections[sections.length -1] ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed md:px-5 md:py-2.5"
              disabled={isSubmitting}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed md:px-5 md:py-2.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ResumeEditor;
