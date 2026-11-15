package com.hiresmart.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "normalized_name", nullable = false, unique = true, length = 150)
    private String normalizedName;

    @Column(length = 100)
    private String category;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public Skill() {}

    public Skill(String name, String normalizedName) {
        this.name = name;
        this.normalizedName = normalizedName;
        this.createdAt = Instant.now();
    }

    public Skill(String name, String normalizedName, String category) {
        this.name = name;
        this.normalizedName = normalizedName;
        this.category = category;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNormalizedName() { return normalizedName; }
    public void setNormalizedName(String normalizedName) { this.normalizedName = normalizedName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
