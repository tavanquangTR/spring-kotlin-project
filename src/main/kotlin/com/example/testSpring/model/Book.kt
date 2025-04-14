package com.example.testSpring.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class Book(
    @Id  // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto
    val id:Long,
    val title: String,
    val price:Int,
    val author:String
)