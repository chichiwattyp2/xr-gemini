import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { Camera, Layers, PlayCircle, Headset } from 'lucide-react';

// FIX: Specify that the icon element can accept size and strokeWidth props.
const FeatureCard: React.FC<{ icon: React.ReactElement<{ size?: number, strokeWidth?: number }>; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800/50 rounded-lg">
    <div className="mb-4 text-primary-500 dark:text-primary-400">{React.cloneElement(icon, { size: 48, strokeWidth: 1.5 })}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

const HomePage: React.FC = () => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Step Into <span className="text-primary-500">Volumetric Reality</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
          VoluSphere is the end-to-end platform for creating, sharing, and experiencing breathtaking 6-DoF volumetric video.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/explore">
            <Button size="lg">Explore Experiences</Button>
          </Link>
          <Link to="/creator-guide">
            <Button size="lg" variant="secondary">Become a Creator</Button>
          </Link>
        </div>
      </section>

      {/* "How It Works" Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">The Future of Immersive Content</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">From capture to headset, a seamless pipeline for true presence.</p>
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

      {/* Demo Reel Section */}
       <section className="relative rounded-lg overflow-hidden">
        <img src="https://picsum.photos/seed/reel/1200/600" alt="Demo reel" className="w-full h-auto object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center p-8">
            <h2 className="text-3xl md:text-4xl font-bold">See it to Believe It</h2>
            <p className="mt-2 max-w-xl">Watch our latest demo reel to see the incredible quality and immersion possible with the VoluSphere platform.</p>
            <Button variant="outline" className="mt-6 text-white border-white hover:bg-white hover:text-black">
                <PlayCircle className="mr-2"/>
                Watch Demo Reel
            </Button>
        </div>
      </section>

      {/* Device Badges Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold">Experience Everywhere</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Optimized for a growing ecosystem of XR hardware.</p>
        <div className="mt-8 flex justify-center items-center gap-8 flex-wrap">
          <div className="flex items-center gap-3 text-lg font-medium">
            <Headset size={32}/>
            <span>Android XR</span>
          </div>
          <div className="flex items-center gap-3 text-lg font-medium">
            <Headset size={32}/>
            <span>Meta Quest</span>
          </div>
          <div className="flex items-center gap-3 text-lg font-medium">
            <Headset size={32}/>
            <span>PCVR (SteamVR)</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;