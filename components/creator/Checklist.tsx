import React from 'react';
import Card, { CardContent, CardHeader } from '../Card';
import { CheckCircle, Circle, Upload, FileText, Send } from 'lucide-react';

interface ChecklistProps {
  status: {
    upload: boolean;
    metadata: boolean;
  };
}

const ChecklistItem: React.FC<{ isComplete: boolean; icon: React.ReactElement; title: string; description: string }> = ({ isComplete, icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      {isComplete ? (
        <CheckCircle className="w-6 h-6 text-green-500" />
      ) : (
        <Circle className="w-6 h-6 text-gray-400" />
      )}
    </div>
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

const Checklist: React.FC<ChecklistProps> = ({ status }) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Project Checklist</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChecklistItem
          isComplete={status.upload}
          icon={<Upload />}
          title="Upload Capture"
          description="Provide the zipped image sequence or video file."
        />
        <ChecklistItem
          isComplete={status.metadata}
          icon={<FileText />}
          title="Add Metadata"
          description="Fill in the title, description, and tags."
        />
        <ChecklistItem
          isComplete={false}
          icon={<Send />}
          title="Start Processing"
          description="Begin the automated pipeline to create your experience."
        />
      </CardContent>
    </Card>
  );
};

export default Checklist;
