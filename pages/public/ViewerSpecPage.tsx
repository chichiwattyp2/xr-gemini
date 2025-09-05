import React from 'react';
import Card, { CardContent, CardHeader } from '../../components/Card';
import { Gamepad2, Move3d, PanelTop, Thermometer, BarChart } from 'lucide-react';

// FIX: Specify that the icon element can accept a size prop.
const SpecSection: React.FC<{ icon: React.ReactElement<{ size?: number }>, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <Card>
        <CardHeader className="flex items-center space-x-4">
            <div className="text-primary-500">{React.cloneElement(icon, { size: 28 })}</div>
            <h2 className="text-2xl font-bold">{title}</h2>
        </CardHeader>
        <CardContent>
            <div className="prose prose-invert dark:prose-dark max-w-none">
                {children}
            </div>
        </CardContent>
    </Card>
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
           <ul>
            <li><strong>LOD Stepper:</strong> Manually cycle through LOD0 (Ultra) to LOD3 (Base) to balance quality and performance.</li>
            <li><strong>Performance Mode:</strong> Switch between Base, High, and Ultra presets affecting resolution and post-processing.</li>
            <li><strong>MR Toggle:</strong> Seamlessly switch between full VR immersion and Mixed Reality passthrough.</li>
            <li><strong>Photo Mode:</strong> Capture high-resolution screenshots of your experience.</li>
          </ul>
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
           <ul>
            <li><code>enter_experience</code></li>
            <li><code>time_in_scene</code></li>
            <li><code>quality_change</code></li>
            <li><code>perf_mode_change</code></li>
            <li><code>mr_toggle</code></li>
            <li><code>quit_reason</code></li>
          </ul>
        </SpecSection>
      </div>
    </div>
  );
};

export default ViewerSpecPage;