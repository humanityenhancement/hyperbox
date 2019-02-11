var Application = {
	Open: function(a, b) {
		var c = (typeof a === "function" ? a : window[a]) ;
		return typeof c === "function" && b ? c.apply(null, b) : (typeof c === "function" ? c() : null ) ;
	}
};