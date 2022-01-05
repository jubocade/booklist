class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book => UI.addBook(book))
    }

    static addBook(book) {
        const booksList = document.querySelector('.books-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><span style="color: red; font-size: 20px; font-weight: bold; cursor: pointer" class="delete-btn">X</span></td>
        `

        booksList.appendChild(row);
    }

    static clearFields() {
        document.querySelector('.book-title').value = '';
        document.querySelector('.book-author').value = '';
        document.querySelector('.book-isbn').value = '';
    }

    static deleteBook(element) {
        if(element.classList.contains('delete-btn')) element.parentElement.parentElement.remove();
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.wrapper');
        const form = document.querySelector('.wrapper form');
        container.insertBefore(div, form);

        setTimeout(() => div.remove(), 3000);
    }
}

class Store {
    static getBooks() {
        let books;

        if(localStorage.getItem('books') === null) {
            books = [];
        }

        else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks());

document.querySelector('.wrapper form').addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.querySelector('.book-title').value;
    const author = document.querySelector('.book-author').value;
    const isbn = document.querySelector('.book-isbn').value;

    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill all fields!', 'danger');
    }

    else {
        const book = new Book(title, author, isbn);

        UI.addBook(book);
        Store.addBook(book);
        UI.showAlert('Book added!', 'success');
        UI.clearFields();
    }
});

document.querySelector('.books-list').addEventListener('click', (event) => {
    UI.deleteBook(event.target);
    Store.removeBook(event.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Book removed!', 'success');  
});
