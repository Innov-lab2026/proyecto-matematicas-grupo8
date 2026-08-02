import React from 'react';
import HeaderMate from '../HeaderMate/HeaderMate';
import ButtonBack from '../../ui/ButtonBack/ButtonBack';
import ButtonContinue from '../../ui/ButtonContinue/ButtonContinue';
import './VideoPage.css';

function VideoPage({ 
  title, 
  videoUrl, 
  currentIndex, 
  totalVideos, 
  onBack, 
  onContinue 
}) {
  
  // Condición opcional: deshabilitar "Continuar" si es el último video del array
  const isLastVideo = currentIndex === totalVideos - 1;

  const toEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube-nocookie.com/embed/') || url.includes('youtube.com/embed/')) {
      return url.replace('youtube.com/embed/', 'youtube-nocookie.com/embed/');
    }
    try {
      const parsed = new URL(url);
      const id =
        parsed.searchParams.get('v') ||
        (parsed.pathname.startsWith('/embed/')
          ? parsed.pathname.split('/')[2]
          : parsed.pathname.replace('/', ''));
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    } catch {
      /* ignore */
    }
    return url;
  };

  const embedSrc = toEmbedUrl(videoUrl);

  return (
    <div className="video-page-container">
      {/* Header fijo */}
      <HeaderMate />

      {/* Cuerpo de la página */}
      <main className="video-page-content">
        
        {/* Barra superior dinámica */}
        <div className="video-page-top-bar">
          <ButtonBack onClick={onBack} />
          <div className="video-page-title-container">

            <h1 className="video-page-title">{title}</h1>
          </div>
        </div>

        {/* Contenedor del Video Dinámico */}
        <div className="video-wrapper">
          <iframe
            className="video-player"
            src={embedSrc}
            title={title || 'Video explicativo de Mate+'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>

        {/* Barra inferior dinámica */}
        <div className="video-page-footer">
          <ButtonContinue 
            onClick={onContinue} 
            label={isLastVideo ? "Finalizar" : "Continuar"} 
          />
        </div>

      </main>
    </div>
  );
}

export default VideoPage;