module.exports = function(db, ObjectId){
	var commentSchema = db.Schema({
		book: {type: ObjectId, ref: 'book_library'},
		comment: {type: String, required: true},
	});

	return db.model('comment_library', commentSchema);
};