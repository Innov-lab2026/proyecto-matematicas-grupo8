import { FaGithub, FaLinkedin } from 'react-icons/fa';
import teamPhoto from '../../../assets/image.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Nosotros.css';

const teamMembers = [
  {
    name: 'César Ramos',
    role: 'Backend Developer',
    quote: 'Creo soluciones robustas que hacen que la app funcione con velocidad y confiabilidad.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Amilcar Carrasco',
    role: 'Backend Developer',
    quote: 'Me encanta conectar el diseño y la lógica para crear experiencias fluidas.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Lisandro Salvareschi',
    role: 'Frontend Developer',
    quote: 'Construyo interfaces limpias y accesibles para que todos puedan disfrutar la plataforma.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Romina Ruiz',
    role: 'Frontend Developer',
    quote: 'Diseño productos intuitivos que conectan con el usuario y potencian el aprendizaje.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
    {
    name: 'Soledad Peloc',
    role: 'Frontend Developer',
    quote: 'Creo soluciones robustas que hacen que la app funcione con velocidad y confiabilidad.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Florencia Luna',
    role: 'Diseñadora UX/UI',
    quote: 'Diseño productos intuitivos que conectan con el usuario y potencian el aprendizaje.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Sofia Digiano',
    role: 'Diseñadora UX/UI',
    quote: 'Diseño productos intuitivos que conectan con el usuario y potencian el aprendizaje.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Mayra Capra',
    role: 'Diseñadora UX/UI',
    quote: 'Diseño productos intuitivos que conectan con el usuario y potencian el aprendizaje.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
    {
    name: 'Maribel Chura Yujra',
    role: 'Tester QA',
    quote: 'Creo soluciones robustas que hacen que la app funcione con velocidad y confiabilidad.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Hernan Luciano',
    role: 'Tester QA',
    quote: 'Me encanta conectar el diseño y la lógica para crear experiencias fluidas.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Marcos Marfeo',
    role: 'Data Analytics',
    quote: 'Construyo interfaces limpias y accesibles para que todos puedan disfrutar la plataforma.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Tony Arturo Curi Caballero',
    role: 'Data Analytics',
    quote: 'Diseño productos intuitivos que conectan con el usuario y potencian el aprendizaje.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
    {
    name: 'Gustavo Ovejero',
    role: 'Coordinador de Proyecto',
    quote: 'Creo soluciones robustas que hacen que la app funcione con velocidad y confiabilidad.',
    image: teamPhoto,
    linkedin: '#',
    github: '#',
  },
  
];

function SecondSection() {
  return (
    <section className="team-section">
      <Container className="team-container py-5">
        <Row className="g-4 justify-content-center">
          {teamMembers.map((member) => (
            <Col key={member.name} xs={12} sm={6} lg={4} xl={3}>
              <article className="team-card">
                <div className="team-card-image">
                  <img src={member.image} alt={`${member.name} perfil`} />
                </div>
                <div className="team-card-body">
                  <h3>{member.name}</h3>
                  <p className="team-card-role">{member.role}</p>
                  <p className="team-card-text">{member.quote}</p>
                </div>
                <div className="team-card-footer">
                  <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} LinkedIn`}>
                    <FaLinkedin />
                  </a>
                  <a href={member.github} target="_blank" rel="noreferrer" aria-label={`${member.name} GitHub`}>
                    <FaGithub />
                  </a>
                </div>
              </article>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default SecondSection;
