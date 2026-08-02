import { useEffect, useState } from 'react';
import VideoPage from '../components/layouts/VideoPage/VideoPage';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../config/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function Desafios() {
  const navigate = useNavigate();
  const { seccionId: seccionParam } = useParams();
  const [searchParams] = useSearchParams();
  const seccionId = seccionParam || searchParams.get('seccionId');

  const [indexActual, setIndexActual] = useState(0);
  const [videos, setVideos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    if (!seccionId) {
      setError('Falta la sección del desafío. Volvé al dashboard y elegí un módulo.');
      setCargando(false);
      return undefined;
    }

    setCargando(true);
    api
      .get(`/secciones/${seccionId}/lecciones`)
      .then((res) => {
        if (!activo) return;
        const rows = (res.data || []).map((l) => ({
          id: l.id,
          titulo: l.titulo,
          url: l.videoUrl,
        }));
        setVideos(rows);
        setIndexActual(0);
        setError(
          rows.length
            ? null
            : 'Esta sección todavía no tiene videos cargados en la base (tabla Leccion).',
        );
      })
      .catch((err) => {
        if (!activo) return;
        console.error(err);
        setError('No se pudieron cargar los videos de la lección.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [seccionId]);

  if (cargando) {
    return <LoadingSpinner message="Cargando videos..." />;
  }

  if (error || !videos.length) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem', textAlign: 'center' }}>
        <div>
          <p style={{ color: '#dc2626' }}>{error || 'Sin videos'}</p>
          <button
            type="button"
            onClick={() => navigate(seccionId ? `/ejercicios/${seccionId}` : '/dashboard')}
            style={{ marginTop: '1rem', padding: '0.6rem 1.2rem' }}
          >
            {seccionId ? 'Ir a los ejercicios' : 'Volver al dashboard'}
          </button>
        </div>
      </div>
    );
  }

  const videoActual = videos[indexActual];

  const manejarAtras = () => {
    if (indexActual > 0) {
      setIndexActual(indexActual - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const manejarContinuar = () => {
    if (indexActual < videos.length - 1) {
      setIndexActual(indexActual + 1);
    } else {
      navigate(`/ejercicios/${seccionId}`);
    }
  };

  return (
    <VideoPage
      title={videoActual.titulo}
      videoUrl={videoActual.url}
      currentIndex={indexActual}
      totalVideos={videos.length}
      onBack={manejarAtras}
      onContinue={manejarContinuar}
    />
  );
}

export default Desafios;
