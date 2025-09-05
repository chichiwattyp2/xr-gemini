
import React from 'react';
import Card, { CardContent, CardHeader } from '../../components/Card';
import Button from '../../components/Button';
import { CheckCircle } from 'lucide-react';

const PlanFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start space-x-3">
    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
    <span>{children}</span>
  </li>
);

const PricingCard: React.FC<{ title: string; price: string; description: string; features: string[]; primary?: boolean }> = ({ title, price, description, features, primary = false }) => (
  <Card className={primary ? "border-2 border-primary-500" : ""}>
    <CardHeader className="text-center">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-4 text-4xl font-extrabold">{price}</p>
      <p className="mt-1 text-gray-500 dark:text-gray-400">{description}</p>
    </CardHeader>
    <CardContent>
      <ul className="space-y-4 text-gray-600 dark:text-gray-300">
        {features.map((feature, i) => (
          <PlanFeature key={i}>{feature}</PlanFeature>
        ))}
      </ul>
    </CardContent>
    <div className="p-6">
      <Button size="lg" className="w-full" variant={primary ? 'primary' : 'secondary'}>
        Get Started
      </Button>
    </div>
  </Card>
);


const PricingPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Find the Right Plan</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Start for free, then scale as you create.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <PricingCard
          title="Viewer"
          price="Free"
          description="For exploring content"
          features={[
            "Browse all public experiences",
            "Create a personal library",
            "Follow your favorite creators",
          ]}
        />
        <PricingCard
          title="Creator"
          price="$25/mo"
          description="Usage-based for creators"
          features={[
            "All Viewer features, plus:",
            "50 GB storage",
            "100 processing minutes/month",
            "Publish public & unlisted experiences",
            "Basic analytics",
          ]}
          primary
        />
        <PricingCard
          title="Team"
          price="Custom"
          description="For studios and enterprises"
          features={[
            "All Creator features, plus:",
            "Unlimited storage & processing",
            "Team management & roles",
            "Private experiences",
            "Advanced analytics & support",
          ]}
        />
      </div>
    </div>
  );
};

export default PricingPage;
