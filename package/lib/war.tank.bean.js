/*************
 * 炸弹对象
 *************/
function Bean(war){
var _this = new Obstacle(war);
	_this.id = 'bean_' + parseInt(Math.random() * 1000000000);
	_this.parentID = null;
	_this.range = 600;
	_this.timer = 10;
	_this.speed = 10;
	_this.target=0;
	_this.creat = function(){
		//重新加载power
		_this.power = _this.powerMax;
		//_this.body = $('<div><div class="power"><span>'+_this.power+'</span><div class="bar"><div>&nbsp;</div></div></div></div>');
		_this.body = $('<div></div>');
		_this.body.appendTo('body').attr('id',_this.id).css({
			'left':_this.left,
			'top':_this.top,
			'width':_this.width+'px',
			'height':_this.height+'px',
			'background-image':'url('+ _this.img +')',
			'background-color':'','position':'absolute',
			'background-repeat':'no-repeat'
			});
		_this.obj = $('#'+_this.id);
		if(_this.clas!=null){ _this.obj.attr('class',_this.clas); }
		if(_this.type!=null){ _this.obj.attr('type',_this.type); }
		//power
		_this.powerBody();
	};
	
	
	_this.CollisionFocusObj = null;
	_this.onCollision = function(){
		var _collision = false;
		
		var _x1 = parseInt(_this.obj.css('left'));
		var _y1 = parseInt(_this.obj.css('top'));
		var _w1 = parseInt(_this.obj.css('width'));
		var _h1 = parseInt(_this.obj.css('height'));
		
		//探测障碍物
		var Sobj = null;
		var ScanObj = war.ScanCollisionObj(_this); //新扫描出来的
		_this.CollisionFocusObj = ScanObj; //当前记录的
		//设置障碍物焦点
		if(ScanObj!=null){ Sobj = ScanObj.obj; }
		
		if(Sobj!=null){
			var type = Sobj.attr('type');
			var _id = Sobj.attr('id');
			//if(_id!='tank_cm'){
			var _x2 = parseInt(Sobj.css('left'));
			var _y2 = parseInt(Sobj.css('top'));
			var _w2 = parseInt(Sobj.css('width'));
			var _h2 = parseInt(Sobj.css('height'));
			//判断方向
			var _x_arrow_left = (_x1<_x2)&&(_x2-_x1<_w1);
			var _x_arrow_right = (_x2<_x1)&&(_x1-_x2<_w2);
			var _y_arrow_top = (_y1<=_y2)&&(_y2-_y1<_h1);
			var _y_arrow_bottom = (_y2<=_y1)&&(_y1-_y2<_h2);
			_collision = ((_x_arrow_left||_x_arrow_right)&&(_y_arrow_top||_y_arrow_bottom)); 
		}
		return _collision;
	}
	
	
	//检测碰撞则执行
	_this.collision = function(){
		if( _this.onCollision() ){
			var _call = _this.CollisionFocusObj;
			var _callID = _call.obj.attr('id');
			
			_this.display();
			if( _call.powerUpdate( _this.attack ) || (_this.parentID=='tank_cm'&&_callID=='tank_home') ){
				_call.display();
				//杀死英雄，游戏就玩完了
				if(_callID=='tank_cm'){ war.end(); }
			}

			if(_this.parentID=='tank_cm'){
				war.echo.errB('Bomb blast!');
				return true;
			}
		}
		return false;
	}
	
	_this.engine = function(){
		//判断方向
		var _t = parseInt(_this.obj.css('top'));
		var _l = parseInt(_this.obj.css('left'));
		//判断 状态\场景碰撞\障碍物碰撞
		if(war.stop==false && _this.collision()==false ){
			switch( _this.arrow ){
				case 't': //上
				  _t = _t-_this.speed;
				  if(_t>_this.target){
					  var _opacity = (_t-_this.target)/_this.range;
					  _this.obj.css({'top':_t+'px','opacity':_opacity});
				  }else{
					  _this.display();
				  }
				  break;
				case 'b': //下
				  _t = _t+_this.speed;
				  if(_t<_this.target){
					  var _opacity = (_this.target-_t)/_this.range;
					  _this.obj.css({'top':_t+'px','opacity':_opacity});
				  }else{
					  _this.display();
				  }
				  break;
				case 'l': //左
				  _l = _l-_this.speed;
				  if(_l>_this.target){
					  var _opacity = (_l-_this.target)/_this.range;
					  _this.obj.css({'left':_l+'px','opacity':_opacity});
				  }else{
					  _this.display();
				  }
				  break;
				case 'r': //右
				  _l = _l+_this.speed;
				  if(_l<_this.target){
					  var _opacity = (_this.target-_l)/_this.range;
					  _this.obj.css({'left':_l+'px','opacity':_opacity});
				  }else{
					  _this.display();
				  }
				  break;
			}
		}
	}
	_this.move = function(){
		_this.reArrow();
		_this.moveID = setInterval(function(){ _this.engine(); },_this.timer);
	};
	
	_this.display = function(){
		if(_this.moveID!=null){ clearInterval( _this.moveID ); }
		_this.obj.remove();
		
		war.allobj.remove(_this);
		delete _this;
	};
	
	return _this;
}