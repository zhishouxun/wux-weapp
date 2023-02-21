"use strict";var _observers,_baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames2=_interopRequireDefault(require("../helpers/classNames")),_styleToCssString=_interopRequireDefault(require("../helpers/styleToCssString"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _defineProperty(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var downImage=function(e){return new Promise(function(t,a){/^http/.test(e)&&!/^http:\/\/tmp/.test(e)?wx.downloadFile({url:e,success:function(e){200===e.statusCode?t(e.tempFilePath):a(e.errMsg)},fail:function(e){a(e)}}):t(e)})};(0,_baseComponent.default)({properties:{prefixCls:{type:String,value:"wux-water-mark"},content:{optionalTypes:[Array,String],type:String,value:""},fontColor:{type:String,value:"rgba(0, 0, 0, .15)"},fontStyle:{type:String,value:"normal"},fontFamily:{type:String,value:"sans-serif"},fontWeight:{type:String,value:"normal"},fontSize:{type:Number,value:14},fullPage:{type:Boolean,value:!0},gapX:{type:Number,value:24},gapY:{type:Number,value:48},width:{type:Number,value:120},height:{type:Number,value:64},image:{type:String,value:""},imageHeight:{type:Number,value:64},imageWidth:{type:Number,value:128},rotate:{type:Number,value:-22},zIndex:{type:Number,value:2e3}},data:{wrapStyle:"",base64Url:""},observers:(_observers={},_defineProperty(_observers,"zIndex, gapX, width, base64Url",function(){this.updateStyle.apply(this,arguments)}),_defineProperty(_observers,"prefixCls, gapX, gapY, rotate, fontStyle, fontWeight, width, height, fontFamily, fontColor, image, imageWidth, imageHeight, content, fontSize",function(){this.setBase64Url.apply(this,arguments)}),_observers),computed:{classes:["prefixCls, fullPage",function(e,t){return{wrap:(0,_classNames2.default)(e,_defineProperty({},"".concat(e,"--full-page"),t)),canvas:"".concat(e,"__canvas")}}]},methods:{setBase64Url:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];var n=t[0],r=t[1],o=t[2],i=t[3],l=t[4],s=t[5],u=t[6],c=t[7],f=t[8],p=t[9],g=t[10],m=t[11],h=t[12],d=t[13],y=t[14];this.createCanvasContext({prefixCls:n,gapX:r,gapY:o,rotate:i,fontStyle:l,fontWeight:s,width:u,height:c,fontFamily:f,fontColor:p,image:g,imageWidth:m,imageHeight:h,content:d,fontSize:y})},createCanvasContext:function(t){var a=this,n=t.prefixCls,g=t.gapX,m=t.gapY,h=t.rotate,d=t.fontStyle,y=t.fontWeight,v=t.width,b=t.height,S=t.fontFamily,x=t.fontColor,e=t.image,_=t.imageWidth,w=t.imageHeight,C=t.content,N=t.fontSize,r=Promise.resolve();return e&&(r=r.then(function(){return downImage(e).catch(function(){return Promise.reject("Image download failed.")})})),r=(r=r.then(function(e){return function(p){return new Promise(function(c,f){var e="".concat(n,"__canvas");wx.createSelectorQuery().in(a).select("#".concat(e)).fields({node:!0,size:!0}).exec(function(e){if(e[0]){var t=e[0].node,a=t.getContext("2d"),n=wx.getSystemInfoSync().pixelRatio,r=(g+v)*n,o=(m+b)*n,i=v*n,l=b*n;if(t.width=r,t.height=o,p){a.translate(i/2,l/2),a.rotate(Math.PI/180*Number(h));var s=t.createImage();s.onload=function(){a.drawImage(s,-_*n/2,-w*n/2,_*n,w*n),a.restore(),c(t.toDataURL())},s.onerror=function(){f("Image creation failed.")},s.src=p}else if(C){a.textBaseline="middle",a.textAlign="center",a.translate(i/2,l/2),a.rotate(Math.PI/180*Number(h));var u=Number(N)*n;a.font="".concat(d," normal ").concat(y," ").concat(u,"px/").concat(l,"px ").concat(S),a.fillStyle=x,Array.isArray(C)?C.forEach(function(e,t){return a.fillText(e,0,t*u)}):a.fillText(C,0,0),a.restore(),c(t.toDataURL())}}else f("Canvas is not supported in the current environment.")})})}(e)})).then(function(e){!function(e){t.base64Url!==e&&a.setData({base64Url:e})}(e)},function(e){console.error(e)})},updateStyle:function(e,t,a,n){var r=(0,_styleToCssString.default)({zIndex:e,backgroundSize:"".concat(t+a,"px"),backgroundImage:n?"url('".concat(n,"')"):"unset"});this.setData({wrapStyle:r})}},ready:function(){var e=this.data,t=e.zIndex,a=e.gapX,n=e.width,r=e.base64Url;this.updateStyle(t,a,n,r),this.createCanvasContext(this.data)}});