/*************
 * 坦克对象
 *************/
function Tank(war){
var _this = new Obstacle(war);
	_this.arrow = 't';
	_this.speed = 2;
	_this.timer = 10;
	_this.shootrate = 100; //发射率
	_this.keyset = [38,40,37,39,32,13,96]; //上下、左右、发射、停车、暂停
	_this.play = 1; //0暂停，1运行
	_this.auto = false; //是否懂得自动寻向
	
	//创建实体
	_this.creat = function(){
		//重新加载power
		_this.power = _this.powerMax;
		_this.body = $('<div><div class="power"><span>'+_this.power+'</span><div class="bar"><div>&nbsp;</div></div></div><div class="mask">&nbsp;</div></div>');
		_this.body.appendTo('body')
		.attr('id',_this.id)
		.css({'left':_this.left,'top':_this.top})
		.css({'width':_this.width+'px','height':_this.height+'px'})
		.css({'background-image':'url('+ _this.img +')'})
		.css({'background-color':'','position':'absolute'})
		.css({'background-repeat':'no-repeat'});
		_this.obj = $('#'+_this.id);
		if(_this.clas!=null){ _this.obj.attr('class',_this.clas); }
		if(_this.type!=null){ _this.obj.attr('type',_this.type); }
		//power
		_this.powerBody();
	};
	
	//坦克的炮弹
	_this.bean = function(){
		if(war.stop==false){
			var _bean = new Bean(war);
			_bean.parentID = _this.id;
			_bean.attack  = _this.attack;
			_bean.img = $skin.tank_bean;
			_bean.type = 'bean';
			_bean.width = 40;
			_bean.height = 40;
			_bean.target = 0;
			//判断方向
			var _l = parseInt(_this.obj.css('left'));
			var _t = parseInt(_this.obj.css('top'));
			var _w = parseInt(_this.obj.css('width'));
			var _h = parseInt(_this.obj.css('height'));
			switch( _this.arrow ){
				case 't': //上
				  _bean.left = _l + ( _w - _bean.width )/2;
				  _bean.top = _t - _bean.height;
				  _bean.target = _bean.top - _bean.range;
				  break;
				case 'b': //下
				  _bean.left = _l + ( _w - _bean.width )/2;
				  _bean.top = _t + _this.height;
				  _bean.target = _bean.top + _bean.height + _bean.range;
				  break;
				case 'l': //左
				  _bean.left = _l - _bean.width;
				  _bean.top = _t + ( _h - _bean.height )/2;
				  _bean.target = _bean.left - _bean.range;
				  break;
				case 'r': //右
				  _bean.left = _l + _this.width;
				  _bean.top = _t + ( _h - _bean.height )/2;
				  _bean.target = _bean.left + _bean.width + _bean.range;
				  break;
			}
			_bean.creat();
			_bean.arrow = _this.arrow; //炮弹和坦克同向
			_bean.move();
			war.allobj.push(_bean);
			if(_this.id=='tank_cm'){ war.echo.err('Fired artillery shells!'); }
			delete _bean;
		}
	}
	
	//是否碰撞场景边缘
	_this.onScreen = function(){
		var _l = parseInt(_this.obj.css('left'));
		var _t  = parseInt(_this.obj.css('top'));
		var _w  = parseInt(_this.obj.css('width'));
		var _h  = parseInt(_this.obj.css('height'));
		var _w2 = parseInt($('body').width());
		var _h2 = parseInt($('body').height());
		var onScreen = true;
		//判断方向
		switch( _this.arrow ){
			case 't': //上
			  if( _t - _this.speed <= 0 ){ onScreen = false; }
			  break;
			case 'b': //下
			  if( _t + _h + _this.speed  >= _h2 ){ onScreen = false; }
			  break;
			case 'l': //左
			  if( _l - _this.speed <= 0 ){ onScreen = false; }
			  break;
			case 'r': //右
			  if( _l + _w + _this.speed  >= _w2 ){ onScreen = false; }
			  break;
		}
		if(onScreen==false){ _this._auto(); }
		return onScreen;
	}
	

	_this._times = 0;
	//判断是否已与其他物体碰撞
	_this.CollisionFocusObj = null;
	_this.onCollision = function(){
		var _collision = false;
		
		//探测障碍物
		var _Sobj = null;
		var _id = null;
		var _type = null;
		
		var Sobj = null;
		var id = null;
		var type = null;
		
		var _ScanObj = _this.CollisionFocusObj; //当前记录的
		var ScanObj = war.ScanCollisionObj(_this); //新扫描出来的

		//设置障碍物焦点
		if(_ScanObj!=null){
			_Sobj = _ScanObj.obj;	
			_id = _Sobj.attr('id');
			_type = _Sobj.attr('type');
		}
		if(ScanObj!=null){
			Sobj = ScanObj.obj;
			id = Sobj.attr('id');
			type = Sobj.attr('type');
		}
		_this.CollisionFocusObj = ScanObj;
		
		//显示能量值
		if(id!=_id){
			$_tank_en1 = (_this.type=='tank_en' && _type == 'tank_cm');
			$_tank_en2 = (_this.type=='tank_en' && type == 'tank_cm');
			$_tank_cm = (_this.type=='tank_cm' && type!='tank_cm');
			if( _ScanObj!=null && type!='bean' && ($_tank_en1||$_tank_cm) ){ _ScanObj.powerHide(); }
			if( ScanObj!=null && type!='bean' && ($_tank_en2||$_tank_cm) ){ ScanObj.powerShow(); }
		}

		if(ScanObj!=null&&Sobj!=null){

			//如果自动坦克遇到tank_cm则自动发射
			if( _this.auto && id=='tank_cm'){
				_this._times++;
				if(_this._times%20 == 0){ _this.bean(); }
			}else if(_this.auto==false){
				if(id==null||(id!=_id)){
					//重新记录
					if(id!=null){ war.echo.out('<b>Found :</b>' + id); }
				}
			}
			
			_x1 = parseInt(_this.obj.css('left'));
			_y1 = parseInt(_this.obj.css('top'));
			_w1 = parseInt(_this.obj.css('width'));
			_h1 = parseInt(_this.obj.css('height'));
			
			_x2 = parseInt(Sobj.css('left'));
			_y2 = parseInt(Sobj.css('top'));
			_w2 = parseInt(Sobj.css('width'));
			_h2 = parseInt(Sobj.css('height'));

			//x轴上重叠
			var _x_arrow = ((_x1<=_x2)&&(_x2-_x1<=_w1) || (_x2<=_x1)&&(_x1-_x2<=_w2));
			//y轴上重叠
			var _y_arrow = ((_y1<=_y2)&&(_y2-_y1<=_h1) || (_y2<=_y1)&&(_y1-_y2<=_h2));
			
			//判断方向
			switch( _this.arrow ){
				case 't': //上
				  if( ( _x_arrow&&(_y1-_this.speed<=_y2+_h2)&&(_y1-_this.speed>_y2) ) ){ _collision = true; }
				  break;
				case 'b': //下
				  if( ( _x_arrow&&(_y1+_h1+_this.speed>=_y2)&&(_y1+_h1+_this.speed-_h2<_y2) ) ){ _collision = true; }
				  break;
				case 'l': //左
				  if( ( _y_arrow&&(_x1-_this.speed<=_w2+_x2)&&(_x1-_this.speed>_x2) ) ){ _collision = true; }
				  break;
				case 'r': //右
				  if( ( _y_arrow&&(_x1+_w1+_this.speed-_x2>=0)&&(_x1+_w1+_this.speed-_x2<_w2) ) ){ _collision = true; }
				  break;
			}
	
		}
		if(_collision==true){ _this._auto(); }
		return _collision;
	}
	//智能寻向
	_this._auto = function(){
		if(_this.auto){
			var a = ['t','b','l','r'];
			var b = _this.arrow;
			a.remove(b);
			var n = Math.floor(Math.random()*a.length+1)-1;
			setTimeout(function(){ _this.reArrow(a[n]);	},100);
		}
	}
	//移动引擎
	_this.engine = (
		function(){
			//判断 状态\场景碰撞\障碍物碰撞
			if(war.stop==false && _this.play==1 && _this.onScreen() && _this.onCollision()==false ){
				//判断方向
				var _t = parseInt(_this.obj.css('top'));
				var _l = parseInt(_this.obj.css('left'));
				switch( _this.arrow ){
					case 't': //上
					  _this.obj.css({'top':_t-_this.speed+'px'});
					  break;
					case 'b': //下
					  _this.obj.css({'top':_t+_this.speed+'px'});
					  break;
					case 'l': //左
					  _this.obj.css({'left':_l-_this.speed+'px'});
					  break;
					case 'r': //右
					  _this.obj.css({'left':_l+_this.speed+'px'});
					  break;
				}
			}
		}
	);
	
	//对象移动
	_this.move = function(){
		_this.moveID = setInterval(function(){ _this.engine(); },_this.timer);
	};
	//键盘监听
	_this.keyboard = function(){
		$(window.document).keydown(function(e){
			if( war.keyControl ){
				switch( e.keyCode ){
					case _this.keyset[0]: //上
					  _this.reArrow('t');
					  break;
					case _this.keyset[1]: //下
					  _this.reArrow('b');
					  break;
					case _this.keyset[2]: //左
					  _this.reArrow('l');
					  break;
					case _this.keyset[3]: //右
					  _this.reArrow('r');
					  break;
					case _this.keyset[4]: //发射
					  _this.bean();
					  break;
					case _this.keyset[5]: //回车键暂停或运行
					  if(war.stop==false){ _this.play = (_this.play==0)?1:0; }
					  break;
					case _this.keyset[6]: //暂停游戏
					  war.stop = (war.stop)?false:true;
					  break;
					default:
					  return false;
					break;
				}
			}
			return false;
		});
	};
	//销毁对象
	_this.display = function(){
		if(_this.moveID!=null){ clearInterval( _this.moveID ); }

		_this.obj.css({'background-color':'#060'});
		_this.obj.fadeOut(300,function(){ $(this).remove(); });
		
		war.allobj.remove(_this);
		delete _this;
	};

	//返回对象
	return _this;
}