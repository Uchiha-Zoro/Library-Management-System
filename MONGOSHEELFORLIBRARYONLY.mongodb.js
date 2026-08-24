/* global use */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("Library");

 

// 1. BOOKS COLLECTION - CRUD examples
 
// ---- Create ----
// db.books.insertOne({
//   book_id: "BK1003",
//   title: "Attack on titan",
//   author: "Hajime Isayama",
//   available_copies: 3,
//   is_for_sale: true,
//   purchase_price: 550
// });
 
// ---- Read ----
// db.books.find();                                   
// db.books.findOne({ book_id: "BK1003" });            
// db.books.find({ is_for_sale: true });               
// db.books.find({ available_copies: { $gt: 0 } });    
 
// ---- Update ----
// db.books.updateOne(
//   { book_id: "BK1003" },
//   { $set: { purchase_price: 500 } }
// );
 
// db.books.updateOne(
//   { book_id: "BK1003" },
//   { $inc: { available_copies: 2 } }   // add 2 more copies
// );
 
// ---- Delete ----
// db.books.deleteOne({ book_id: "BK1003" });
 
 
// 2. USERS COLLECTION - CRUD examples
 
// ---- Create ----
// db.users.insertOne({
//   user_id: "U2005",
//   name: "Test User",
//   email: "testuser@example.com"
// });
 
// db.users.insertMany([
//   { user_id: "U2006", name: "Uzumaki Naruto", email: "naruto@example.com" },
//   { user_id: "U2007", name: "Uchiha Sasuke", email: "sasuke@example.com" }
// ]);
 
// ---- Read ----
// db.users.find();
// db.users.findOne({ user_id: "U001" });
// db.users.find({ email: /example\.com$/ });   
 
// ---- Update ----
// db.users.updateOne(
//   { user_id: "U2005" },
//   { $set: { name: "Updated Name" } }
// );
 
// ---- Delete ----
// db.users.deleteOne({ user_id: "U2005" });
 
 
// 3. BORROW_RECORDS COLLECTION - via borrowBook() / returnBook()
 
// ---- Borrow a book ----
// borrowBook("BR3002", "U2006", "BK1003");
 
// ---- Read: check all currently borrowed books ----
// db.borrow_records.find({ status: "borrowed" });
 
// ---- Read: borrow history for one user ----
// db.borrow_records.find({ user_id: "U2006" });
 
// ---- Read: which books a user currently has out ----
// db.borrow_records.aggregate([
//   { $match: { user_id: "U2006", status: "borrowed" } },
//   {
//     $lookup: {
//       from: "books",
//       localField: "book_id",
//       foreignField: "book_id",
//       as: "book_details"
//     }
//   },
//   { $unwind: "$book_details" },
//   { $project: { borrow_id: 1, borrow_date: 1, "book_details.title": 1 } }
// ]);
 
// ---- Late fee check ----
// db.borrow_records.aggregate([
//   { $match: { status: "borrowed" } },
//   { $addFields: { days_held: { $dateDiff: { startDate: "$borrow_date", endDate: "$$NOW", unit: "day" } } } },
//   { $addFields: { overdue_days: { $max: [ { $subtract: ["$days_held", 30] }, 0 ] } } },
//   { $addFields: { calculated_late_fee: { $multiply: ["$overdue_days", 20] } } },
//   { $project: { _id: 0, borrow_id: 1, user_id: 1, book_id: 1, days_held: 1, overdue_days: 1, calculated_late_fee: 1 } }
// ]);
 
// ---- Return the book (uses the function; sets late_fee + status) ----
// returnBook("BR3002");
 
// ---- Confirm it's now returned ----
// db.borrow_records.findOne({ borrow_id: "BR3002" });
 
 
// 4. SALES_TRANSACTIONS COLLECTION - via purchaseBook()
 
// ---- Purchase a book ----
// purchaseBook("TXN4002", "U2007", "BK1003");
 
// ---- Read: all transactions ----
// db.sales_transactions.find();
 
// ---- Read: only completed purchases ----
// db.sales_transactions.find({ payment_status: "completed" });
 
// ---- Read: a user's purchase history with book titles ----
// db.sales_transactions.aggregate([
//   { $match: { user_id: "U2007" } },
//   {
//     $lookup: {
//       from: "books",
//       localField: "book_id",
//       foreignField: "book_id",
//       as: "book_details"
//     }
//   },
//   { $unwind: "$book_details" },
//   { $project: { transaction_id: 1, amount: 1, payment_status: 1, transaction_date: 1, "book_details.title": 1 } }
// ]);
 
// ---- Total revenue from completed sales ----
// db.sales_transactions.aggregate([
//   { $match: { payment_status: "completed" } },
//   { $group: { _id: null, total_revenue: { $sum: "$amount" } } }
// ]);
 
// ---- Try purchasing a book that's NOT for sale (should fail cleanly) ----
// purchaseBook("TXN4003", "U2006", "BK002");
 




