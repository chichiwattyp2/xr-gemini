import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardContent, CardHeader, CardFooter } from '../../components/Card';
import Button from '../../components/Button';
import { api, CreateProjectPayload } from '../../services/api';
import { geminiService } from '../../services/geminiService';
import { Quality, Interpolation } from '../../types';
import { UploadCloud, Sparkles, Smartphone, Headset, Tv } from 'lucide-react';
import Checklist from '../../components/creator/Checklist';

const LS_KEY = 'volusphere_new_project_draft';

const getInitialState = () => {
    try {
        const savedDraft = localStorage.getItem(LS_KEY);
        if (savedDraft) {
            return JSON.parse(savedDraft);
        }
    } catch (error) {
        console.error("Could not parse new project draft from localStorage", error);
        localStorage.removeItem(LS_KEY);
    }
    return {
        title: '',
        description: '',
        tags: '',
        privacy: 'Public',
        devices: ['android_xr'],
        quality: Quality.High,
        interpolation: Interpolation.FPS120,
    };
};

const NewProjectPage: React.FC = () => {
  const [formData, setFormData] = useState(getInitialState);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Could not save new project draft to localStorage", error);
    }
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const checklistStatus = useMemo(() => ({
    upload: file !== null,
    metadata: formData.title.length > 0 && formData.description.length > 0 && formData.tags.length > 0,
  }), [file, formData.title, formData.description, formData.tags]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev: any) => {
        const newDevices = checked 
            ? [...prev.devices, value] 
            : prev.devices.filter((device: string) => device !== value);
        return { ...prev, devices: newDevices };
    });
  };
  
  const handleGenerateAIContent = async () => {
      if (!formData.title) {
          alert("Please enter a title first.");
          return;
      }
      setIsGenerating(true);
      try {
          const [generatedDesc, generatedTags] = await Promise.all([
            geminiService.suggestDescription(formData.title),
            geminiService.suggestTags(formData.title, formData.description)
          ]);
          setFormData((prev: any) => ({
              ...prev,
              description: generatedDesc,
              tags: generatedTags.join(', '),
          }));
      } catch (error) {
          console.error("Failed to generate AI content:", error);
      } finally {
          setIsGenerating(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !file) {
      alert('Please provide a title and select a file.');
      return;
    }
    setIsSubmitting(true);
    try {
        const payload: CreateProjectPayload = {
            title: formData.title,
            description: formData.description,
            tags: formData.tags.split(',').map((t:string) => t.trim()).filter(Boolean),
            privacy: formData.privacy,
            devices: formData.devices,
            defaultQuality: formData.quality,
            defaultInterpolation: formData.interpolation,
        };
        const newJob = await api.createProject(payload);
        localStorage.removeItem(LS_KEY); // Clear draft after successful submission
        navigate(`/creator/job/${newJob.id}`);
    } catch(error) {
        console.error("Failed to start new project:", error);
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <h1 className="text-2xl font-bold">Create New Project</h1>
                    <p className="text-gray-500 dark:text-gray-400">Start the pipeline by uploading your capture and providing details.</p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                      {/* --- Metadata --- */}
                       <div>
                          <label htmlFor="title" className="block text-sm font-medium mb-1">Project Title</label>
                          <input id="title" type="text" value={formData.title} onChange={handleInputChange} className="w-full form-input" placeholder="e.g., 'Downtown Parkour Sequence'" required />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label htmlFor="description" className="block text-sm font-medium">Description</label>
                            <Button type="button" variant="outline" size="sm" onClick={handleGenerateAIContent} isLoading={isGenerating}>
                               <Sparkles className="mr-2 h-4 w-4" /> Suggest with AI
                            </Button>
                          </div>
                          <textarea id="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full form-input" placeholder="A brief summary of your volumetric experience..."/>
                        </div>
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                            <input id="tags" type="text" value={formData.tags} onChange={handleInputChange} className="w-full form-input" placeholder="e.g., Action, Sci-Fi, Urban" />
                        </div>

                      {/* --- Configuration --- */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                         <div>
                            <label htmlFor="privacy" className="block text-sm font-medium mb-1">Privacy</label>
                            <select id="privacy" value={formData.privacy} onChange={handleInputChange} className="w-full form-input">
                                <option>Public</option>
                                <option>Unlisted</option>
                                <option>Private</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Supported Devices</label>
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                <label className="flex items-center space-x-2"><input type="checkbox" value="android_xr" checked={formData.devices.includes('android_xr')} onChange={handleDeviceChange} className="rounded form-checkbox" /> <span><Smartphone size={16} className="inline-block mr-1"/>Android XR</span></label>
                                <label className="flex items-center space-x-2"><input type="checkbox" value="quest" checked={formData.devices.includes('quest')} onChange={handleDeviceChange} className="rounded form-checkbox" /> <span><Headset size={16} className="inline-block mr-1"/>Quest</span></label>
                                <label className="flex items-center space-x-2"><input type="checkbox" value="pcvr" checked={formData.devices.includes('pcvr')} onChange={handleDeviceChange} className="rounded form-checkbox" /> <span><Tv size={16} className="inline-block mr-1"/>PCVR</span></label>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="quality" className="block text-sm font-medium mb-1">Default Quality</label>
                            <select id="quality" value={formData.quality} onChange={handleInputChange} className="w-full form-input">
                                {Object.values(Quality).map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="interpolation" className="block text-sm font-medium mb-1">Interpolation</label>
                            <select id="interpolation" value={formData.interpolation} onChange={handleInputChange} className="w-full form-input">
                                {Object.values(Interpolation).map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                      </div>

                      {/* --- Upload --- */}
                       <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                          <label className="block text-sm font-medium mb-2">Capture Upload</label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                  <span>Upload a file</span>
                                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">Zipped image sequence or multi-cam video</p>
                              {file && <p className="text-sm font-semibold text-green-600 pt-2">{file.name}</p>}
                            </div>
                          </div>
                        </div>
                  </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <Checklist status={checklistStatus} />
                    <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
                      Start Processing
                    </Button>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
};

export default NewProjectPage;