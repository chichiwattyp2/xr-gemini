
import React from 'react';
import Card, { CardContent, CardHeader } from '../../components/Card';
import { ArrowRight } from 'lucide-react';

const Step: React.FC<{ num: number; title: string; description: string }> = ({ num, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary-500 text-white rounded-full font-bold text-xl">
      {num}
    </div>
    <div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
  </div>
);

const CreatorGuidePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Creator Guide</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Your journey from camera to headset starts here.</p>
      </header>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">The VoluSphere Pipeline</h2>
        </CardHeader>
        <CardContent className="space-y-8">
          <Step
            num={1}
            title="Capture & Upload"
            description="Start with a zipped image sequence or multi-camera video footage. Our platform accepts a wide range of formats. Ensure your capture environment has good, even lighting."
          />
          <Step
            num={2}
            title="Reconstruct (Gaussian Splats)"
            description="Our automated pipeline processes your footage, performing structure-from-motion and converting it into a high-fidelity Gaussian Splat representation."
          />
          <Step
            num={3}
            title="Enhance & Interpolate"
            description="Apply temporal stabilization for smoother playback and optionally generate interpolated frames to achieve ultra-high frame rates (120/240 FPS)."
          />
          <Step
            num={4}
            title="Package & Preview"
            description="The system bakes Levels of Detail (LODs) and packages all assets into a CDN-ready format. Preview your creation in our WebGL viewer before publishing."
          />
           <Step
            num={5}
            title="Publish & Share"
            description="Add metadata, set privacy levels, and publish your experience to the world. A manifest file is generated for our XR viewers to consume."
          />
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Accepted Formats & Limits</h2>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li><strong>Video Input:</strong> Zipped multi-camera MP4/MOV files (up to 4K resolution per camera).</li>
            <li><strong>Image Input:</strong> Zipped PNG/JPG image sequences.</li>
            <li><strong>Capture Length:</strong> Up to 10 minutes per project on the standard Creator plan.</li>
            <li><strong>Upload Size:</strong> Max 20 GB per project upload.</li>
            <li><strong>Best Practices:</strong> Avoid reflective surfaces, use controlled lighting, and maintain consistent camera settings.</li>
          </ul>
        </CardContent>
      </Card>

    </div>
  );
};

export default CreatorGuidePage;
