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
 
 




