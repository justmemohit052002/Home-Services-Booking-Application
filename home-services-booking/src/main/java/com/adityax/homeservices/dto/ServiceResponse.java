package com.adityax.homeservices.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceResponse {

    private Long id;

    private String name;

    private String description;

    private Double startingPrice;

    private Double rating;

    public ServiceResponse() {
    }

    public ServiceResponse(Long id, String name, String description, Double startingPrice, Double rating) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startingPrice = startingPrice;
        this.rating = rating;
    }
}