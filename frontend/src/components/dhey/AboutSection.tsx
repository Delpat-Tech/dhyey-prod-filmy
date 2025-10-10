'use client'

import Image from 'next/image'
import { Target, Eye, Heart, Zap, User, Lightbulb, Users, Award } from 'lucide-react'

const founderInfo = {
  name: "Bhawesh Sharma",
  stageName: "Baiman Bhawesh",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  currentProjects: [
    {
      title: "LETTER FROM DARKNESS",
      description: "An audio show that delves into the genres of horror, crime, fiction, and the supernatural",
      role: "Writer and Sound Director"
    },
    {
      title: "TATPAR",
      description: "A movie slated for release by the end of this year, exploring the genres of crime, suspense, and thriller",
      role: "Writer and Director",
      release: "End of this year"
    }
  ]
}

const sections = [
  {
    title: "About DHEY Production & Its Founder",
    icon: User,
    content: [
      {
        subtitle: "Introduction: Who is Bhawesh Sharma and what is DHEY Production?",
        text: "DHEY Production is a burgeoning production house founded by Bhawesh Sharma, an emerging force in the film industry, also known by his stage name, Baiman Bhawesh. DHEY Production was established with a singular, powerful mission: to empower talented and skilled individuals who have a passion for filmmaking but lack the necessary knowledge or resources to bring their stories to an audience. We serve as the bridge that connects raw talent with the screen."
      },
      {
        text: "Bhawesh brings a wealth of industry knowledge, with sufficient experience in both filmmaking and writing. Having worked on various film projects, he has a deep understanding of the creative and technical aspects of production. He is currently set to release two of his projects on YouTube:"
      }
    ],
    projects: founderInfo.currentProjects
  },
  {
    title: "The Vision: Why was DHEY Production Started?",
    icon: Lightbulb,
    content: [
      {
        text: "The inspiration behind DHEY Production is rooted in a nine-year journey of struggle and research. During this period, Bhawesh Sharma dedicated himself to honing his writing and storytelling skills. In the process, he met and interacted with over 2,700 people from all age groups."
      },
      {
        text: "Through these conversations, he discovered a recurring theme: a vast number of individuals with a deep desire to act in films, work in the industry, or see their names on the big screen. However, many of these talented people were held back by a lack of resources, while others lacked the knowledge to navigate the complexities of the film industry."
      },
      {
        text: "Moved by their stories and inspired by their passion, Bhawesh decided to create a platform to help them overcome these barriers. DHEY Production was born out of a desire to support these aspiring artists in their struggles and provide them with a launchpad to start their careers."
      }
    ]
  },
  {
    title: "Our Identity: Producer, Storyteller, and Community Builder",
    icon: Users,
    content: [
      {
        text: "Yes, DHEY Production is all three. We are producers who bring stories to life, storytellers who value the power of narrative, and community builders who create a supportive ecosystem for artists. Our identity is a unique blend of these three pillars, as we believe that great art is born from a combination of creative vision, technical execution, and a strong, collaborative community."
      }
    ]
  }
]

const brandSections = [
  {
    title: "The DHEY Production Personality",
    icon: Award,
    content: [
      {
        text: "DHEY Production is a professional and creative platform dedicated to showcasing the untapped creativity of aspiring artists. Our online presence reflects our commitment to quality, innovation, and approachability."
      },
      {
        text: "Our three-year vision is to establish DHEY Production as the definitive platform where every creative individual can take their first step into the industry. We aim to be the supportive force that \"pushes\" them in the right direction whenever and wherever they need it in their respective fields."
      }
    ]
  },
  {
    title: "If DHEY Production Were a Person",
    icon: User,
    content: [
      {
        text: "If DHEY Production were a person, it would be a mentor and a guide—a platform that provides creative individuals with the opportunity to take the first and most crucial step in their careers."
      },
      {
        text: "Once an artist connects with DHEY Production, they become a part of our family. Our vision is not to profit from our artists or to exploit their skills for commercial gain. Instead, DHEY Production stands as a constant pillar of support throughout an artist's journey, offering guidance and encouragement through their struggles."
      }
    ]
  },
  {
    title: "The Feeling We Want to Inspire",
    icon: Heart,
    content: [
      {
        text: "When visitors come to our website for the first time, we want them to feel a sense of trust and assurance. We want to instill the confidence that their dreams, their writing, and their stories are in the right hands. Our goal is to be the platform that they can rely on to present their creative vision to the world with the respect and professionalism it deserves."
      }
    ]
  }
]

export default function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            About DHEY Productions
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering storytellers and connecting creative minds with the world of filmmaking
          </p>
        </div>

        {/* Founder Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Meet the Founder
                </h3>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-purple-600">
                  {founderInfo.name} ({founderInfo.stageName})
                </h4>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    DHEY Production is a burgeoning production house founded by Bhawesh Sharma, an emerging force in the film industry, also known by his stage name, Baiman Bhawesh.
                  </p>
                  <p>
                    DHEY Production was established with a singular, powerful mission: to empower talented and skilled individuals who have a passion for filmmaking but lack the necessary knowledge or resources to bring their stories to an audience. We serve as the bridge that connects raw talent with the screen.
                  </p>
                  <p>
                    Bhawesh brings a wealth of industry knowledge, with sufficient experience in both filmmaking and writing. Having worked on various film projects, he has a deep understanding of the creative and technical aspects of production.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                <Image
                  src={founderInfo.image}
                  alt={founderInfo.name}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20"></div>
            </div>
          </div>

          {/* Current Projects */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
            <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">Current Projects</h4>
            <div className="grid md:grid-cols-2 gap-6">
              {founderInfo.currentProjects.map((project, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                  <h5 className="text-lg font-bold text-purple-600 mb-2">{project.title}</h5>
                  <p className="text-gray-700 mb-3">{project.description}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">{project.role}</span>
                    {project.release && (
                      <span className="ml-auto text-purple-600">📅 {project.release}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-20">
          {sections.map((section, index) => (
            <div key={index} className="border-l-4 border-purple-200 pl-8">
              <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {section.title}
                </h3>
              </div>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    {'subtitle' in item && item.subtitle && (
                      <h4 className="text-lg font-semibold text-purple-600 mb-3">
                        {item.subtitle}
                      </h4>
                    )}
                    <p className="mb-4">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Projects section for founder section */}
              {section.projects && (
                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  {section.projects.map((project, projectIndex) => (
                    <div key={projectIndex} className="bg-gray-50 rounded-xl p-6">
                      <h5 className="text-lg font-bold text-purple-600 mb-2">{project.title}</h5>
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      <p className="text-sm text-gray-600 font-medium">{project.role}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Brand Identity Section */}
          <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              The Brand & Its Identity
            </h3>

            <div className="space-y-12">
              {brandSections.map((section, index) => (
                <div key={index} className="border-l-4 border-purple-300 pl-8">
                  <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900">
                      {section.title}
                    </h4>
                  </div>

                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    {section.content.map((item, itemIndex) => (
                      <p key={itemIndex}>{item.text}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
