package com.repository;

import com.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {
    @Query("SELECT p FROM Pet p WHERE " +
            "(:species IS NULL OR LOWER(p.species) LIKE LOWER(CONCAT('%', :species, '%'))) AND " +
            "(:color IS NULL OR LOWER(p.color) LIKE LOWER(CONCAT('%', :color, '%'))) AND " +
            "(:size IS NULL OR LOWER(p.size) LIKE LOWER(CONCAT('%', :size, '%'))) AND " +
            "(:breed IS NULL OR LOWER(p.breed) LIKE LOWER(CONCAT('%', :breed, '%'))) AND " +
            "(:region IS NULL OR LOWER(p.region) LIKE LOWER(CONCAT('%', :region, '%')))")
    List<Pet> findByFilters(@Param("species") String species,
                            @Param("color") String color,
                            @Param("size") String size,
                            @Param("breed") String breed,
                            @Param("region") String region);
}