(function(jQuery){
jQuery.jGrowl=function(m,o){
if(jQuery("#jGrowl").size()==0){
jQuery("<div id=\"jGrowl\"></div>").addClass(jQuery.jGrowl.defaults.position).appendTo("body");
}
jQuery("#jGrowl").jGrowl(m,o);
};
jQuery.fn.jGrowl=function(m,o){
if(jQuery.isFunction(this.each)){
var _6=arguments;
return this.each(function(){
var _7=this;
if(jQuery(this).data("jGrowl.instance")==undefined){
jQuery(this).data("jGrowl.instance",new jQuery.fn.jGrowl());
jQuery(this).data("jGrowl.instance").startup(this);
}
if(jQuery.isFunction(jQuery(this).data("jGrowl.instance")[m])){
jQuery(this).data("jGrowl.instance")[m].apply(jQuery(this).data("jGrowl.instance"),jQuery.makeArray(_6).slice(1));
}else{
jQuery(this).data("jGrowl.instance").notification(m,o);
}
});
}
};
jQuery.extend(jQuery.fn.jGrowl.prototype,{defaults:{header:"",sticky:false,position:"top-right",glue:"after",theme:"default",corners:"10px",check:500,life:3000,speed:"normal",easing:"swing",closer:true,log:function(e,m,o){
},beforeOpen:function(e,m,o){
},open:function(e,m,o){
},beforeClose:function(e,m,o){
},close:function(e,m,o){
},animateOpen:{opacity:"show"},animateClose:{opacity:"hide"}},element:null,interval:null,notification:function(_17,o){
var _19=this;
var o=jQuery.extend({},this.defaults,o);
o.log.apply(this.element,[this.element,_17,o]);
var _1a=jQuery("<div class=\"jGrowl-notification\"><div class=\"close\">&times;</div><div class=\"header\">"+o.header+"</div><div class=\"message\">"+_17+"</div></div>").data("jGrowl",o).addClass(o.theme).children("div.close").bind("click.jGrowl",function(){
jQuery(this).unbind("click.jGrowl").parent().trigger("jGrowl.beforeClose").animate(o.animateClose,o.speed,o.easing,function(){
jQuery(this).trigger("jGrowl.close").remove();
});
}).parent();
(o.glue=="after")?jQuery("div.jGrowl-notification:last",this.element).after(_1a):jQuery("div.jGrowl-notification:first",this.element).before(_1a);
jQuery(_1a).bind("mouseover.jGrowl",function(){
jQuery(this).data("jGrowl").pause=true;
}).bind("mouseout.jGrowl",function(){
jQuery(this).data("jGrowl").pause=false;
}).bind("jGrowl.beforeOpen",function(){
o.beforeOpen.apply(_19.element,[_19.element,_17,o]);
}).bind("jGrowl.open",function(){
o.open.apply(_19.element,[_19.element,_17,o]);
}).bind("jGrowl.beforeClose",function(){
o.beforeClose.apply(_19.element,[_19.element,_17,o]);
}).bind("jGrowl.close",function(){
o.close.apply(_19.element,[_19.element,_17,o]);
}).trigger("jGrowl.beforeOpen").animate(o.animateOpen,o.speed,o.easing,function(){
jQuery(this).data("jGrowl").created=new Date();
}).trigger("jGrowl.open");
if(jQuery.fn.corner!=undefined){
jQuery(_1a).corner(o.corners);
}
if(jQuery("div.jGrowl-notification:parent",this.element).size()>1&&jQuery("div.jGrowl-closer",this.element).size()==0&&this.defaults.closer!=false){
jQuery("<div class=\"jGrowl-closer\">[ close all ]</div>").addClass(this.defaults.theme).appendTo(this.element).animate(this.defaults.animateOpen,this.defaults.speed,this.defaults.easing).bind("click.jGrowl",function(){
jQuery(this).siblings().children("div.close").trigger("click.jGrowl");
if(jQuery.isFunction(_19.defaults.closer)){
_19.defaults.closer.apply(jQuery(this).parent()[0],[jQuery(this).parent()[0]]);
}
});
}
},update:function(){
jQuery(this.element).find("div.jGrowl-notification:parent").each(function(){
if(jQuery(this).data("jGrowl")!=undefined&&jQuery(this).data("jGrowl").created!=undefined&&(jQuery(this).data("jGrowl").created.getTime()+jQuery(this).data("jGrowl").life)<(new Date()).getTime()&&jQuery(this).data("jGrowl").sticky!=true&&(jQuery(this).data("jGrowl").pause==undefined||jQuery(this).data("jGrowl").pause!=true)){
jQuery(this).children("div.close").trigger("click.jGrowl");
}
});
if(jQuery(this.element).find("div.jGrowl-notification:parent").size()<2){
jQuery(this.element).find("div.jGrowl-closer").animate(this.defaults.animateClose,this.defaults.speed,this.defaults.easing,function(){
jQuery(this).remove();
});
}
},startup:function(e){
this.element=jQuery(e).addClass("jGrowl").append("<div class=\"jGrowl-notification\"></div>");
this.interval=setInterval(function(){
jQuery(e).data("jGrowl.instance").update();
},this.defaults.check);
if(jQuery.browser.msie&&parseInt(jQuery.browser.version)<7){
jQuery(this.element).addClass("ie6");
}
},shutdown:function(){
jQuery(this.element).removeClass("jGrowl").find("div.jGrowl-notification").remove();
clearInterval(this.interval);
}});
jQuery.jGrowl.defaults=jQuery.fn.jGrowl.prototype.defaults;
})(jQuery);

