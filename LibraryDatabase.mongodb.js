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
 
db.books.insertMany([
  {
    book_id: "BK1001",
    title: "One Piece",
    author: "Echiro Oda",
    available_copies: 5,
    is_for_sale: true,
    purchase_price: 650
  },
  {
    book_id: "BK1002",
    title: "The Art Of War",
    author: "Sun Tzu",
    available_copies: 4,
    is_for_sale: true,
    purchase_price: 760
  },
  {
    book_id: "BK100",
    title: "Arthashastra",
    author: "Chnakya",
    available_copies: 2,
    is_for_sale: false,
    purchase_price: 0
  }
]);
 
db.users.insertMany([
  {
    user_id: "U2001",
    name: "Vansh",
    email: "vp@example.com"
  },
  {
    user_id: "U2002",
    name: "Smit",
    email: "sm@example.com"
  },
  {
    user_id: "U2003",
    name: "Vaibhav",
    email: "vb@example.com"
  },
  {
    user_id: "U2004",
    name: "Mehul",
    email: "mh@example.com"
  }
]);

function borrowBook(borrow_id, user_id, book_id) {
  const session = db.getMongo().startSession();
  try {
    session.startTransaction();
    const booksColl = session.getDatabase("Library").books;
    const borrowColl = session.getDatabase("Library").borrow_records;
    const bookUpdate = booksColl.findOneAndUpdate(
      { book_id: book_id, available_copies: { $gt: 0 } },
      { $inc: { available_copies: -1 } },
      { returnDocument: "after" }
    );
 
    if (!bookUpdate) {
      throw new Error("Book unavailable for borrowing (no copies left).");
    }
 
    borrowColl.insertOne({
      borrow_id: borrow_id,
      user_id: user_id,
      book_id: book_id,
      borrow_date: new Date(),
      return_date: null,
      status: "borrowed",
      late_fee: 0
    });
 
    session.commitTransaction();
    print(`Book ${book_id} borrowed successfully by ${user_id}.`);
  } catch (err) {
    session.abortTransaction();
    print(`Borrow failed: ${err.message}`);
  } finally {
    session.endSession();
  }
}

db.borrow_records.aggregate([
  { $match: { status: "borrowed" } },
  {
    $addFields: {
      days_held: {
        $dateDiff: {
          startDate: "$borrow_date",
          endDate: "$$NOW",
          unit: "day"
        }
      }
    }
  },
  {
    $addFields: {
      overdue_days: {
        $max: [ { $subtract: ["$days_held", 30] }, 0 ]
      }
    }
  },
  {
    $addFields: {
      calculated_late_fee: { $multiply: ["$overdue_days", 20] }
    }
  },
  {
    $project: {
      _id: 0,
      borrow_id: 1,
      user_id: 1,
      book_id: 1,
      days_held: 1,
      overdue_days: 1,
      calculated_late_fee: 1
    }
  }
]);

function returnBook(borrow_id) {
  const session = db.getMongo().startSession();
  try {
    session.startTransaction();
    const db1 = session.getDatabase("Library");
    const borrowColl = db1.borrow_records;
    const booksColl = db1.books;
 
    const record = borrowColl.findOne({ borrow_id: borrow_id, status: "borrowed" });
    if (!record) throw new Error("Active borrow record not found.");
 
    const returnDate = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysHeld = Math.floor((returnDate - record.borrow_date) / msPerDay);
    const overdueDays = Math.max(daysHeld - 30, 0);
    const lateFee = overdueDays * 20;
 
    borrowColl.updateOne(
      { borrow_id: borrow_id },
      {
        $set: {
          status: "returned",
          return_date: returnDate,
          late_fee: lateFee
        }
      }
    );
 
    booksColl.updateOne(
      { book_id: record.book_id },
      { $inc: { available_copies: 1 } }
    );
 
    session.commitTransaction();
    print(`Book returned. Days held: ${daysHeld}, Late fee: ₹${lateFee}`);
  } catch (err) {
    session.abortTransaction();
    print(`Return failed: ${err.message}`);
  } finally {
    session.endSession();
  }
}