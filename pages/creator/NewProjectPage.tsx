
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardContent, CardHeader, CardFooter } from '../../components/Card';
import Button from '../../components/Button';
import { api } from '../../services/api';
import { geminiService } from '../../services/geminiService';
import { UploadCloud, Sparkles } from 'lucide-react';

const NewProjectPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleGenerateDescription = async () => {
      if (!title) {
          alert("Please enter a title first.");
          return;
      }
      setIsGenerating(true);
      try {
          const generatedDesc = await geminiService.generateDescription(title);
          setDescription(generatedDesc);
      } catch (error) {
          console.error("Failed to generate description:", error);
      } finally {
          setIsGenerating(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      alert('Please fill in all fields and select a file.');
      return;
    }
    setIsSubmitting(true);
    try {
        const newJob = await api.startNewProject({ title, description });
        navigate(`/creator/job/${newJob.id}`);
    } catch(error) {
        console.error("Failed to start new project:", error);
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Create New Project</h1>
            <p className="text-gray-500 dark:text-gray-400">Start the pipeline by uploading your capture and providing details.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Project Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 'Downtown Parkour Sequence'"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} isLoading={isGenerating}>
                   <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                </Button>
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="A brief summary of your volumetric experience..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Capture Upload</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">Zipped image sequence or multi-cam video</p>
                  {file && <p className="text-sm font-semibold text-green-600 pt-2">{file.name}</p>}
                </div>
              </div>
            </div>

          </CardContent>
          <CardFooter className="text-right">
            <Button type="submit" size="lg" isLoading={isSubmitting}>
              Start Processing
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default NewProjectPage;
