import React from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  content,
  avatar,
  delay = 0
}) => {
  return (
    <div 
      className="card animate-slide-up" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="mb-4 text-slate-600">
        <svg width="24" height="24" className="text-blue-400 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.13456 9H5.25654C4.98454 9 4.75854 9.224 4.75854 9.5V13.5C4.75854 13.776 4.98454 14 5.25654 14H7.86256V16.5C7.86256 16.776 8.08856 17 8.36056 17H9.13456C9.40656 17 9.63256 16.776 9.63256 16.5V9.5C9.63256 9.224 9.40656 9 9.13456 9Z" fill="currentColor"/>
          <path d="M18.3825 9H14.5045C14.2325 9 14.0065 9.224 14.0065 9.5V13.5C14.0065 13.776 14.2325 14 14.5045 14H17.1105V16.5C17.1105 16.776 17.3365 17 17.6085 17H18.3825C18.6545 17 18.8805 16.776 18.8805 16.5V9.5C18.8805 9.224 18.6545 9 18.3825 9Z" fill="currentColor"/>
        </svg>
        <p>{content}</p>
      </div>
      <div className="flex items-center">
        <img 
          src={avatar} 
          alt={name} 
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-slate-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;