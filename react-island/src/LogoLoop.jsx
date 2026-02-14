import React from 'react';
import './logoLoop.css';

const LogoLoop = () => {
    // Logo data dengan URL dari devicon
    const logos = [
        { name: 'HTML', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'CSS', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
        { name: 'JavaScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'Python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'Figma', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
        { name: 'Java', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'Kotlin', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
        { name: 'Flutter', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
        { name: 'MySQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'Dart', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
    ];

    // Split logos untuk 2 baris
    const row1Logos = logos.slice(0, 5);
    const row2Logos = logos.slice(5, 10);

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
