package com.controller;

import com.dto.PetDTO;
import com.service.PetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
    public ResponseEntity<List<PetDTO>> getPets(
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String region) {
        List<PetDTO> pets = petService.findPetsByFilters(species, color, size, breed, region);
        return ResponseEntity.ok(pets);
    }

    @PostMapping("/search-by-image")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
    public ResponseEntity<?> searchByImage(@RequestParam("photo") MultipartFile photo) {
        try {
            List<PetDTO> similarPets = petService.searchSimilarPets(photo.getBytes());
            return ResponseEntity.ok(similarPets);
        } catch (java.io.IOException e) {
            return ResponseEntity.status(500).body("Erro ao processar a imagem: " + e.getMessage());
        }
    }

    @PostMapping
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
    public ResponseEntity<?> createPet(
            @RequestParam("species") String species,
            @RequestParam("color") String color,
            @RequestParam("size") String size,
            @RequestParam(value = "breed", required = false) String breed,
            @RequestParam("region") String region,
            @RequestParam("status") String status,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {
        try {
            // Validação do formato da imagem, se fornecida
            if (photo != null && !photo.isEmpty()) {
                String contentType = photo.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.badRequest().body("Apenas arquivos de imagem (JPG, JPEG, PNG, etc.) são permitidos.");
                }
                // Log para depuração
                System.out.println("Tipo de conteúdo da imagem: " + contentType);
            }

            PetDTO petDTO = new PetDTO();
            petDTO.setSpecies(species);
            petDTO.setColor(color);
            petDTO.setSize(size);
            petDTO.setBreed(breed);
            petDTO.setRegion(region);
            petDTO.setPhotoBase64(photo != null ? Base64.getEncoder().encodeToString(photo.getBytes()) : null);

            PetDTO createdPet = petService.createPet(petDTO, status);
            return ResponseEntity.status(201).body(createdPet);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao cadastrar o pet: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
    public ResponseEntity<?> deletePet(@PathVariable Long id) {
        try {
            petService.deletePet(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao remover o pet: " + e.getMessage());
        }
    }
}