/*************
 * 初始化设置
 *************/
var skin= 'tank';
var $skin = {
	'logo':'package/public/cmlogo.png',
	'war_bg':'package/skin/'+skin+'/bg.jpg',
	'obstacle':'package/skin/'+skin+'/tree.png',
	'tank_cm':'package/skin/'+skin+'/tank_cm.png',
	'tank_en':'package/skin/'+skin+'/tank_en.png',
	'tank_bean':'package/skin/'+skin+'/bean.png',
	'tank_home':'package/skin/'+skin+'/tank_home.png'
}
$(function(){
	$('body').css({
				  'font-size':'12px',
				  'font-family':'Tahoma, Geneva, sans-serif',
				  'line-height':'15px',
				  'margin':'0',
				  'background-image':'url('+$skin.war_bg+')',
				  'background-color':'#333',
				  'color':'#fff',
				  'position':'relative',
				  'overflow':'hidden'
				  });
	//$(document).bind("contextmenu",function(){return false;});  
	$(document).bind("selectstart",function(){return false;});  
});