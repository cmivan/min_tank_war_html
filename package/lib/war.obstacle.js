/*************
 * 障碍物
 *************/
function Obstacle(war){
var _this = new Object();
	_this.id = 'obstacle_' + parseInt(Math.random() * 1000000000);
	_this.img = 'package/skin/default/tree.png';
	_this.arrow = 't';
	_this.left = 100;
	_this.top = 100;
	_this.width = 175;
	_this.height = 175;
	_this.attack  = 50;
	_this.defense = 50;
	_this.powerMax= 100;
	
	_this.clas = 'collision';
	_this.type = 'obstacle';
	
	_this.powerBody = function(){
		_this.body.find('.power').css({
			'left':'0',
			'top':'-10px',
			'width':'50px',
			'height':'20px',
			'position':'absolute'
		}).find('.bar').css({
			'height':'4px',
			'line-height':'4px',
			'border':'#060 1px solid',
			'box-shadow':'0 1px 3px #333 bd',
			'-moz-box-shadow':'0 1px 3px #333 bd',
			'-webkit-box-shadow':'0 1px 3px #333 bd',
			'overflow':'hidden'
		}).find('div').css({
			'width':'100%',
			'background-color':'#060',
			'overflow':'hidden',
			'opacity':'0.6'
		});
		
		_this.body.find('.mask').css({
			'width': _this.width + 'px',
			'height': _this.height + 'px',
			'background-color':'#333',
			'position':'absolute',
			'border':'#999 1px solid',
			'border-radius':'20px',
			'opacity':'0.2'
		});
		_this.body.find('.mask').fadeOut(0);
		_this.body.find('.power').fadeOut(0);
	}
	_this.powerUpdate = function(val){
		var _val = _this.power - ((val*val)/(_this.defense*2));
		_val = parseInt(_val);
		if(_val<=0){ _val=0; }
		_this.powerTo(_val);
		if(_val==0){ return true; }else{ return false; }
	}
	_this.powerTo = function(_val){
		_this.power = _val;
		//红色警告颜色
		_bar = _this.body.find('.power').find('.bar');
		if(_val<=(_this.powerMax/2.5)){
			_bar.css({'border':'#900 1px solid'}).find('div').css({'background-color':'#900'});
		}
		_val = parseInt(_val/_this.powerMax*100);
		_this.body.find('.power').find('span').text(_val)
		_bar.find('div').animate({'width':_val+'%'},200);
	}
	_this.powerShow = function(){
		_this.body.find('.mask').fadeIn(0);
		_this.body.find('.power').fadeIn(0);
	}
	_this.powerHide = function(){
		_this.body.find('.mask').fadeOut(600);
		_this.body.find('.power').fadeOut(300);
	}
	
	_this.creat = function(){
		//重新加载power
		_this.power = _this.powerMax;
		_this.body = $('<div><div class="power"><span>'+_this.power+'</span><div class="bar"><div>&nbsp;</div></div></div><div class="mask">&nbsp;</div></div>');

		var _left = _this.left-(_this.width/2);
		var _top = _this.top-(_this.height/2);
		_this.body.appendTo('body').attr('id',_this.id).css({
			'left':_left,'top':_top,
			'width':_this.width+'px',
			'height':_this.height+'px',
			'background-image':'url('+ _this.img +')',
			'background-color':'',
			'position':'absolute',
			'background-repeat':'no-repeat'
			});
		_this.obj = $('#'+_this.id);
		if(_this.clas!=null){ _this.obj.attr('class',_this.clas); }
		if(_this.type!=null){ _this.obj.attr('type',_this.type); }
		//power
		_this.powerBody();
	};
	
	//重新调整方向
	_this.reArrow = function(){
		var arrow = arguments[0]?arguments[0]:_this.arrow;  
		if(war.stop==false){
			switch( arrow ){
				case 't': //上
				  _this.arrow = arrow;
				  _this.obj.css({'background-position':'left top'});
				  break;
				case 'b': //下
				  _this.arrow = arrow;
				  _this.obj.css({'background-position':'right top'});
				  break;
				case 'l': //左
				  _this.arrow = arrow;
				  _this.obj.css({'background-position':'bottom right'});
				  break;
				case 'r': //右
				  _this.arrow = arrow;
				  _this.obj.css({'background-position':'bottom left'});
				  break;
			}
		}
	}
	
	_this.moveID = null;
	_this.display = function(){
		if(_this.moveID!=null){ clearTimeout( _this.moveID ); }

		_this.obj.css({'background-color':'#060'});
		_this.obj.fadeOut(300,function(){ $(this).remove(); });
		
		war.allobj.remove(_this);
		delete _this;
	};
	
	return _this;
}