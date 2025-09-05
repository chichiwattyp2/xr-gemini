
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { Camera, Layers, PlayCircle, Code, ChevronRight } from 'lucide-react';
import { MOCK_EXPERIENCES } from '../../data/mockData';
import Carousel3D from '../../components/ui/Carousel3D';
import ExperienceCard from '../../components/ExperienceCard';
import LessonCard from '../../components/ui/LessonCard';
import { XRBadge, DeviceBadge } from '../../components/ui/XRBadges';
import { useAuth } from '../../hooks/useAuth';

const FeatureCard: React.FC<{ icon: React.ReactElement<{ size?: number, strokeWidth?: number }>; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 glass rounded-2xl">
    <div className="mb-4 text-accent-blue">{React.cloneElement(icon, { size: 48, strokeWidth: 1.5 })}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const HomePage: React.FC = () => {
  const techDemos = MOCK_EXPERIENCES.filter(exp => exp.tags.includes('Tech Demo'));
  const { isCreator } = useAuth();
  
  return (
    <div className="space-y-24 md:space-y-32 bg-stage animate-fade-in">
      {/* Hero Section */}
      <section className="text-center pt-20 pb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white animate-slide-up [animation-delay:0.1s]">
          Step Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">Volumetric Reality</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300 animate-slide-up [animation-delay:0.2s]">
          VoluSphere is the end-to-end platform for creating, sharing, and experiencing breathtaking 6-DoF volumetric video.
        </p>
        <div className="mt-8 flex justify-center gap-4 animate-slide-up [animation-delay:0.3s]">
          <Link to="/explore">
            <Button size="lg" className="focus-ring">Explore demos</Button>
          </Link>
          {isCreator && (
            <Link to="/creator/new">
              <Button size="lg" variant="secondary" className="focus-ring bg-accent-blue text-white">Start creating</Button>
            </Link>
          )}
        </div>
      </section>

      {/* "What is VoluSphere" Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">The Future of Immersive Content</h2>
          <p className="mt-2 text-gray-400">From capture to headset, a seamless pipeline for true presence.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Camera />}
            title="Capture Reality"
            description="Upload multi-cam video or image sequences. Our pipeline handles the rest."
          />
          <FeatureCard
            icon={<Layers />}
            title="Reconstruct in 3D"
            description="We transform your 2D footage into dynamic Gaussian Splat assets, ready for 6-DoF exploration."
          />
          <FeatureCard
            icon={<PlayCircle />}
            title="Publish & Experience"
            description="Share your creations with the world and experience them in true XR on supported devices."
          />
        </div>
      </section>

       {/* For Creators Section */}
      {isCreator && (
        <section>
          <div className="max-w-4xl mx-auto p-8 text-center glass rounded-2xl">
            <h2 className="text-3xl font-bold text-white">For Creators</h2>
            <p className="mt-2 text-gray-400 max-w-2xl mx-auto">Upload captures, process Gaussian splats, preview, and publish to the library.</p>
            <div className="mt-6 flex justify-center gap-4">
              <Link to="/creator/new">
                <Button className="focus-ring bg-accent-blue text-white">New Project</Button>
              </Link>
              <Link to="/creator/dashboard">
                <Button variant="secondary" className="focus-ring">Creator Dashboard</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Tech Demos Carousel Section */}
      <section>
         <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Technology in Motion</h2>
          <p className="mt-2 text-gray-400">Explore demos that showcase the power of the platform.</p>
        </div>
        <Carousel3D>
          {techDemos.map(exp => (
            <div key={exp.id} className="w-full h-full p-2">
              <ExperienceCard experience={exp} />
            </div>
          ))}
        </Carousel3D>
      </section>
      
      {/* Device/MR Badge Strip Section */}
      <section className="py-10">
        <div className="flex justify-center items-center flex-wrap gap-4 md:gap-8">
            <XRBadge type="6DoF" />
            <XRBadge type="MR-Ready" />
            <DeviceBadge device="android_xr"/>
            <DeviceBadge device="quest"/>
            <DeviceBadge device="pcvr"/>
        </div>
      </section>

       {/* Learning Tracks Section */}
      <section>
         <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Start Your Journey</h2>
          <p className="mt-2 text-gray-400">Master volumetric creation with our guided learning tracks.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            <LessonCard 
                title="Volumetric Capture 101"
                description="Learn the fundamentals of capturing high-quality footage for reconstruction."
                progress={75}
                linkTo="/creator-guide"
            />
             <LessonCard 
                title="Gaussian Splatting Deep Dive"
                description="Understand the technology behind 6-DoF volumetric video."
                progress={30}
                linkTo="/creator-guide"
            />
             <LessonCard 
                title="Publishing for XR"
                description="Optimize and package your experiences for native XR devices."
                progress={0}
                linkTo="/creator-guide"
            />
        </div>
      </section>

      {/* Final CTA */}
      {isCreator && (
        <section className="text-center py-10">
          <h2 className="text-3xl font-bold text-white">Ready to Create?</h2>
          <p className="mt-2 max-w-xl mx-auto text-gray-300">Join a community of pioneers building the next generation of immersive media. Sign up and start your first project today.</p>
          <div className="mt-8">
              <Link to="/creator/new">
                  <Button size="lg" className="focus-ring bg-accent-blue text-white">
                      Start Creating <ChevronRight className="ml-2"/>
                  </Button>
              </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
