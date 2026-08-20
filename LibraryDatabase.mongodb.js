use('Library');

db.createCollection("books", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["book_id", "title", "author", "available_copies", "is_for_sale", "purchase_price"],
      properties: {
        book_id: { bsonType: "string", description: "Unique book identifier" },
        title: { bsonType: "string" },
        author: { bsonType: "string" },
        available_copies: { bsonType: "int", minimum: 0 },
        is_for_sale: { bsonType: "bool" },
        purchase_price: { bsonType: ["double", "int"], minimum: 0 }
      }
    }
  }
});
db.books.createIndex({ book_id: 1 }, { unique: true });

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "name", "email"],
      properties: {
        user_id: { bsonType: "string" },
        name: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+\\..+$" }
      }
    }
  }
});
db.users.createIndex({ user_id: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
