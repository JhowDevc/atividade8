import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import './encontre.css';

const Encontre = () => {
  const [filters, setFilters] = useState({
    species: '',
    color: '',
    size: '',
    breed: '',
    region: '',
  });
  const [image, setImage] = useState(null);
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isImageSearch, setIsImageSearch] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    setError(null);
    setIsImageSearch(false);
    try {
      const query = new URLSearchParams({
        species: filters.species || '',
        color: filters.color || '',
        size: filters.size || '',
        breed: filters.breed || '',
        region: filters.region || '',
      }).toString();

      const response = await fetch(`http://localhost:8081/api/pets?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar pets');
      }

      const data = await response.json();
      console.log('Dados da busca por filtros:', data);
      const petsWithImages = data.map(pet => ({
        ...pet,
        image: pet.photoBase64
          ? `data:image/jpeg;base64,${pet.photoBase64}`
          : 'https://via.placeholder.com/150',
      }));
      setPets(petsWithImages);
      setFilteredPets(petsWithImages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setLoading(true);
      setError(null);
      setIsImageSearch(true);

      const formData = new FormData();
      formData.append('photo', file);

      try {
        console.log('Iniciando busca por imagem...');
        const response = await fetch('http://localhost:8081/api/pets/search-by-image', {
          method: 'POST',
          body: formData,
        });

        console.log('Status da resposta:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.log('Erro na resposta:', errorText);
          throw new Error('Erro ao buscar pets por imagem: ' + errorText);
        }

        const data = await response.json();
        console.log('Dados retornados pelo Spring:', data);
        const petsWithImages = data.map(pet => ({
          ...pet,
          image: pet.photoBase64
            ? `data:image/jpeg;base64,${pet.photoBase64}`
            : 'https://via.placeholder.com/150',
        }));
        console.log('Pets processados:', petsWithImages);
        setPets(petsWithImages);
        setFilteredPets(petsWithImages);
      } catch (err) {
        console.error('Erro no fetch:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = () => {
    fetchPets();
  };

  const handleRemovePet = async (petId) => {
    if (window.confirm("Tem certeza que deseja remover este pet?")) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8081/api/pets/${petId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Erro ao remover pet');
        }
        const updatedPets = pets.filter(pet => pet.id !== petId);
        setPets(updatedPets);
        setFilteredPets(updatedPets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header />
      <Container fluid className="search-pet-container py-5">
        <h1 className="search-pet-header">Busque seu Pet</h1>
        <p className="search-pet-subheader">
          Utilize os filtros ou envie uma imagem para encontrar pets!
        </p>

        {loading && <div className="spinner">Processando...</div>}
        {error && <p className="text-danger">Erro: {error}</p>}

        <Row>
          <Col md={3} className="search-sidebar">
            <div className="search-form-wrapper shadow-lg">
              <Form className="search-form">
                <Form.Group controlId="species">
                  <Form.Label>Espécie</Form.Label>
                  <Form.Control
                    as="select"
                    name="species"
                    value={filters.species}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todas</option>
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                    <option value="Outro">Outro</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="color">
                  <Form.Label>Cor</Form.Label>
                  <Form.Control
                    type="text"
                    name="color"
                    value={filters.color}
                    onChange={handleFilterChange}
                    placeholder="Ex.: Marrom"
                  />
                </Form.Group>

                <Form.Group controlId="size">
                  <Form.Label>Tamanho</Form.Label>
                  <Form.Control
                    as="select"
                    name="size"
                    value={filters.size}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todos</option>
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="breed">
                  <Form.Label>Raça (opcional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="breed"
                    value={filters.breed}
                    onChange={handleFilterChange}
                    placeholder="Ex.: Pastor Alemão"
                  />
                </Form.Group>

                <Form.Group controlId="region">
                  <Form.Label>Região</Form.Label>
                  <Form.Control
                    type="text"
                    name="region"
                    value={filters.region}
                    onChange={handleFilterChange}
                    placeholder="Ex.: São Paulo - SP"
                  />
                </Form.Group>

                <Button
                  className="search-submit-button mb-3"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  Buscar por Filtros
                </Button>

                <Form.Group controlId="image">
                  <Form.Label>Upload de Imagem</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {image && <img src={image} alt="Preview" className="image-preview mt-2" />}
                </Form.Group>
              </Form>
            </div>
          </Col>

          <Col md={9}>
            <div className="pet-gallery">
              {isImageSearch ? (
                <h2>Animais Semelhantes Encontrados</h2>
              ) : (
                <h2>Pets Encontrados</h2>
              )}
              <Row>
                {filteredPets.length > 0 ? (
                  filteredPets.map((pet) => (
                    <Col md={4} key={pet.id} className="mb-4">
                      <Card className="pet-card shadow-sm">
                        <Card.Img variant="top" src={pet.image} />
                        <Card.Body>
                          <Card.Title>{pet.species}</Card.Title>
                          <Card.Text>
                            <strong>Cor:</strong> {pet.color}<br />
                            <strong>Tamanho:</strong> {pet.size}<br />
                            <strong>Região:</strong> {pet.region}
                          </Card.Text>
                          <Button variant="primary" className="me-2">
                            Ver Detalhes
                          </Button>
                          <Button variant="danger" onClick={() => handleRemovePet(pet.id)}>
                            Remover
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <p className="no-results">Nenhum pet encontrado.</p>
                  </Col>
                )}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Encontre;