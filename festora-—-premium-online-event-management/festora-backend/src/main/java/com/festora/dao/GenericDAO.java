package com.festora.dao;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

/**
 * Generic Data Access Object interface illustrating Java Generics,
 * Interface design, and standard persistence contracts.
 *
 * @param <T>  Domain entity type
 * @param <ID> Unique identifier type
 */
public interface GenericDAO<T, ID extends Serializable> {

    /**
     * Inserts a new entity record into the database.
     * @param entity the object to persist
     * @return the generated ID
     */
    ID save(T entity);

    /**
     * Retrieves an entity by its primary key.
     * @param id the primary key
     * @return an Optional containing the entity if found
     */
    Optional<T> findById(ID id);

    /**
     * Retrieves all entity records.
     * @return list of entities
     */
    List<T> findAll();

    /**
     * Updates an existing entity record.
     * @param entity the object to update
     * @return true if updated successfully, false otherwise
     */
    boolean update(T entity);

    /**
     * Deletes an entity record by primary key.
     * @param id primary key to delete
     * @return true if deleted successfully, false otherwise
     */
    boolean delete(ID id);
}
