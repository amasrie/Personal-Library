module.exports = function(db){
	var bookSchema = db.Schema({
		title: {
			type: String,
			required: true
		},
		commentcount: {
			type: Number,
			default: 0
		}
	});

	return db.model('book_library', bookSchema);
};