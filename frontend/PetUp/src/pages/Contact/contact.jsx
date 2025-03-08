import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import emailjs from '@emailjs/browser';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setShowSuccess(false);

    emailjs
      .send(
        'service_j6qomzc', // Substitua pelo seu Service ID do EmailJS
        'Ytemplate_v3i7in8', // Substitua pelo seu Template ID do EmailJS
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_name: 'PetUp',
          to_email: 'jonathan.ribeiro@incandescente.com.br',
        },
        'service_j6qomzc' // Substitua pelo seu User ID do EmailJS
      )
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setShowSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      })
      .catch((err) => {
        console.error('FAILED...', err);
        setError('Erro ao enviar a mensagem. Tente novamente mais tarde.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <Header />
      <Container fluid className="contact-container py-5">
        <h1 className="contact-header">
          <i className="fas fa-envelope me-2"></i> Entre em Contato
        </h1>
        <p className="contact-subheader">
          Tem alguma dúvida ou sugestão? Preencha o formulário ou use nossos contatos abaixo!
        </p>

        <Row className="justify-content-center align-items-start min-vh-75">
          {/* Formulário */}
          <Col md={6} lg={5} className="mb-4 animate-slide-in">
            <div className="contact-form-wrapper shadow-lg">
              <Form onSubmit={handleSubmit} className="contact-form">
                <Form.Group className="form-group-custom" controlId="formName">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome"
                    className="form-control-custom"
                  />
                </Form.Group>

                <Form.Group className="form-group-custom" controlId="formEmail">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Seu e-mail"
                    className="form-control-custom"
                  />
                </Form.Group>

                <Form.Group className="form-group-custom" controlId="formSubject">
                  <Form.Label>Assunto</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Assunto da mensagem"
                    className="form-control-custom"
                  />
                </Form.Group>

                <Form.Group className="form-group-custom" controlId="formMessage">
                  <Form.Label>Mensagem</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Escreva sua mensagem aqui"
                    className="form-control-custom"
                  />
                </Form.Group>

                {error && <Alert variant="danger" className="contact-error-message">{error}</Alert>}
                {showSuccess && (
                  <Alert variant="success" className="contact-success-message">
                    Mensagem enviada com sucesso! Entraremos em contato em breve.
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="contact-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </Form>
            </div>
          </Col>

          {/* Informações de Contato */}
          <Col md={6} lg={4} className="mb-4 animate-slide-in">
            <div className="contact-info-wrapper shadow-lg">
              <h3 className="contact-info-title">Outras Formas de Contato</h3>
              <ul className="contact-info-list">
                <li>
                  <i className="fas fa-phone-alt me-2"></i>
                  <strong>Telefone:</strong> (11) 98765-4321
                </li>
                <li>
                  <i className="fas fa-envelope me-2"></i>
                  <strong>E-mail:</strong> contato@buscapet.com.br
                </li>
                <li>
                  <i className="fas fa-map-marker-alt me-2"></i>
                  <strong>Endereço:</strong> Rua dos Pets, 123, São Paulo - SP
                </li>
              </ul>
              <div className="social-links mt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Contact;