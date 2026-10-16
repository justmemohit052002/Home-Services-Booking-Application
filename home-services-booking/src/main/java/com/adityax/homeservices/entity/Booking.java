package com.adityax.homeservices.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bookings")
@Getter
@Setter
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 10)
    private String phone;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime timeSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    public Booking() {
        this.status = BookingStatus.PENDING;
    }

    public Booking(Long id, String name, String phone, String address, LocalDate date, LocalTime timeSlot, BookingStatus status, ServiceEntity service) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.date = date;
        this.timeSlot = timeSlot;
        this.status = (status != null) ? status : BookingStatus.PENDING;
        this.service = service;
    }

    @PrePersist
    public void prePersist() {
        if (this.status == null) {
            this.status = BookingStatus.PENDING;
        }
    }
}