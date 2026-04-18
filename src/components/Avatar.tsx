import React from 'react';

interface AvatarProps {
  imageUrl?: string;
  sender: 'user' | 'bot';
}

const DefaultUserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
  </svg>
);

const DefaultBotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-lime-400">
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.337c-.625.615-.272 1.764.55 1.764h4.313l1.83 4.401c.321.772 1.415.772 1.736 0l1.83-4.401h4.313c.823 0 1.175-1.149.55-1.764l-3.423-3.337-4.753-.39-1.83-4.401z" clipRule="evenodd" />
  </svg>
);


export const Avatar: React.FC<AvatarProps> = ({ imageUrl, sender }) => {
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setError(false);
  }, [imageUrl]);

  const handleError = () => {
    setError(true);
  };

  if (error || !imageUrl) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center ring-1 ring-slate-600">
        {sender === 'user' ? <DefaultUserIcon /> : <DefaultBotIcon />}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`${sender} avatar`}
      onError={handleError}
      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-600"
      loading="lazy"
      decoding="async"
    />
  );
};