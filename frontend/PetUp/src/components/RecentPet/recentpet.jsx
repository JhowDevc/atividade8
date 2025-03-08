import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState, useEffect } from 'react';
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
      // Ordenar por created_at (mais recente primeiro)
      const sortedPets = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      // Limitar a 5 pets (ou ajustar conforme necessário)
      const recentPets = sortedPets.slice(0, 5);
      setPets(recentPets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container recent py-5">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="container recent py-5">
        <p className="text-danger">Erro: {error}</p>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="container recent py-5">
        <p className="text-muted">Nenhum pet recente encontrado.</p>
      </div>
    );
  }

  return (
    <div className="recent-wrapper">
      <section className="container recent py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Últimos Pets Adicionados</h2>
          <button className="btn-primary py-2 px-3">Ver mais pets</button>
        </div>
        <div className="row">
          {/* Pet Principal (o mais recente) */}
          {pets.length > 0 && (
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="ratio ratio-16x9">
                  <img
                    src={pets[0].photoBase64 ? `data:image/jpeg;base64,${pets[0].photoBase64}` : 'https://via.placeholder.com/150'}
                    className="card-img-top"
                    alt={`${pets[0].species} perdido`}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                  />
                </div>
                <div className="card-body">
                  <p className="text-muted mb-2">
                    Características: {pets[0].color}, {pets[0].size}
                  </p>
                  <h5 className="card-title">
                    {pets[0].species} {pets[0].status === 'lost' ? 'perdido' : 'encontrado'} em {pets[0].region} - Procura-se!
                  </h5>
                  <p className="card-text text-muted">
                    Este pet foi {pets[0].status === 'lost' ? 'perdido' : 'encontrado'} recentemente em {pets[0].region}. Ele é de porte {pets[0].size}, com cor {pets[0].color}. Se você conhece este animal ou é o dono, entre em contato conosco.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pets Laterais (os 4 próximos mais recentes) */}
          <div className="col-lg-6">
            <div className="row g-4">
              {pets.slice(1, 5).map((pet, index) => (
                <div className="col-12" key={index}>
                  <div className="card h-100 flex-row align-items-center">
                    <div className="ratio ratio-4x3 me-3" style={{ width: '100px' }}>
                      <img
                        src={pet.photoBase64 ? `data:image/jpeg;base64,${pet.photoBase64}` : 'https://via.placeholder.com/150'}
                        className="img-fluid rounded"
                        alt={`${pet.species}`}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                      />
                    </div>
                    <div>
                      <p className="text-muted mb-1">{pet.species}</p>
                      <h6 className="card-title mb-0">
                        {pet.species} {pet.status === 'lost' ? 'perdido' : 'encontrado'} em {pet.region} - {pet.status === 'lost' ? 'Ajude a encontrar o dono' : 'Ajuda necessária'}
                      </h6>
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