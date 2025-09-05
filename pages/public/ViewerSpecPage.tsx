import React from 'react';
import { Gamepad2, Move3d, PanelTop, Thermometer, BarChart, Tv, Minus, Plus } from 'lucide-react';
import { XRBadge } from '../../components/ui/XRBadges';
import Badge from '../../components/Badge';

const SpecSection: React.FC<{ icon: React.ReactElement<{ size?: number }>, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="glass p-6 rounded-2xl">
        <div className="flex items-center space-x-4 mb-4">
            <div className="text-accent-blue">{React.cloneElement(icon, { size: 28 })}</div>
            <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="prose prose-invert dark:prose-dark max-w-none text-gray-300">
            {children}
        </div>
    </div>
);

const ViewerSpecPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Native XR Viewer Specifications</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Technical details for the optimal 6DoF playback experience.</p>
      </header>

      <div className="space-y-8">
        <SpecSection icon={<Move3d />} title="Interactions & Locomotion">
          <ul>
            <li><strong>Teleport:</strong> Use the controller thumbstick to aim and release to teleport.</li>
            <li><strong>Snap-Turn:</strong> Flick the thumbstick left or right for comfortable turning.</li>
            <li><strong>Re-center:</strong> Long-press the menu button to re-center your view and play space.</li>
          </ul>
        </SpecSection>
        
        <SpecSection icon={<PanelTop />} title="HUD Controls">
           <p>A non-intrusive, wrist-mounted or floating HUD provides access to the following controls:</p>
           {/* HUD Mock */}
           <div className="mt-4 p-4 rounded-lg bg-black/30 border border-white/10">
              <div className="flex items-center justify-between text-white font-mono text-sm mb-4">
                <span>FPS: 89.9</span>
                <span>v2.1.0</span>
              </div>
              <div className="space-y-3">
                 {/* LOD Stepper */}
                 <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">LOD</span>
                    <div className="flex items-center space-x-2 p-1 rounded-full bg-black/20">
                      <button className="p-1 rounded-full hover:bg-white/20"><Minus size={14}/></button>
                      {/* FIX: Replaced XRBadge with a generic Badge as "LOD0" is not a valid type for XRBadge. */}
                      <Badge className="bg-gray-600 text-white px-3 py-1 font-semibold">LOD0</Badge>
                      <button className="p-1 rounded-full hover:bg-white/20"><Plus size={14}/></button>
                    </div>
                 </div>
                 {/* Perf Mode */}
                 <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Performance</span>
                    <div className="flex items-center p-1 rounded-full bg-black/20 text-xs">
                        <button className="px-3 py-1 rounded-full">Base</button>
                        <button className="px-3 py-1 rounded-full bg-accent-blue text-black">High</button>
                        <button className="px-3 py-1 rounded-full">Ultra</button>
                    </div>
                 </div>
                 {/* MR Toggle */}
                 <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Mixed Reality</span>
                    <button className="px-3 py-1 rounded-full text-xs flex items-center space-x-1.5 bg-accent-purple text-black">
                        <Tv size={14}/>
                        <span>On</span>
                    </button>
                 </div>
              </div>
           </div>
        </SpecSection>
        
        <SpecSection icon={<Thermometer />} title="Performance Targets">
           <ul>
            <li><strong>Target Framerate:</strong> 72Hz / 90Hz native on supported devices.</li>
            <li><strong>Interpolation Modes:</strong> Optional motion smoothing to achieve 120Hz or 240Hz effective framerates.</li>
            <li><strong>Foveated Rendering:</strong> Support for eye-tracked foveation to maximize performance (on supported hardware).</li>
          </ul>
        </SpecSection>

        <SpecSection icon={<BarChart />} title="Analytics Events">
           <p>The viewer sends anonymous usage data to help creators understand engagement:</p>
           <div className="grid grid-cols-2 gap-x-4">
              <code>enter_experience</code>
              <code>time_in_scene</code>
              <code>quality_change</code>
              <code>perf_mode_change</code>
              <code>mr_toggle</code>
              <code>quit_reason</code>
           </div>
        </SpecSection>
      </div>
    </div>
  );
};

export default ViewerSpecPage;
