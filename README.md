# Bookstore-CMS API

>API for bookstore CMS built with Express & MongoDB

* Authentication
* CRUD operation for books

Endpoints

## Use HTTP methods to operate on collections and entities

There is one single rule concerning operations performed on collections and entities - **Use [HTTP methods](http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html)**

You can operate on resources using HTTP methods such as `POST`, `GET`, `PUT`, and `DELETE` -
to remember them, refer to the CRUD acronym (Create-Read-Update-Delete).

| Resource / HTTP method | POST (create)    | GET (read)  | PUT (update)           | DELETE (delete)    |
| ---------------------- | ---------------- | ----------- | ---------------------- | ------------------ |
| /api/users              | Create new user  |   |              |             | Delete a user
| /api/books        | Create new book  | Get a book data |update a book | Delete a book


```bash
# Install dependencies
npm install
# Start development server
npm run server

```

```bash
# Set up your connection to MongoDB Atlas
Create .env file and create environment variable below

# Set port for development
PORT=5000

mongo_connect="your_atlas_url"

jwtSecret="key_for_jwt"

```



## Contributors
- [Zeha Irawan](https://github.com/JangkarBumi)

### Version

1.0.0

### License

This project is licensed under the MIT License