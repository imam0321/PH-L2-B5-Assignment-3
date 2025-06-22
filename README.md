# Library Management server

A RESTful API built with **Node.js**, **Express**, **MongoDB**, and **TypeScript** that manages a library system. Users can add books, borrow books with quantity management, and view aggregated summaries of borrowed books.

## 🚀 Features

- CRUD operations on books
- Borrow books with quantity and due date
- Automatic availability updates based on book copies
- Borrow summary via MongoDB aggregation pipeline
- Input validation using Zod
- Clear error handling and responses

## 🛠️ Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/imam0321/PH-L2-B5-Assignment-3.git
cd PH-L2-B5-Assignment-3
```

2. Install dependencies:

```
npm install
```

3. Create a .env file with:

```
PORT=5000
MONGODB_URL=mongodb://localhost:27017/libraryDB
```

4. Start the development server:

```
npm run dev
```

## 🔗 API Endpoints Overview

### Books

- **POST** `/api/books` — Add a new book
- **GET** `/api/books` — Get all books (supports filtering, sorting, and limiting)
- **GET** `/api/books/:bookId` — Get details of a book
- **PUT** `/api/books/:bookId` — Update a book
- **DELETE** `/api/books/:bookId` — Delete a book

### Borrow

- **POST** `/api/borrow` — Borrow a book with quantity and due date
- **GET** `/api/borrow` — Get summary of total borrowed quantities per book

## 👤 Author

**Imam Hossain**  
[GitHub Profile](https://github.com/imam0321)
