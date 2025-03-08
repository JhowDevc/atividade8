package com.service;

import com.dto.PetDTO;
import com.model.Pet;
import com.repository.PetRepository;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PetService {

    private static final Logger logger = LoggerFactory.getLogger(PetService.class);

    private final PetRepository petRepository;
    private final CloseableHttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${python.api.url}")
    private String pythonApiUrl;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
        this.httpClient = HttpClients.createDefault();
        this.objectMapper = new ObjectMapper();
    }

    public List<PetDTO> findPetsByFilters(String species, String color, String size, String breed, String region) {
        List<Pet> pets = petRepository.findByFilters(species, color, size, breed, region);
        return pets.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<PetDTO> searchSimilarPets(byte[] imageBytes) {
        logger.info("Iniciando busca por imagem semelhante em {}", pythonApiUrl + "/search");
        HttpPost post = new HttpPost(pythonApiUrl + "/search");
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.addBinaryBody("photo", imageBytes, ContentType.IMAGE_JPEG, "photo.jpg");
        post.setEntity(builder.build());

        try {
            String response = httpClient.execute(post, responseHandler -> {
                String resp = new String(responseHandler.getEntity().getContent().readAllBytes());
                logger.debug("Resposta bruta do Flask: {}", resp);
                return resp;
            });

            List<Long> similarPetIds = parsePythonResponse(response);
            logger.info("IDs de pets similares encontrados: {}", similarPetIds);
            if (similarPetIds.isEmpty()) {
                logger.warn("Nenhum ID retornado pelo Flask. Resposta: {}", response);
                return List.of();
            }

            logger.debug("Buscando pets no banco com IDs: {}", similarPetIds);
            List<Pet> similarPets = petRepository.findAllById(similarPetIds);
            logger.info("Pets encontrados no banco: {}", similarPets.size());
            if (similarPets.isEmpty()) {
                logger.warn("Nenhum pet correspondente aos IDs encontrado no banco. IDs solicitados: {}", similarPetIds);
            }
            return similarPets.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Erro ao buscar pets semelhantes: {}", e.getMessage(), e);
            return List.of();
        }
    }

    public PetDTO createPet(PetDTO petDTO, String status) {
        Pet pet = new Pet();
        pet.setSpecies(petDTO.getSpecies());
        pet.setColor(petDTO.getColor());
        pet.setSize(petDTO.getSize());
        pet.setBreed(petDTO.getBreed());
        pet.setRegion(petDTO.getRegion());
        pet.setStatus(status);
        pet.setPhoto(petDTO.getPhotoBase64() != null ? Base64.getDecoder().decode(petDTO.getPhotoBase64()) : null);

        Pet savedPet = petRepository.save(pet);
        return convertToDTO(savedPet);
    }

    public void deletePet(Long id) {
        if (petRepository.existsById(id)) {
            petRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Pet não encontrado com id: " + id);
        }
    }

    private PetDTO convertToDTO(Pet pet) {
        PetDTO dto = new PetDTO();
        dto.setId(pet.getId());
        dto.setSpecies(pet.getSpecies());
        dto.setColor(pet.getColor());
        dto.setSize(pet.getSize());
        dto.setBreed(pet.getBreed());
        dto.setRegion(pet.getRegion());
        if (pet.getPhoto() != null) {
            dto.setPhotoBase64(Base64.getEncoder().encodeToString(pet.getPhoto()));
        }
        return dto;
    }

    private List<Long> parsePythonResponse(String response) {
        try {
            var jsonResponse = objectMapper.readTree(response);
            var results = jsonResponse.get("results");
            if (results == null || !results.isArray()) {
                logger.warn("Resposta do Flask não contém 'results' ou não é um array: {}", response);
                return List.of();
            }
            List<Long> ids = StreamSupport.stream(results.spliterator(), false)
                    .map(node -> node.get("id").asLong())
                    .collect(Collectors.toList());
            return ids;
        } catch (Exception e) {
            logger.error("Erro ao parsear resposta do Flask: {}", response, e);
            return List.of();
        }
    }
}