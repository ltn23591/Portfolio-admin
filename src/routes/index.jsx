import React from 'react';
import { Routes, Route } from 'react-router';
import Sidebar from '../components/Sidebar';
import Dashboard from '../pages/Dashboard';
import LandingManager from '../pages/LandingManager';
import HeroManager from '../pages/HeroManager';
import AboutManager from '../pages/AboutManager';
import ProjectsManager from '../pages/ProjectsManager';
import ExperienceManager from '../pages/ExperienceManager';
import TestimonialsManager from '../pages/TestimonialsManager';
import LibrariesManager from '../pages/LibrariesManager';
import ExtensionsManager from '../pages/ExtensionsManager';
import Messages from '../pages/Messages';
import Settings from '../pages/Settings';

const AppRoutes = () => {
    return (
        <div className="flex min-h-screen bg-[#06090d]">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Right Main Scrollable Viewport */}
            <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/landing" element={<LandingManager />} />
                    <Route path="/hero" element={<HeroManager />} />
                    <Route path="/about" element={<AboutManager />} />
                    <Route path="/projects" element={<ProjectsManager />} />
                    <Route path="/experience" element={<ExperienceManager />} />
                    <Route path="/testimonials" element={<TestimonialsManager />} />
                    <Route path="/libraries" element={<LibrariesManager />} />
                    <Route path="/extensions" element={<ExtensionsManager />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </main>
        </div>
    );
};

export default AppRoutes;
