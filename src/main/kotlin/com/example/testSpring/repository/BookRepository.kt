package com.example.testSpring.repository

import com.example.testSpring.model.Book
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BookRepository :JpaRepository<Book,Long> {
    fun findByTitle(title:String) :List<Book>
}