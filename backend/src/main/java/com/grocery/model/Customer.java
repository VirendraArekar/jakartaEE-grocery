package com.grocery.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * ============================================================================
 * JAKARTA EE REVISION POINT: Bean Validation Constraints (@Email, @Pattern)
 * ============================================================================
 * - @Email: Jakarta Validation ensures input conforms to standard RFC 5322 email syntax.
 * - @Pattern: RegEx validation for telephone numbers or specific alphanumeric formats.
 * ============================================================================
 */
@Entity
@Table(
    name = "customers",
    indexes = {
        @Index(name = "idx_customer_email", columnList = "email", unique = true)
    }
)
public class Customer extends BaseEntity {

    @NotBlank(message = "Customer name is mandatory")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Please provide a valid email address")
    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Pattern(regexp = "^[+0-9\\-\\s()]{7,20}$", message = "Please provide a valid phone number")
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "delivery_address", length = 255)
    private String deliveryAddress;

    public Customer() {
    }

    public Customer(String fullName, String email, String phoneNumber, String deliveryAddress) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.deliveryAddress = deliveryAddress;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
}

