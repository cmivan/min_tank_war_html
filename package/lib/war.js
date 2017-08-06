/*************
 * 战场
 *************/
function War(){
	var war = new Object(); 
	war.level = 1;
	war.keyControl = true;
	war.stop = false; //是否暂停
	war.width = parseInt($(window).width());
	war.height = parseInt($(window).height());
	//Record all objects
	war.allobj = [];
	//计算积分
	war.scor = function(){
		
	}
	//The end of the war
	war.end = function(){
		war.keyControl = false;
		setTimeout(function(){
			war.echo.errB('The hero is dead!');
			war.echo.errB('And the game is over!');
			setTimeout(function(){ war.stop = true; },500);
		},1500);
	}
	//Initialize the Mask
	war.mask_cm = function(){
		var _obj = new Obstacle(war);
		_obj.id = 'tank_home';
		_obj.img = $skin.tank_home;
		_obj.width = 270;
		_obj.height = 128;
		_obj.left = parseInt(war.width/2);
		_obj.top = parseInt(war.height-(_obj.height/2));
		_obj.creat();
		//对象存入数组
		war.allobj.push(_obj);
		return _obj;
	}
	//Loading random obstacles
	war.obstacle = function(num){
		if(num!=parseInt(num)){ num=5; }
		var _this = new Array();
		for(var i=0;i<num;i++){
			_this[i] = new Obstacle(war);
			_this[i].img = $skin.obstacle;
			_this[i].powerMax = parseInt(Math.random() * 10)*50 + 80;
			_this[i].left = Math.random() * war.width;
			_this[i].top = Math.random() * (war.height-235);
			_this[i].creat();
			var _random = parseInt( Math.random()*5 )*(-175);
			_this[i].obj.css({'background-position':_random+'px 0'});
			//Object into an array
			war.allobj.push(_this[i]);
		}
		return _this;
	}
	//The initialization Hero tank
	war.tank_cm = function(){
		var _this = new Tank(war);
		_this.id = 'tank_cm';
		_this.type = 'tank_cm';
		_this.img = $skin.tank_cm;
		_this.powerMax = 1000;
		_this.attack  = 100;
		_this.width = 60;
		_this.height = 60;
		_this.left = parseInt((war.width-_this.width)/2);
		_this.top = parseInt(war.height-_this.height);
		_this.creat();
		_this.move();
		_this.keyboard();
		//Object into an array
		war.allobj.push(_this);
		return _this;
	}
	//Randomly to create a villain tank
	war.tank_en = function(num){
		if(num!=parseInt(num)){ num=5; }
		var _tank = new Array();
		for(var i=0;i<num;i++){
			_tank[i] = new Tank(war);
			_tank[i].id = 'tank_' + parseInt(Math.random() * 1000000000);
			_tank[i].type = 'tank_en';
			_tank[i].powerMax = parseInt(Math.random() * 5)*50 + 150;
			_tank[i].width = 60;
			_tank[i].height = 60;
			_tank[i].left = Math.random() * war.width;
			_tank[i].top = Math.random() * (war.height-120);
			_tank[i].img = $skin.tank_en;
			_tank[i].auto = true;
			_tank[i].creat();
			_tank[i].move();
			//Object into an array
			war.allobj.push(_tank[i]);
		}
		return _tank;
	}
	
	//Radar scan, detect obstacles in front of
	war.ScanCollisionObj = function(Obj){
		//Active Object
		var obj = null;
		var _max = null;
		var _obj = Obj.obj;
		var _arrow = Obj.arrow;
		var _type = Obj.type;
		var _x1 = parseInt(_obj.css('left'));
		var _y1 = parseInt(_obj.css('top'));
		var _w1 = parseInt(_obj.css('width'));
		var _h1 = parseInt(_obj.css('height'));
		var _x2 = null;
		var _y2 = null;
		var _w2 = null;
		var _h2 = null;
		//Passive object
		for(coll in war.allobj){
			var _collision = false;
			if(coll==parseInt(coll)){
				var _coll = war.allobj[coll];
				var _collObj = _coll.obj;
				var type = _collObj.attr('type');
				if(((_type=='tank_cm'||_type=='tank_en')&&type!='bean')||_type=='bean'){
					_x2 = parseInt(_collObj.css('left'));
					_y2 = parseInt(_collObj.css('top'));
					_w2 = parseInt(_collObj.css('width'));
					_h2 = parseInt(_collObj.css('height'));
					//Determine the direction of
					var _x_arrow_left = (_x1<_x2)&&(_x1+_w1>_x2)&&(_x1+_w1<_x2+_w2);
					var _x_arrow_right = (_x2<_x1)&&(_x1-_x2<_w2);
					var _y_arrow_top = (_y1<=_y2)&&(_y1+_h1>_y2)&&(_y1+_h1<_y2+_h2);
					var _y_arrow_bottom = (_y2<=_y1)&&(_y1-_y2<_h2);
					//x轴上重叠
					var _x_arrow = ((_x1<=_x2)&&(_x2-_x1<=_w1) || (_x2<=_x1)&&(_x1-_x2<=_w2));
					//y轴上重叠
					var _y_arrow = ((_y1<=_y2)&&(_y2-_y1<=_h1) || (_y2<=_y1)&&(_y1-_y2<=_h2));
					switch( _arrow ){
					  case 't': //上
					    $y2 = _y2+_h2;
						if( _x_arrow && (_y1>=$y2) ){
							_collision = true;
							if(_max==null || _max<$y2){ _max = $y2; obj = _coll; }
						}else if( _x_arrow && (_y1<$y2) && (_y1>_y2) ){
							_collision = true;
							if(_max==null || _max<_y2){ _max = _y2; obj = _coll; }
						}
						break;
					  case 'b': //下
					    $y2 = _y2+_h2;
						if( _x_arrow && (_y1+_h1<=_y2) ){
							_collision = true;
							if(_max==null || _max>_y2){ _max = _y2; obj = _coll; }
						}else if( _x_arrow && (_y1>=_y2)&&(_y1+_h1<$y2) ){
							_collision = true;
							if(_max==null || _max>$y2){ _max = $y2; obj = _coll; }
						}
						break;
					  case 'l': //左
					    $x2 = _x2+_w2;
						if( _y_arrow && (_x1>=$x2) ){
							_collision = true;
							if(_max==null || _max<$x2){ _max = $x2; obj = _coll; }
						}else if( _y_arrow && (_x1<$x2) && (_x1>_x2) ){
							_collision = true;
							if(_max==null || _max<_x2){ _max = _x2; obj = _coll; }
						}
						break;
					  case 'r': //右
					    $x2 = _x2+_w2;
						if( _y_arrow && (_x1+_w1<=_x2) ){
							_collision = true;
							if(_max==null || _max>_x2){ _max = _x2; obj = _coll; }
						}else if( _y_arrow && (_x1>=_x2)&&(_x1+_w1<$x2) ){
							_collision = true;
							if(_max==null || _max>$x2){ _max = $x2; obj = _coll; }
						}
						break;
					}
				}
			}
		}
		return obj;	
	}

	//Output
	war.echo = function(){
		this.id = 'echo_div';
		this.max = 20;
		this.obj = null;
		this.echoobj = null;
		this.creat = function(){
			$('<div id="'+this.id+'_box"><div id="'+this.id+'">&nbsp;</div></div>').appendTo('body').css({
				'left':'10px',
				'top':'10px',
				'background-color':'#333',
				'position':'absolute',
				'border':'#060 1px solid',
				'border-radius':'5px',
				'z-index':'9999',
				'opacity':'0.65',
				'overflow':'hidden'
				});
			
			this.obj = $('#' + this.id + '_box');
			this.echoobj = $('#' + this.id);
			this.echoobj.css({
				'margin':'12px',
				'padding-left':'60px',
				'width':'250px',
				'height':'106px',
				'background-image':'url('+$skin.logo+')',
				'background-repeat':'no-repeat',
				'overflow':'hidden'
				});
		}
		this.echoNum = 0;
		this.err  = function(str){ this.out(str,'color:#f00;'); }
		this.errB = function(str){ this.out(str,'color:#f00;font-weight:bold;'); }
		this.outB = function(str){ this.out(str,'font-weight:bold;text-decoration:underline'); }
		this.outG = function(str){ this.out(str,'color:#0C0;font-weight:bold;'); }
		this.out  = function(str,style){
			var _echoID = 'tip_' + parseInt(Math.random()*1000000);
			str = '<div id="'+_echoID+'" style="'+style+'">'+str+'</div>';
			this.echoNum++;
			if(this.echoNum>this.max){
				this.echoNum = 0;
				this.echoobj.html( str );
			}else{
				this.echoobj.prepend( str );
			}
			$('#' + _echoID).writer(20);
		}
		return this;	
	}

	war.creat = function(){
		$('body').css({'background-image':'url('+$skin.war_bg+')'});
		//Load and rewrite the output window
		war.echo = war.echo();
		_echo = war.echo;
		_echo.creat();
		_echo_w = parseInt(_echo.obj.width());
		_echo_h = parseInt(_echo.obj.height());
		_echo_l = (war.width-_echo_w)/2;
		_echo_t = (war.height-_echo_h)/2;
		_echo.obj.css({'left':_echo_l+'px','top':_echo_t+'px'});
		
		_echo.obj.fadeOut(0)
		.fadeIn(500,function(){ war.echo.errB('Welcome To The Game!'); }).delay(500)
		.fadeIn(500,function(){ war.echo.out('Game Name: CM.War v1.0'); }).delay(500)
		.fadeIn(500,function(){ war.echo.out('Development: 2012/5/12'); }).delay(500)
		.fadeIn(500,function(){ war.echo.outB('Game Design: CM.Ivan'); }).delay(500)
		.fadeIn(500,function(){ war.echo.out('Contact: cm.ivan@qq.com'); }).delay(1000)
		.fadeIn(500,function(){ war.echo.outG('Loading....'); }).delay(1000)
		.fadeIn(500,function(){ war.echo.errB('Now!let`s war.'); }).delay(800)
		.animate({'left':'10px','top':'10px'},500,function(){
			//加载 随机障碍物
			var _obstacle= war.obstacle(10);
			//初始化正派的坦克
			var _tank_cm = war.tank_cm();
			var _mask_cm = war.mask_cm();
			//随机创建反派坦克
			var _tank_en = war.tank_en(6);
		});
		
//			//加载 随机障碍物
//			var _obstacle= war.obstacle(12);
//			//初始化正派的坦克
//			var _tank_cm = war.tank_cm();
//			var _mask_cm = war.mask_cm();
//			//随机创建反派坦克
//			var _tank_en = war.tank_en(5);

		$('body').mousedown(function(){ //alert(war.allobj);
			});
	};
	
	return war;
}