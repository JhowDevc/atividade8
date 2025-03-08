package com.dto;

import lombok.Data;

@Data
public class PetDTO {
    private Long id;
    private String species;
    private String color;
    private String size;
    private String breed;
    private String region;
    private String photoBase64;
}