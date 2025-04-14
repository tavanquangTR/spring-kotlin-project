// APIのベースURL
const API_URL = '/api/books';

// DOM要素の取得
const bookForm = document.getElementById('book-form');
const booksList = document.getElementById('books-list');
const bookIdInput = document.getElementById('book-id');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const priceInput = document.getElementById('price');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

// ページ読み込み時に書籍一覧を表示
document.addEventListener('DOMContentLoaded', fetchBooks);

// フォーム送信イベントを処理
bookForm.addEventListener('submit', handleFormSubmit);

// キャンセルボタンのイベントリスナー
cancelBtn.addEventListener('click', resetForm);

// 全書籍を取得して表示する関数
function fetchBooks() {
  fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('ネットワークエラーが発生しました');
      }
      return response.json();
    })
    .then(books => {
      displayBooks(books);
    })
    .catch(error => {
      console.error('データの取得に失敗しました:', error);
      alert('書籍データの取得に失敗しました');
    });
}

// 書籍を表に表示する関数
function displayBooks(books) {
  booksList.innerHTML = '';
  
  books.forEach(book => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.price}円</td>
      <td>
        <button class="edit-btn" data-id="${book.id}">編集</button>
        <button class="delete-btn" data-id="${book.id}">削除</button>
      </td>
    `;
    
    booksList.appendChild(row);
  });
  
  // 編集ボタンにイベントリスナーを設定
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      fetchBookById(id);
    });
  });
  
  // 削除ボタンにイベントリスナーを設定
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      deleteBook(id);
    });
  });
}

// IDで書籍を取得する関数
function fetchBookById(id) {
  fetch(`${API_URL}/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('書籍が見つかりませんでした');
      }
      return response.json();
    })
    .then(book => {
      // フォームに書籍データを設定
      bookIdInput.value = book.id;
      titleInput.value = book.title;
      authorInput.value = book.author;
      priceInput.value = book.price;
      
      // ボタンのテキストを変更
      submitBtn.textContent = '更新';
      cancelBtn.style.display = 'inline-block';
    })
    .catch(error => {
      console.error('書籍データの取得に失敗しました:', error);
      alert('書籍データの取得に失敗しました');
    });
}

// フォーム送信を処理する関数
function handleFormSubmit(event) {
  event.preventDefault();
  
  const book = {
    title: titleInput.value,
    author: authorInput.value,
    price: parseInt(priceInput.value)
  };
  
  const id = bookIdInput.value;
  
  if (id) {
    // 更新処理
    updateBook(id, book);
  } else {
    // 新規作成処理
    createBook(book);
  }
}

// 新しい書籍を作成する関数
function createBook(book) {
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('書籍の作成に失敗しました');
      }
      return response.json();
    })
    .then(() => {
      resetForm();
      fetchBooks();
      alert('書籍が正常に登録されました');
    })
    .catch(error => {
      console.error('エラー:', error);
      alert('書籍の登録に失敗しました');
    });
}

// 書籍を更新する関数
function updateBook(id, book) {
  fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('書籍の更新に失敗しました');
      }
      return response.json();
    })
    .then(() => {
      resetForm();
      fetchBooks();
      alert('書籍が正常に更新されました');
    })
    .catch(error => {
      console.error('エラー:', error);
      alert('書籍の更新に失敗しました');
    });
}

// 書籍を削除する関数
function deleteBook(id) {
  if (confirm('この書籍を削除してもよろしいですか？')) {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('書籍の削除に失敗しました');
        }
        fetchBooks();
        alert('書籍が正常に削除されました');
      })
      .catch(error => {
        console.error('エラー:', error);
        alert('書籍の削除に失敗しました');
      });
  }
}

// フォームをリセットする関数
function resetForm() {
  bookForm.reset();
  bookIdInput.value = '';
  submitBtn.textContent = '登録';
  cancelBtn.style.display = 'none';
}