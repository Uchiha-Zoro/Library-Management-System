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

db.createCollection("borrow_records", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["borrow_id", "user_id", "book_id", "borrow_date", "status", "late_fee"],
      properties: {
        borrow_id: { bsonType: "string" },
        user_id: { bsonType: "string" },
        book_id: { bsonType: "string" },
        borrow_date: { bsonType: "date" },
        return_date: { bsonType: ["date", "null"] },
        status: { enum: ["borrowed", "returned"] },
        late_fee: { bsonType: ["double", "int"], minimum: 0 }
      }
    }
  }
});
db.borrow_records.createIndex({ borrow_id: 1 }, { unique: true });
db.borrow_records.createIndex({ user_id: 1, status: 1 });
db.borrow_records.createIndex({ book_id: 1, status: 1 });

db.createCollection("sales_transactions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["transaction_id", "user_id", "book_id", "amount", "payment_status", "transaction_date"],
      properties: {
        transaction_id: { bsonType: "string" },
        user_id: { bsonType: "string" },
        book_id: { bsonType: "string" },
        amount: { bsonType: ["double", "int"], minimum: 0 },
        payment_status: { enum: ["pending", "completed", "failed"] },
        transaction_date: { bsonType: "date" }
      }
    }
  }
});
db.sales_transactions.createIndex({ transaction_id: 1 }, { unique: true });
db.sales_transactions.createIndex({ user_id: 1 });
 