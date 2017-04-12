(function($) { 
    $(function() {
		//判断Tap时间是否已经声明		
		//处理函数
		function collect(tetx,zz,i){
			tetx=tetx.match(zz);
			try{ 
				if(tetx.length==2){
					return tetx[1].split(",")[i];
				}
			}
			catch (e){
				return false;
			} 
		}
		
		Top_Sliding=function(){
			dom=null;
			child=null;
			path=null;
			touch_start=null;
			touch_move=null;
			touch_end=null;
			translate3d_x=0;//已经有的位移X
			translate3d_y=0;//已经有的位移y
			m_translate3d_x=0;
			m_translate3d_y=0;
			max_width=0;//最大移动宽度
			li_width=0;//元素宽度
			mov_px=40;
			this.create=function(dom,child,path){//参数获取的ID
				this.dom=dom;
				this.child=child;
				this.path=path;
				this.dom[0].addEventListener('touchstart',this.touchstart,false);//触摸事件
				this.dom[0].addEventListener('touchmove',this.touchmove,false);//滑动事件
				this.dom[0].addEventListener('touchend',this.touchend,false);//停止事件
				return this;
			}
			this.touchstart=function(e){//参数获取的ID
				window.home_slide['guest']=true;//用户开始滑动
				window.home_slide['timer']=0;
				if(e.touches.length>0){
					this.touch_start=e.touches[0];
					$text=	$(e.target).parents('.bannerSequence')[0].style.transform;
					this.translate3d_x= parseInt(collect($text,/translate3d\(([^.*$)]*)/,0),10);
					this.translate3d_y= parseInt(collect($text,/translate3d\(([^.*$)]*)/,1),10);
					this.li_width=$(e.target).parents('.swiper-slide').width();//元素宽度
					this.max_width=$(e.target).parents('.bannerSequence').width()-this.li_width;//操作的最大宽度 (元素-1)*宽度
				}
			}
			this.touchmove=function(e){//手指拖曳一个DOM元素。
				if(e.touches.length>0){
					this.touch_move=e.touches[0];
					$text=$(e.target).parents('.bannerSequence')[0].style.transform;
					this.m_translate3d_x= parseInt(collect($text,/translate3d\(([^.*$)]*)/,0),10);
					this.m_translate3d_y= parseInt(collect($text,/translate3d\(([^.*$)]*)/,1),10);
				}
				$index=Math.abs( parseInt(this.translate3d_x,10));
				$x=(this.touch_start.clientX+$index-this.touch_move.clientX)%(this.max_width);
				if(($x)<0){//判断方向
				  $(e.target).parents('.bannerSequence').css('transform','translate3d(-'+(this.max_width-Math.abs($x))+'px, 0px, 0px)').css('transition-duration',' .0s')
				}else{
				  $(e.target).parents('.bannerSequence').css('transform','translate3d(-'+($x)+'px, 0px, 0px)').css('transition-duration',' .0s')	
				}
			}
			this.touchend=function(e){//手指从一个DOM元素上移开。
				 window.home_slide['guest']=false;//用户开始滑动
				 try { 
						$text=$(e.target).parents('.bannerSequence')[0].style.transform;
						$text=collect($text,/translate3d\(([^.*$)]*)/,0);
						$index=Math.abs(parseInt(parseInt($text,10)/this.li_width),10);//当前模块的page
						$max_index=parseInt(this.max_width/this.li_width-1,10);//最大位置
					
						mov_px=40*2;
						 
						if(this.touch_start.clientX<this.touch_move.clientX){
						   $and_x=Math.abs((this.m_translate3d_x-this.translate3d_x)%this.li_width);//用作位移判断
						   if(this.touch_move.clientX-this.touch_start.clientX>=mov_px && $and_x>=mov_px){
							$x=$index*this.li_width;
						   }else{
							$x=($index+1)*this.li_width;
						   }
						}else{
						  $and_x=Math.abs((this.m_translate3d_x-this.translate3d_x)%this.li_width);//用作位移判断
						  if(Math.abs(this.m_translate3d_x%this.li_width)>=mov_px && $and_x>=mov_px){
							$x=($index+1)*this.li_width;
						   }else{
							$x=$index*this.li_width;
						   }
						}
					$yslen=$(e.target).parents('.bannerSequence').find('.swiper-slide').length-1;
					$(e.target).parents('.slideshow').find('.ctrls li').removeClass('on');
					$(e.target).parents('.slideshow').find('.ctrls li').eq(($x/this.li_width)%$yslen).addClass('on');
					$(e.target).parents('.bannerSequence').css('transform','translate3d(-'+( $x)+'px, 0px, 0px)').css('transition-duration',' .5s');
					this.touch_move=null;
				}catch (e){}
			}
		}
		//准备数据
		if($(".slideshow .bannerSequence").length){	
			$hd_this=$(".slideshow .bannerSequence .swiper-slide");
			css_width=parseInt($hd_this.css("width"),10)*($hd_this.length+1);
			$hd_this.parent().append('<div class="swiper-slide animate-in effect1">'+$hd_this.eq(0).html()+'</div>');
			$hd_this.parent().css('width',css_width);
			$sliding=new Top_Sliding();
			$sliding.create($(".slideshow .bannerSequence"));//创建对象
			$(".slideshow .ctrls").html("");//清空显示点的HTML
			for($i=0;$i<$(".slideshow .bannerSequence .swiper-slide").length-1;$i++){
				if($i==0){
					$(".slideshow .ctrls").append('<li class="on"></li>');
				}else{
					$(".slideshow .ctrls").append('<li class=""></li>');
				}
			}
		}
		

    });
 })(jQuery);
