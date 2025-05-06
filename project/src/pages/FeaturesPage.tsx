import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  Code, 
  ArrowRight, 
  Download, 
  RefreshCw,
  Database,
  Zap,
  BarChart2,
  Lock,
  LineChart,
  Users
} from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: <Upload className="text-blue-600" size={32} />,
      title: "Easy Data Import",
      description: "Upload CSV, Excel, JSON files or paste data directly. Connect to databases for live transformations.",
      details: [
        "Support for CSV, TSV, Excel, JSON formats",
        "Direct database connections (PostgreSQL, MySQL, etc.)",
        "API endpoints for programmatic access",
        "Drag-and-drop interface"
      ]
    },
    {
      icon: <Zap className="text-violet-600" size={32} />,
      title: "AI-Powered Transformation",
      description: "Our proprietary AI technology analyzes your data and automatically finds the best transformation rules.",
      details: [
        "Pattern recognition across complex datasets",
        "Multi-step transformation sequences",
        "Learning from examples with minimal input",
        "Continuous improvement from user feedback"
      ]
    },
    {
      icon: <Code className="text-amber-600" size={32} />,
      title: "Transparent Transformation Logic",
      description: "See exactly how your data is being transformed with human-readable code that you can modify.",
      details: [
        "Human-readable transformation code",
        "Edit and customize transformation rules",
        "Export transformation logic as Python, SQL, or JavaScript",
        "Version control for all transformations"
      ]
    },
    {
      icon: <RefreshCw className="text-rose-600" size={32} />,
      title: "Iterative Refinement",
      description: "Fine-tune transformations by providing additional examples or manual adjustments.",
      details: [
        "Interactive feedback loop",
        "Manual rule adjustments",
        "Exception handling for edge cases",
        "Transformation history tracking"
      ]
    },
    {
      icon: <Lock className="text-slate-700" size={32} />,
      title: "Advanced Security",
      description: "Enterprise-grade security with encryption, access controls, and compliance features.",
      details: [
        "End-to-end encryption",
        "Role-based access control",
        "GDPR, HIPAA, and SOC 2 compliance",
        "Data residency options"
      ]
    },
    
  ];

  const useCases = [
    {
      title: "Data Cleaning & Standardization",
      description: "Automatically standardize names, addresses, product codes, and other data across multiple sources.",
      icon: <FileText size={24} className="text-blue-600" />
    },
    {
      title: "Format Conversion",
      description: "Transform data between different formats and structures to meet specific system requirements.",
      icon: <RefreshCw size={24} className="text-violet-600" />
    },
    {
      title: "Data Integration",
      description: "Combine and normalize data from multiple sources into a consistent format for analysis.",
      icon: <Database size={24} className="text-emerald-600" />
    },
    {
      title: "Reporting Automation",
      description: "Automatically transform raw data into report-ready formats with consistent styling and calculations.",
      icon: <BarChart2 size={24} className="text-amber-600" />
    }
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="mb-6">Powerful Features</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            TabulaX combines cutting-edge AI with intuitive design to make data transformation effortless and powerful.
          </p>
        </div>
        
        {/* Main Features */}
        <div className="mb-24">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            {features.map((feature, index) => (
              <div key={index} className="feature-card group">
                <div className="mb-6 flex items-start">
                  <div className="mr-4 mt-1">{feature.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold mb-3">{feature.title}</h2>
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <h3 className="text-lg font-medium mb-2 text-slate-800">Key Capabilities</h3>
                      <ul className="space-y-2">
                        {feature.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="text-slate-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Use Cases Section */}
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-10 text-white mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Use Cases</h2>
            <p className="max-w-2xl mx-auto text-blue-100">
              See how organizations across industries are using TabulaX to solve their data transformation challenges.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
                <div className="mb-4">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{useCase.title}</h3>
                <p className="text-blue-100">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Comparison Table */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">TabulaX vs. Traditional Methods</h2>
            <p className="max-w-2xl mx-auto text-slate-600">
              See how TabulaX compares to traditional data transformation approaches.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="py-4 px-6 text-left font-semibold text-slate-800">Feature</th>
                  <th className="py-4 px-6 text-center font-semibold text-blue-600">TabulaX</th>
                  <th className="py-4 px-6 text-center font-semibold text-slate-800">Traditional ETL Tools</th>
                  <th className="py-4 px-6 text-center font-semibold text-slate-800">Manual Coding</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-slate-800 font-medium">Setup Time</td>
                  <td className="py-4 px-6 text-center text-blue-600">Minutes</td>
                  <td className="py-4 px-6 text-center text-slate-600">Hours to Days</td>
                  <td className="py-4 px-6 text-center text-slate-600">Days to Weeks</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-slate-800 font-medium">Learning Curve</td>
                  <td className="py-4 px-6 text-center text-blue-600">Minimal</td>
                  <td className="py-4 px-6 text-center text-slate-600">Steep</td>
                  <td className="py-4 px-6 text-center text-slate-600">Very Steep</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-slate-800 font-medium">Complex Transformations</td>
                  <td className="py-4 px-6 text-center text-blue-600">AI-Automated</td>
                  <td className="py-4 px-6 text-center text-slate-600">Manual Configuration</td>
                  <td className="py-4 px-6 text-center text-slate-600">Custom Code</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-slate-800 font-medium">Adaptability</td>
                  <td className="py-4 px-6 text-center text-blue-600">Self-Improving</td>
                  <td className="py-4 px-6 text-center text-slate-600">Fixed Rules</td>
                  <td className="py-4 px-6 text-center text-slate-600">Manual Updates</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-4 px-6 text-slate-800 font-medium">Technical Expertise Required</td>
                  <td className="py-4 px-6 text-center text-blue-600">Minimal</td>
                  <td className="py-4 px-6 text-center text-slate-600">Moderate</td>
                  <td className="py-4 px-6 text-center text-slate-600">Extensive</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Testimonial */}
        <div className="bg-slate-100 rounded-2xl p-10 mb-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-blue-600 mb-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.13456 9H5.25654C4.98454 9 4.75854 9.224 4.75854 9.5V13.5C4.75854 13.776 4.98454 14 5.25654 14H7.86256V16.5C7.86256 16.776 8.08856 17 8.36056 17H9.13456C9.40656 17 9.63256 16.776 9.63256 16.5V9.5C9.63256 9.224 9.40656 9 9.13456 9Z" fill="currentColor"/>
                <path d="M18.3825 9H14.5045C14.2325 9 14.0065 9.224 14.0065 9.5V13.5C14.0065 13.776 14.2325 14 14.5045 14H17.1105V16.5C17.1105 16.776 17.3365 17 17.6085 17H18.3825C18.6545 17 18.8805 16.776 18.8805 16.5V9.5C18.8805 9.224 18.6545 9 18.3825 9Z" fill="currentColor"/>
              </svg>
            </div>
            <p className="text-2xl font-medium text-slate-800 mb-6">
              TabulaX has completely transformed our data pipeline. What used to take our team three days of manual work 
              now happens automatically in minutes, with even better results. The ROI was immediate and substantial.
            </p>
            <div className="flex items-center">
              <img 
                src="https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=150" 
                alt="Jennifer Klein" 
                className="w-14 h-14 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-bold text-slate-900">Jennifer Klein</h4>
                <p className="text-slate-600">Chief Data Officer, Global Finance Corp</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience TabulaX?</h2>
          <p className="max-w-2xl mx-auto text-slate-600 mb-8">
            Try our interactive demo to see how TabulaX can transform your data workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo" className="btn btn-primary inline-flex items-center">
              Try Demo Now
              <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Schedule a Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;