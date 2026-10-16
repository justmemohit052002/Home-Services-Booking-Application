package com.adityax.homeservices.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.adityax.homeservices.dto.ServiceResponse;
import com.adityax.homeservices.entity.ServiceEntity;
import com.adityax.homeservices.repository.ServiceRepository;

class ServiceServiceImplTest {

    @Mock
    private ServiceRepository serviceRepository;

    private ServiceServiceImpl serviceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        serviceService = new ServiceServiceImpl(serviceRepository);
    }

    @Test
    void getAllServicesShouldReturnAllServices() {

        ServiceEntity service = new ServiceEntity(
                1L,
                "Home Cleaning",
                "Professional home cleaning",
                999.0,
                4.5
        );

        when(serviceRepository.findAll())
                .thenReturn(List.of(service));

        List<ServiceResponse> result =
                serviceService.getAllServices(null);

        assertEquals(1, result.size());
        assertEquals("Home Cleaning", result.get(0).getName());

        verify(serviceRepository).findAll();
    }

    @Test
    void searchShouldReturnMatchingServices() {

        ServiceEntity service = new ServiceEntity(
                1L,
                "Home Cleaning",
                "Professional home cleaning",
                999.0,
                4.5
        );

        when(serviceRepository.findByNameContainingIgnoreCase("clean"))
                .thenReturn(List.of(service));

        List<ServiceResponse> result =
                serviceService.getAllServices("clean");

        assertEquals(1, result.size());
        assertEquals("Home Cleaning", result.get(0).getName());

        verify(serviceRepository)
                .findByNameContainingIgnoreCase("clean");
    }

    @Test
    void getServiceByIdShouldReturnMatchingService() {

        ServiceEntity service = new ServiceEntity(
                1L,
                "Home Cleaning",
                "Professional home cleaning",
                999.0,
                4.5
        );

        when(serviceRepository.findById(1L))
                .thenReturn(Optional.of(service));

        ServiceResponse result =
                serviceService.getServiceById(1L);

        assertEquals(1L, result.getId());
        assertEquals("Home Cleaning", result.getName());

        verify(serviceRepository).findById(1L);
    }
}