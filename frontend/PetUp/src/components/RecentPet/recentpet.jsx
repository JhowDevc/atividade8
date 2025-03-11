import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './recentpet.css';

function RecentPet() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentPets();
  }, []);

  const fetchRecentPets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8081/api/pets', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar os pets recentes');
      }

      const data = await response.json();
      const sortedPets = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const recentPets = sortedPets.slice(0, 6).map(pet => ({
        ...pet,
        image: pet.photoBase64 ? `data:image/jpeg;base64,${pet.photoBase64}` : 'https://via.placeholder.com/150',
      }));
      setPets(recentPets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recent-wrapper">
        <section className="container recent py-5 text-center">
          <p className="loading-text animate-pulse">Carregando os pets mais recentes...</p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-wrapper">
        <section className="container recent py-5 text-center">
          <p className="error-text">Erro: {error}</p>
        </section>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="recent-wrapper">
        <section className="container recent py-5 text-center">
          <p className="no-pets-text">Nenhum pet recente encontrado. Adicione um pet perdido para começar!</p>
        </section>
      </div>
    );
  }

  return (
    <div className="recent-wrapper">
      <section className="container recent py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="recent-title animate-slide-in">Últimos Pets Perdidos</h2>
          <Link to="/encontre-pet" className="btn btn-primary py-2 px-3 animate-slide-in">
            Ver Mais Pets
          </Link>
        </div>
        <p className="recent-subtitle animate-slide-in mb-4">
          Confira os pets perdidos mais recentes cadastrados no PetUp e ajude a reuni-los com seus tutores!
        </p>
        <div className="row">
          {/* Pet Principal (o mais recente) */}
          {pets.length > 0 && (
            <div className="col-lg-6 mb-4">
              <div className="card h-100 shadow-sm animate-slide-in">
                <div className="ratio ratio-16x9">
                  <img
                    src={pets[0].image}
                    className="card-img-top rounded-top"
                    alt={`${pets[0].species} perdido`}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                  />
                </div>
                <div className="card-body">
                  <p className="text-muted mb-2">
                    <i className="bi bi-paw me-2"></i> {pets[0].color}, {pets[0].size}
                  </p>
                  <h5 className="card-title">
                    {pets[0].species} Perdido em {pets[0].region}
                  </h5>
                  <p className="card-text">
                    Este {pets[0].species.toLowerCase()} foi perdido em {pets[0].region} no dia {new Date(pets[0].createdAt).toLocaleDateString('pt-BR')}.
                    Características: {pets[0].color}, porte {pets[0].size}{pets[0].breed ? `, raça ${pets[0].breed}` : ''}.
                    Ajude-nos a encontrar seu lar!
                  </p>
                  <Link to={`/pet/${pets[0].id}`} className="btn btn-outline-primary btn-sm">Saiba Mais</Link>
                </div>
              </div>
            </div>
          )}

          {/* Pets Laterais (os 5 próximos mais recentes) */}
          <div className="col-lg-6">
            <div className="row g-4">
              {pets.slice(1, 6).map((pet, index) => (
                <div className="col-12" key={index}>
                  <div className="card h-100 flex-row align-items-center shadow-sm animate-slide-in">
                    <div className="ratio ratio-4x3 me-3" style={{ width: '100px' }}>
                      <img
                        src={pet.image}
                        className="img-fluid rounded"
                        alt={`${pet.species} perdido`}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                      />
                    </div>
                    <div className="card-body p-2">
                      <p className="text-muted mb-1">
                        <i className="bi bi-geo-alt me-2"></i> {pet.region}
                      </p>
                      <Link to={`/pet/${pet.id}`} className="card-title-link">
                        <h6 className="card-title mb-0">
                          {pet.species} Perdido
                        </h6>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RecentPet;