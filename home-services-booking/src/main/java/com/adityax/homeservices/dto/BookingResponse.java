package com.adityax.homeservices.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.adityax.homeservices.entity.BookingStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingResponse {

    private Long id;
    private String serviceName;
    private String name;
    private String phone;
    private String address;
    private LocalDate date;
    private LocalTime timeSlot;
    private BookingStatus status;

    public BookingResponse() {
    }

    public BookingResponse(Long id, String serviceName, String name, String phone, String address, LocalDate date, LocalTime timeSlot, BookingStatus status) {
        this.id = id;
        this.serviceName = serviceName;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.date = date;
        this.timeSlot = timeSlot;
        this.status = status;
    }
}