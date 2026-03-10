import React from 'react';
import './logoLoop.css';

const LogoLoop = () => {
    // Logo data dengan URL dari devicon
    const logos = [
        { name: 'Google Colab', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Colaboratory_SVG_Logo.svg' },
        { name: 'PyTorch', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
        { name: 'JavaScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'Python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'Figma', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
        { name: 'PostgreSQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
        { name: 'Kotlin', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
        { name: 'Flutter', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
        { name: 'MySQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'Dart', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
        { name: 'Apache Spark', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg' },
        { name: 'Kafka', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg' },
        { name: 'Git', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'Docker', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    ];

    // Split logos untuk 2 baris
    const row1Logos = logos.slice(0, 7);
    const row2Logos = logos.slice(7, 14);

    return (
        <div className="react-island-container">
            {/* Row 1 - Scroll ke kiri */}
            <div className="react-island-row react-island-row-left">
                <div className="react-island-track">
                    {/* Duplicate 3x untuk seamless loop */}
                    {[...row1Logos, ...row1Logos, ...row1Logos].map((logo, index) => (
                        <div key={`row1-${index}`} className="react-island-card">
                            <img src={logo.url} alt={logo.name} loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Row 2 - Scroll ke kanan */}
            <div className="react-island-row react-island-row-right">
                <div className="react-island-track">
                    {/* Duplicate 3x untuk seamless loop */}
                    {[...row2Logos, ...row2Logos, ...row2Logos].map((logo, index) => (
                        <div key={`row2-${index}`} className="react-island-card">
                            <img src={logo.url} alt={logo.name} loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoLoop;
