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
 
 




