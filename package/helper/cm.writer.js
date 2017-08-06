/*打字效果插件*/
(function(a) {
	a.fn.writer = function(speed){
		this.each(function() {
			var d = a(this),c = d.html(),b = 0;
			d.html('');
			var e = setInterval(function(){
				var f = c.substr(b,1);
				if(f == '<'){ b = c.indexOf('>', b) + 1; }else{ b++; }
				if(b >= c.length){
					d.html(c.substring(0, b));
					clearInterval(e);
				}else{
					d.html(c.substring(0, b) + (b & 1 ? '_': ''));
				}
			},speed);
		});
		return this;
	}
})(jQuery);