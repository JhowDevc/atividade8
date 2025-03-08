import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import './addPet.css';

const AddPet = () => {
  const [formData, setFormData] = useState({
    species: '',
    color: '',
    size: '',
    breed: '',
    region: '',
    status: '',
    photo: null,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, photo: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setShowSuccess(false);

    const data = new FormData();
    data.append('species', formData.species);
    data.append('color', formData.color);
    data.append('size', formData.size);
    data.append('breed', formData.breed);
    data.append('region', formData.region);
    data.append('status', formData.status);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    try {
      console.log('Enviando requisição para cadastrar pet...');
      const response = await fetch('http://localhost:8081/api/pets', {
        method: 'POST',
        body: data,
        credentials: 'include', // Inclui credenciais, se necessário
      });

      console.log('Status da resposta:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Erro na resposta:', errorText);
        throw new Error('Erro ao cadastrar o pet: ' + errorText);
      }

      const result = await response.json();
      console.log('Sucesso!', result);
      setShowSuccess(true);
      setFormData({
        species: '',
        color: '',
        size: '',
        breed: '',
        region: '',
        status: '',
        photo: null,
      });
    } catch (err) {
      console.error('Erro no fetch:', err);
      setError('Erro ao cadastrar o pet. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <Container fluid className="add-pet-container py-5">
        <h1 className="add-pet-header">
          <i className="fas fa-paw me-2"></i> Cadastrar Pet
        </h1>
        <p className="add-pet-subheader">
          Preencha os dados do pet para cadastrá-lo no sistema!
        </p>

        <Row className="justify-content-center align-items-start min-vh-75">
          <Col md={6} lg={5} className="mb-4 animate-slide-in">
            <div className="add-pet-form-wrapper shadow-lg">
              <Form onSubmit={handleSubmit} className="add-pet-form">
                <Form.Group className="form-group-custom" controlId="formSpecies">
                  <Form.Label>Espécie</Form.Label>
                  <Form.Control
                    as="select"
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    required
                    className="form-control-custom"
                  >
                    <option value="">Selecione</option>
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                    <option value="Outro">Outro</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="form-group-custom" controlId="formColor">
                  <Form.Label>Cor</Form.Label>
                  <Form.Control
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                    placeholder="Ex.: Marrom"
                    className="form-control-custom"
                  />
                </Form.Group>

                <Form.Group className="form-group-custom" controlId="formSize">
                  <Form.Label>Tamanho</Form.Label>
                  <Form.Control
                    as="select"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    required
                    className="form-control-custom"
                  >
                    <option value="">Selecione</option>
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="form-group-custom" controlId="formBreed">
                  <Form.Label>Raça (opcional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    placeholder="Ex.: Pastor Alemão"
                    className="form-control-custom"
                  />
                </Form.Group>

                <Form.Group className="form-group-custom" controlId="formRegion">
                  <Form.Label>Região</Form.Label>
                  <Form.Control
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    placeholder="Ex.: São Paulo - SP"
                    className="form-control-custom"
                  />
                </Form.Group>

                <Form.Group className="form-group-custom" controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="form-control-custom"
                  >
                    <option value="">Selecione</option>
                    <option value="lost">Perdido</option>
                    <option value="found">Encontrado</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="form-group-custom" controlId="formPhoto">
                  <Form.Label>Foto (opcional)</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    accept="image/jpeg,image/jpg,image/png" // Aceita JPG, JPEG e PNG
                    onChange={handleFileChange}
                    className="form-control-custom"
                  />
                </Form.Group>

                {error && <Alert variant="danger" className="add-pet-error-message">{error}</Alert>}
                {showSuccess && (
                  <Alert variant="success" className="add-pet-success-message">
                    Pet cadastrado com sucesso!
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="add-pet-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar Pet'}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default AddPet;