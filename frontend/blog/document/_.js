const blog = function(){	
  this.www = www;
	this.doc = row;
}
		
blog.prototype.start = async function(parent){
	this.parent = parent;
}
			
blog.prototype.copyURL = function(uri){
	copy(this.getURI(uri));
	alert('URL Copiada :)');
}

blog.prototype.getURI = function(uri){
	return location.href;
}

blog.prototype.sort = function(sort_field, sort_type) {
  location.href = '/?sort_field=' + sort_field + '&sort_type=' + sort_type;
}

app.modules.blog = blog;