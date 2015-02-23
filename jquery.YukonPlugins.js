/**
 * Created by yukon12345 on 14-7-16.
 * @author yukon12345
 * @version 0.1.1
 * @see http://www.yukon12345.com
 * @email yukon12345@163.com qq:276299452
 * @license 开源全浏览器全jquery库版本兼容插件库，允许自由改写和商用。
 * @license 注意：公开或商业项目引用/使用代码片段时时必须通知本人所使用在什么项目当中（纯粹为统计应用在那些项目中）anyone who has used the plugin,should inform me  by email
that which project includes this plugin or code fragment .(just let me know is okay :)
 */
(function($){
    /*获得网址路径函数
    * */
    $.YgetUrlPath=function (opts){
        var vars= $.extend({
            "deep":0
        },opts);

        var url=execStr=document.location.href;
        pos=0;
        for(i=0;i<vars.deep+3;i++){
            pos=execStr.indexOf("/")+1;
            execStr= execStr.substring(pos);
            //console.log(execStr);
        }
        return url.substring(0,url.indexOf(execStr));
    };
    /*读取xml生成返回jquery对象
    * */
    $.YloadXml=function(opts){
        var vars= $.extend({
            "path":"test.xml"
        },opts);

             //ajax方式读取xml
            var xml;
            //兼容ie6无法读取xml,使用text
            var type="text";
            try{ new ActiveXObject("Microsoft.XMLDOM")}
            catch(e){ type="xml" }
            $.ajax({type: "GET",url: vars.path,dataType:type,async:false,
                success: function (data, textStatus, jqXHR) {//读取成功
                    if (typeof data == "string") {
                        xml = new ActiveXObject("Microsoft.XMLDOM");
                        xml.async = false;
                        xml.loadXML(data);
                    } else {
                        xml = data;
                    }

                },
                error: function (jqXHR, textStatus, errorThrown) {//读取失败时
                    alert(jqXHR.status + ' * ' + jqXHR.statusText + ' * ' + jqXHR.responseText);
                    alert(textStatus);
                }
            });
        return xml;
    };
    $.Ytree={
        /*备用函数，用于不同数据源。返回一项node的html
         *tod 改造
         * */
        getLiHtml:function($xmlNodeData){
            var _aString='';
            for(key in attr_arr)
            {_aString+= ' '+attr_arr[key]+'="'+$xmlNodeData.attr(attr_arr[key])+'"'}
           var _pre=_preString="";
           var _icon="node";
            var  _alt="点击修改节点";
           if($(">CHANNEL",$this).length){
               _pre="closed";
               _preString= ' <img src="../page_img/none.gif" class="'+_pre+'"/> ';
               _icon="nodes";
              _alt="点击获取子节点";
           }
            _aString=_preString+'<img src="../page_img/none.gif" class="'+_icon+'"/><a title="'+_alt+'" target="getter"  class="detail" href="admin_edit_channel_'+_icon+'.php?id='+$this.attr("number")+'" '+_aString+'>'+$this.attr("name")+'</a>';
           return '<li>'+_aString+'</li>';
        },
        /*备用函数，用于改造成ajax数据源返回儿子们节点的html
         *todo         改造
        * */
        getSonsHtml:function($context,_type){
            typeof _type=='undefined'?_type="li":1;
            var _html='';
            $('>CHANNEL',$context).each(function(){
                switch(_type){
                    case"li":
                    _html+=this.getLiHtml($(this));
                }

            });
            return _html;
        },
        /*返回整个子孙树
        *
        * */
        getTreeHtml:function($context){
            _Ytree=this;
            var  _liString='';
            $('>CHANNEL',$context).each(function(){
                $this=$(this);
                var _aString='';
                for(key in attr_arr)
                {_aString+= ' '+attr_arr[key]+'="'+$this.attr(attr_arr[key])+'"'}
                var _pre=_preString="";
                var _icon="node";
                var  _alt="点击修改节点";
                //有子节点的话
                if($(">CHANNEL",$this).length){
                    _pre="closed";
                    _preString= ' <img src="../page_img/none.gif" class="'+_pre+'"/> ';
                    _icon="nodes";
                    _alt="点击获取子节点";
                }
                var _innerString=_preString+'<img src="../page_img/none.gif" class="'+_icon+'"/><a title="'+_alt+'" target="getter"  class="detail" href="admin_edit_channel_'+_icon+'.php?id='+$this.attr("number")+'" '+_aString+'>'+$this.attr("name")+'</a>';
                _liString+= '<li>'+_innerString+_Ytree.getTreeHtml($this)+'</li>';
            });
            //  alert(_liString)
            return  '<ul class="treeUl">'+_liString+'</ul>'
        }

    };
    /*生成提示条插件
    *使用：$(selector).Ytip(); 针对某一控件出现提示条。文字来源于控件属性:tip
    * @version:0.1
    * @update time:2014-8-21
     */
    $.fn.Ytip=function(opts){
        var vars= $.extend({
           'width':null,
            'zIndex':999,
            'offsetX':0,
            'offsetY':0
        },opts);
        _=this;
        //生成一个tip
        var _makeTip=function($this){
            if(typeof $this.attr("tip")=='undefined')return;
            //添加提示条，默认宽度为控件宽度。高度随文字大小
            var _width=vars.width ||$this.width()
            var _left=$this.offset().left+vars.offsetX;
            var _top=parseInt($this.offset().top)+parseInt($this.height())+8+vars.offsetY;
            $("body").append('<div class="ytip" style="z-index:'+vars.zIndex+';width:'+_width+'; left:'+_left+';top:'+_top+';"><div class="ytip_head"></div><div class="ytip_body">'+$this.attr("tip")+'</div></div>');
        };
        //焦点时才显示
        return this.each(function(){
            $(this).bind('focus',function(){
                $this=$(this);
                _makeTip($this)
            }).bind('blur',function(){
                $('.ytip').remove()
            })
        })
    };
    //获取坐标长度
    $.fn.YgetCoord=function (attr){
        return parseInt(this.css(attr))
    };
    /*$(selector).Ymoving() 可移动插件
    *author yukon12345
    *@parame MIX handler接受选择器或jquery对象。默认为自己的jquery对象包装
    *@param JSON appearance 点击后变成的外观
     *@param Function fx 动态效果函数
     *@param Function overEvent  结束后执行函数
     *@param JSON oldCss 原外观
    *@desktopMode Boolean 桌面窗口模拟，true的话会点击置顶
    */
    $.fn.Ymoving=function(opts){
        if(typeof console === "undefined") { var console = { log: function (logMsg) { } };}
        var vars= $.extend({
            handler:null,
           appearance:{"opacity":0.7},
            fx:null,
            overEvent:function(){},
            oldCss:{},
            desktopMode:true
        },opts);
        return  this.each(function(){

            //判断handler,为空则是自己，非空为选择器或jquery对象
            var handler;
            //maxIndex为当前窗口最大index
            window.maxIndex=window.maxIndex?window.maxIndex:1000;
            if(typeof vars.handler=='undefined'||vars.handler==null||vars.handler=="")
            {handler=$(this)}
            else
            {   typeof vars.handler=='string'? handler=$(vars.handler,this):handler=vars.handler;}
            //获取原有样式
           // console.log("原始index:" +$(this).css("z-index"));
            for(var key in vars.appearance){
                vars.oldCss[key]= $(this).css(key);
            }

           // console.log( vars.oldCss);
           // console.log(vars.appearance);
            //被移动的对象
            var whole=this;
            //为了兼容2b的ie6变完全透明加上这句话
            $(whole).children(":not(.popdiv_back)").css("opacity",1)
            var relativeX,relativeY;
            handler.bind("mousedown",function(event){

                vars.desktopMode?window.maxIndex++:0;
                $(whole).css(vars.appearance);
                vars.desktopMode?$(whole).css("z-index",window.maxIndex):0;
                relativeX=event.pageX-parseInt($(whole).css("left"));
                relativeY=event.pageY-parseInt($(whole).css("top"));
              // console.log("可执行设置坐标"+relativeX+","+relativeY)
                //alert("可执行设置坐标"+relativeX+","+relativeY)
                $(document).bind("mousemove",function(event){
                    $(whole).css("top",event.pageY-relativeY);
                    $(whole).css("left",event.pageX-relativeX);

                  // console.log("可执行设置坐标" +$(whole).css("top"));
                })
            });

           $(document).bind("mouseup",function(event){
                vars.overEvent();
                $(document).unbind("mousemove");
                $(whole).css(vars.oldCss);
                //console.log($(whole).attr("id")+"回复后的index:" +$(whole).css("z-index"))

            })
        })

    };
    /*$(selector).Ystyle()自动设置样式
    *@param string style     默认扁平
    *@param string height 整体高度
    * @param string width 宽度
    * @param string padding 扁平模式下指透明框大小
    * @param string border 内容框的边框宽度  如设置了content边框要在里面写明
    * @param string backgroundColor:透明框颜色
    * todo ie11的宽高获取，ie11 pading和border的获取完善.在ie8解释引擎下没事。没有设置width和height时的获取
    * */
    $.fn.Ystyle=function(opts){
        if(typeof console === "undefined") { var console = { log: function (logMsg) { } };}
        var vars= $.extend({
            "style":"flat",
                height:null,
                width:null,
                padding:"10px",
                border:"2px",
                opacity:0.4,
                "backgroundColor":"#000"
        },opts);
        //根据传入的参数设置css
        var setCss=function ($ele,attr){
            vars[attr]!=null?$ele.css(attr,vars[attr]):0;
        };
        //设置扁平 style
        var flatStyle=function($handler){
            $back= $(".popdiv_back",$handler);
            $content=$(".popdiv_content",$handler);
            //alert($content.css("width")+","+$content.css("height"));
            setCss($handler,"width");
            setCss($handler,"height");
            //设置透明边宽度
            setCss( $back,"opacity");
            setCss( $handler,"padding");
            $back.css({"width":$handler.css("width"),"height":$handler.css("height"),"position":"absolute","left":0,"top":0,"z-index":-10,"background-color":vars.backgroundColor})
            //为了兼容垃圾ie不得不舍弃获取
            var shrink=2*(parseInt(vars.padding)+parseInt(vars.border));
           //var shrink=2*($handler.YgetCoord("padding")+$content.YgetCoord("border-width")+$content.YgetCoord("padding"))
           //alert($handler.css("padding")+","+$content.css("border-width")+","+$content.css("padding")+","+$handler.css("width")+","+shrink);
            $content.css({
                "width":($handler.YgetCoord("width")-shrink)+"px"
                ,"height":($handler.YgetCoord("height")-shrink)+"px"});
            //alert($content.css("width")+","+$content.css("height"));

        };

        return this.each(function(){
            switch (vars.style){
                case"flat":
                    flatStyle($(this));
                    break;
                default:
                    flatStyle($(this));
            }
        })
    };
    /*$(selector).Ypop()      弹出层插件
    *@parame poper 触发者接受选择器或jquery对象。空则无条件弹出
    *@param closer 关闭者,空为弹窗中的.close_btn
    *@param function fx 动态效果函数
    *@param Boolean needMask 是否有遮罩层
    *@param string  maskId 如果设置mask就要设置id和needMask
    *@param string  eventType 触发的事件
    *@param Boolean autoScroll 滚动时弹窗是否也自动滚动
    *@param Boolean autoClose 是否自动关闭 todo未实现
    *@param int divWidth 设定popdiv宽
    *@param int divHeight 设定popdiv高
    */
    $.fn.Ypop=function(opts){
        if(typeof console === "undefined") { var console = { log: function (logMsg) { } };}
        var vars= $.extend({
            "poper":null,
            "closer":null,
            "fx":null,
           // 如果设置mask就要设置id和needMask
            needMask:true,
            maskId:"overlay",
            "popInEvent":function(){},
            "popOutEvent":function(){},
            eventType:"click",
            autoScroll:true,
            autoClose:false,
            offSet:{"x":0,"y":0}

        },opts);
       var popIn=function(event){
           vars.popInEvent();
           //判断是触发式弹出还是无条件弹出
           var $popdiv=event.data.$popdiv||event;
           //设置最大索引值。最大索引值在桌面模式下有用
           window.maxIndex=window.maxIndex?++window.maxIndex:1000;
           vars.needMask==true?vars.maskIndex=window.maxIndex:0;
           //console.log("当前maxindex:"+window.maxIndex+"弹出层"+$popdiv.attr("id")+"的index"+window.maxIndex+"遮罩层"+vars.maskId+"的index"+vars.maskIndex)
           //vars.divHeight==null?$popdiv.css("height",vars.divHeight):0;

           $popdiv.css({
                "display":"block",
                "left":($(window).width()-$popdiv.width())/2+$(window).scrollLeft()+vars.offSet.x+"px",
                "top":($(window).height()-$popdiv.height())/2+$(window).scrollTop()+vars.offSet.y+"px",
                "z-index":++window.maxIndex
            });

            //iframe为了遮罩ie6 select.第二个div是为了拖拽时候防止过快时移动到iframe上停止
          if(vars.needMask){
           //为了防止多次弹出时避免遮罩层出现bug，必须设定index，id
              $('<div id="'+vars.maskId+'" style="background-color:#000000;height:'+$(document).height()+'px;width:'+$(document).width()+'px;left:0px;right:0px;position:absolute;z-index:'+vars.maskIndex+'"></div>').prependTo($(document.body)).css({"opacity":"0.2"}).append('<iframe frameborder="0" border="0" style="width:100%;height:100%;position:absolute;left:0;top:0;filter:Alpha(opacity=0);"></iframe>').append('<div style="height:100%;width:100%;position:absolute;left:0;right:0"></div>');
          } //绑定特定函数，便于解绑.当要自适应时
            $(window).bind("scroll",{"$popdiv":$popdiv},addjust);
            $(window).bind("resize",{"$popdiv":$popdiv},addjust);
        };
        var  addjust=function (event){
            var $popdiv=event.data.$popdiv;
            //判断事件类型，如果是resize要改变遮罩层的大小
            if(event.type=="resize"){
                $("#"+vars.maskId).css({"width":$(document).width()+"px","height":$(document).height()+"px"})
            }
            //是否自动滚动
            vars.autoScroll==true?$popdiv.css({
                "left":($(window).width()-$popdiv.width())/2+$(window).scrollLeft()+vars.offSet.x+"px",
                "top":($(window).height()-$popdiv.height())/2+$(window).scrollTop()+vars.offSet.y+"px"

            }):0
        };
        var popOut=function(event){
            vars.popOutEvent();
            event.data.$popdiv.css("display","none");
            vars.needMask==true? $("#"+vars.maskId).remove():0;
            $(window).unbind("scroll",addjust)
            $(window).unbind("resize",addjust)
        };
      return this.each(function(){
            var poper,closer,reason;
            //设定呼出者和关闭者
          var $popdiv=$(this);
            if(typeof vars.poper=='undefined'||vars.poper==null||vars.poper=="")
            {reason="no"}
            else
            {typeof vars.poper=="string"?poper=$(vars.poper):poper=vars.poper;}
          //判断是否无条件弹出
          if(reason=="no"){
              popIn($popdiv);
          }else
          {//弹出者某事件后执行popIn
            poper.bind(vars.eventType,{"$popdiv":$popdiv},popIn);
             }
          //alert(typeof vars.closer)
            if( typeof vars.closer=='undefined'||vars.closer==null||vars.closer=="")
            {
                closer=$(".close_btn",$popdiv)
            }
            else
            {typeof vars.closer=="string"?closer=$(vars.closer):closer=vars.closer;
               }
          closer.bind(vars.eventType,{"$popdiv":$popdiv},popOut);

        })
    }
})(jQuery);

