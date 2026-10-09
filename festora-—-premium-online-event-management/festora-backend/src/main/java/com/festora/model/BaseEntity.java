package com.festora.model;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Base abstract entity illustrating Object-Oriented Inheritance,
 * Generics, and encapsulation for all Festora domain models.
 */
public abstract class BaseEntity<ID extends Serializable> implements Serializable {

    private static final long serialVersionUID = 1L;

    protected ID id;
    protected LocalDateTime createdAt;
    protected LocalDateTime updatedAt;

    public BaseEntity() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public BaseEntity(ID id) {
        this();
        this.id = id;
    }

    public ID getId() {
        return id;
    }

    public void setId(ID id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
