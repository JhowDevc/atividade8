package com.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "pet")
@Data
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "species")
    private String species;

    @Column(name = "color")
    private String color;

    @Column(name = "size")
    private String size;

    @Column(name = "breed")
    private String breed;

    @Column(name = "region")
    private String region;

    @Column(name = "photo", columnDefinition = "LONGBLOB")
    private byte[] photo;

    @Column(name = "status")
    private String status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}