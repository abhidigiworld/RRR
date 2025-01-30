import React from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiJavascript, SiReact, SiTailwindcss, SiNodedotjs, SiMongodb, SiFigma, SiAdobexd } from "react-icons/si";

const DeveloperCard = ({ name, role, description, image, skills, socialLinks }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl"
    >
        <div className="flex flex-col items-center">
            <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 p-1">
                    <img 
                        src={image} 
                        alt={name}
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    {role}
                </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
            <p className="text-gray-400 text-center mb-4">{description}</p>
            
            {/* Skills */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
                {skills.map((Skill, index) => (
                    <Skill key={index} className="text-2xl text-blue-400 hover:text-blue-300 transition-colors" />
                ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                        <link.icon className="text-2xl" />
                    </a>
                ))}
            </div>
        </div>
    </motion.div>
);

const AboutPage = () => {
    const developers = [
        {
            name: "Azhar",
            role: "UI Developer",
            description: "Passionate about creating beautiful and intuitive user interfaces. Specializes in React and modern frontend technologies.",
            image: "https://avatars.githubusercontent.com/bunnysayzz",
            skills: [SiReact, SiJavascript, SiTailwindcss],
            socialLinks: [
                { icon: FaGithub, url: "https://github.com/bunnysayzz" },
                { icon: FaLinkedin, url: "https://www.linkedin.com/in/azharuddindev" },
                { icon: FaTwitter, url: "https://x.com/apt_azhar" }
            ]
        },
        {
            name: "Deepak",
            role: "Designer",
            description: "Creative designer with an eye for detail. Transforms ideas into visually stunning experiences.",
            image: "https://avatars.githubusercontent.com/deepak-pro",
            skills: [SiFigma, SiAdobexd],
            socialLinks: [
                { icon: FaGithub, url: "https://github.com/deepak-pro" },
                { icon: FaLinkedin, url: "https://linkedin.com/in/deepak-pro" },
                { icon: FaTwitter, url: "https://twitter.com/deepak_pro" }
            ]
        },
        {
            name: "Abhishek",
            role: "Backend Developer",
            description: "Expert in building robust and scalable backend systems. Passionate about clean code and performance.",
            image: "https://avatars.githubusercontent.com/abhidigiworld",
            skills: [SiNodedotjs, SiMongodb],
            socialLinks: [
                { icon: FaGithub, url: "https://github.com/abhidigiworld" },
                { icon: FaLinkedin, url: "https://linkedin.com/in/abhidigiworld" },
                { icon: FaTwitter, url: "https://twitter.com/abhidigiworld" }
            ]
        },
        {
            name: "Ayush",
            role: "Developer",
            description: "Full-stack developer with a love for innovative solutions. Brings ideas to life through code.",
            image: "https://avatars.githubusercontent.com/ayushdev",
            skills: [SiReact, SiNodedotjs, SiMongodb],
            socialLinks: [
                { icon: FaGithub, url: "https://github.com/ayushdev" },
                { icon: FaLinkedin, url: "https://linkedin.com/in/ayushdev" },
                { icon: FaTwitter, url: "https://twitter.com/ayushdev" }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />
            
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold text-white mb-6"
                    >
                        About <span className="text-blue-500">RRR</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto mb-16"
                    >
                        We're a team of passionate developers and designers on a mission to revolutionize 
                        the way people approach their career development. Our AI-powered platform combines 
                        cutting-edge technology with human expertise to help you achieve your professional goals.
                    </motion.p>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-4 bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-center text-white mb-16"
                    >
                        Meet Our <span className="text-blue-500">Team</span>
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {developers.map((dev, index) => (
                            <DeveloperCard key={index} {...dev} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-white mb-8"
                    >
                        Our <span className="text-blue-500">Mission</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto"
                    >
                        To empower job seekers with AI-driven tools that make the job search process 
                        more efficient and effective. We believe in combining technology with human 
                        insight to create opportunities for everyone.
                    </motion.p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage;
