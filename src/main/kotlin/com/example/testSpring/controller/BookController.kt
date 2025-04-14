package com.example.testSpring.controller

import com.example.testSpring.model.Book
import com.example.testSpring.repository.BookRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/books")
class BookController(private  val bookRepository: BookRepository) {

    //本の一覧
    @GetMapping
    fun getAllBook():List<Book> = bookRepository.findAll()

    //指定した本を表示する

    @GetMapping("/{id}")
    fun getBookById(@PathVariable id:Long) :Book{
        return bookRepository.findById(id).orElseThrow{ResponseStatusException(HttpStatus.NOT_FOUND,"book not found with id$id")}

    }

    // 新規登録

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createBook(@RequestBody newBook:Book) :Book{
        return bookRepository.save(newBook.copy(id = 0))
    }

    // 更新処理
    @PutMapping("/{id}") // 1. HTTP PUTリクエストのマッピング
    fun updateBook(
        @PathVariable id: Long,         // 2. パスからのID取得
        @RequestBody updatedBook: Book  // 3. リクエストボディからの書籍データ取得
    ): ResponseEntity<Book> {           // 4. レスポンスの型定義
        // 5. IDを使ってデータベースから書籍を検索
        return bookRepository.findById(id)
            // 6. 書籍が見つかった場合の処理 (map)
            .map { existingBook ->
                // 7. 既存のBookオブジェクトのプロパティを更新 (copyを使用)
                val savedBook = bookRepository.save( // 8. 更新された書籍を保存
                    existingBook.copy( // Kotlinのデータクラスのcopy機能
                        title = updatedBook.title,
                        price =  updatedBook.price,
                        author = updatedBook.author,

                        // idはexistingBookのものを引き継ぐ
                    )
                )
                // 9. 成功レスポンス (200 OK) を返す
                ResponseEntity.ok(savedBook)
            }
            // 10. 書籍が見つからなかった場合の処理 (orElse)
            .orElse(ResponseEntity.notFound().build()) // 11. 404 Not Found レスポンスを返す
    }

    @DeleteMapping("/{id}")
    fun deleteBookById(@PathVariable id:Long): ResponseEntity<Void>{
        return bookRepository.findById(id).map { book ->
            bookRepository.delete(book)
            ResponseEntity.noContent().build<Void>()
        }.orElse(ResponseEntity.notFound().build())


    }

}