//自动滑动0.98 可以使用 但是存在 问题 CSS样式上的BUG 无法弥补
/*
 设置属性过快 则无效  所有使用延迟处理
*/
function home_slide_automation(){
  if(window.home_slide['timer']>=window.home_slide['time'] && window.home_slide['guest']==false ){
		(function($) { 
			$(function() {
				$text=$('.slideshow .bannerSequence')[0].style.transform;//得到样式
				$text=collect($text,/translate3d\(([^.*$)]*)/,0);
				this.li_width=$('.slideshow .bannerSequence .swiper-slide').width();//元素宽度
				window.home_slide['css_width']=this.li_width;
				this.max_width=$('.slideshow .bannerSequence').width()-this.li_width;//操作的最大宽度 (元素-1)*宽度
 				$index=Math.abs(parseInt(parseInt($text,10)/this.li_width),10);//当前模块的page
				$max_index=parseInt(this.max_width/this.li_width-1,10);//最大位置
				//最后一个是第一个
				$x=($index+1)*this.li_width;//下一个元素位置
				$x=$x%(this.max_width+this.li_width);
				$yslen=$('.bannerSequence').find('.swiper-slide').length-1;	
				$('.slideshow').find('.ctrls li').removeClass('on');
				$('.slideshow').find('.ctrls li').eq(($x/this.li_width)%$yslen).addClass('on');
				if($x==0){
					$('.bannerSequence').css('transform','translate3d(-'+( $x)+'px, 0px, 0px)').css('transition-duration',' .0s');
					$x=this.li_width;
					$('.slideshow').find('.ctrls li').removeClass('on');
					$('.slideshow').find('.ctrls li').eq(($x/this.li_width)%$yslen).addClass('on');
					setTimeout(function(){
						$x=window.home_slide['css_width'];
						$('.bannerSequence').css('transform','translate3d(-'+( $x)+'px, 0px, 0px)').css('transition-duration',' .5s');
					},10);
				}else{
					$('.bannerSequence').css('transform','translate3d(-'+( $x)+'px, 0px, 0px)').css('transition-duration',' .5s');
				}
			});
		 })(jQuery);
	   home_slide['timer']=0;
   }else{
	   home_slide['timer']=home_slide['timer']+home_slide['heart'];
   }
   setTimeout('home_slide_automation()', home_slide['heart']);
}
window.home_slide={};
window.home_slide['time']=3000;//触发时间
window.home_slide['heart']=10;//心跳时间
window.home_slide['guest']=false;//客人打扰
window.home_slide['timer']=0;//计时
window.home_slide['css_width']=0;//存在即可
home_slide_automation();//打开自动滑动