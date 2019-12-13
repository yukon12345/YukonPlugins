/**
 * 基于jquery的公共函数插件，函数名统一用p开头。
 * @author yukon12345 2008
 * @email yukon12345@163.com
 */
(function ($) {
    /**
     * 判断一个dom对象是否有attr名
     * @param attrName
     * @returns {boolean}
     */
    $.fn.pHasAttr = function (attrName) {
        return this.attr(attrName) == undefined ? false : true;

    }
    /**
     * 获得当前某深度路径路径。比如localhost/truename为第二层
     * @param deep 深度，默认3
     * @returns {string}
     */
    $.pGetUrlPath = function (opts) {
        var vars = $.extend({
            "deep": 0
        }, opts);

        var url = execStr = document.location.href;
        pos = 0;
        for (i = 0; i < vars.deep + 3; i++) {
            pos = execStr.indexOf("/") + 1;
            execStr = execStr.substring(pos);
            //console.log(execStr);
        }
        return url.substring(0, url.indexOf(execStr));
    };
    /**
     * 返回是否ie6
     * @returns {boolean}
     */
    $.pIsIE6 = function () {
        return !$.support.opacity && !$.support.style && window.XMLHttpRequest == undefined;
    }
    /*生成提示条插件
*使用：$(selector).pTip(); 针对某一class含tip__trigger的控件周边出现提示条。
* 绑定的selector是控件的父元素，文字来源于控件属性:tip='这里写提示条的内容'
* @version 0.1
* .ptip{position:absolute;}
  .ptip__body{
 color:#555;background-color: #fffac8;border-bottom: 2px solid #a73af4;padding:8px;line-height: 20px;border-left: 1px solid         #DEDEDE;border-right: 1px solid #DEDEDE;margin-top:-8px;}
  .ptip__head{height: 12px;background: url("../img/ptip_head.gif") no-repeat 0 0;line-height: 0px}
 */
    $.fn.pTip = function (opts) {
        var vars = $.extend({
            'width': 200,
            'zIndex': 9999,
            'offsetX': 0,
            'offsetY': 5,
            handle: '.tip__trigger'
        }, opts);
        _ = this;
        //生成一个tip
        var makeTip = function ($this) {
            //console.log($this.attr('class')+$this[0].nodeName)
            if (typeof $this.attr("tip") == 'undefined') return;
            //添加提示条，默认宽度为控件宽度。高度随文字大小
            var width = vars.width || $this.width();
            width = parseInt(width);

            var left = $this.offset().left + vars.offsetX;
            headClass = 'ptip__head';
            //超过宽度就从左边显示
            if (left + parseInt(vars.width) > $(document).width()) {
                left = left - parseInt(vars.width) + $this.width();
                headClass = 'ptip__head--no-pointer'
            }

            left = parseInt(left);
            var top = parseInt($this.offset().top) + parseInt($this.height()) + 8 + vars.offsetY;
            $newTip=$('<div class="ptip" style="z-report:' + vars.zIndex + ';width:' + width + 'px; left:' + left + 'px;top:' + top + 'px;"><div class="' + headClass + '"></div><div class="ptip__body">' + $this.attr("tip") + '</div></div>');
            $("body").append($newTip);
            if (top + parseInt($newTip.height()) > $(document).height()-5) {
                top=$this.offset().top-$newTip.height()
                $newTip.css({'top':top+'px'})
                $('.ptip__head').addClass('ptip__head--no-pointer').removeClass('ptip__head')
            }

        };
        //焦点时才显示
        return this.each(function () {
            $(this).bind('focus mouseover', vars.handle, function (e) {

                var $this = $(e.target);
                makeTip($this)
            }).bind('blur mouseout', vars.handle, function (e) {
                $('.ptip').remove()
            })
        })
    };

    //获取坐标长度
    $.fn.pGetCoord = function (attr) {
        return parseInt(this.css(attr))
    };
    /**
     *
     * @param jqXHR $.ajax回传的XMLHttpRequest对象
     * @param textStatus $.ajax回传的文本
     * @param errorThrown
     * @returns {string}
     */
    $.pAjaxErrorMsg = function (XMLHttpRequest, textStatus, errorThrown) {
        return XMLHttpRequest.status + ' * ' + XMLHttpRequest.statusText + ' * ' + XMLHttpRequest.responseText + '<br>' + textStatus
    }
    /**
     * 使表格能够点击th表头进行排序的插件。
     * 表格头行目前需要:<tr><th><a selector=sortHandler>数据</a></th></tr>的格式。
     * @param opts 预设函数
     * @param ascClass 顺序排列时的颜色class
     * @param descClass 逆序排列时的颜色class
     * @param sortHandler 实际点击某元素进行排序的选择器
     * @param orderTag  标记顺逆的小符号的选择器
     * @param defaultOrder 如果是无序的列，点击后默认是desc逆序还是asc顺序
     */
    $.fn.pSortable = function (opts) {
        var vars = $.extend({
            'ascClass': 'by-green-light',
            'descClass': 'by-pink-light',
            'sortHandler': '.sort_link',
            'orderTag': '.order_tag',
            'defaultOrder': 'desc'
        }, opts);
        return this.each(function () {
            _this = this//parent this
            $(_this).on('click', vars.sortHandler, function () {
                var $this = $(this)//实际出发事件的元素
                var index = $this.parent().index();
                var headTr = $('tr:eq(0)', _this)
                var oldTrs = $('tr:gt(0)', _this)
                var tipTex = {
                    'desc': '当前从大到小逆序,点击后从小到大顺序',
                    'asc': '当前从小到大顺序,点击后从大到小逆序',
                    'no-2-desc': '当前无序,点击后从大到小逆序',
                    'no-2-asc': '当前无序,点击后从小到大顺序'
                }
                oldTrs.each(function () {//所有序号减1,方便排序
                    $(this).find('td').eq(0).html(parseInt($(this).find('td').eq(0).html() - 1))
                })
                var sortType;
                if ($this.text().indexOf('∨') !== -1) {
                    //原顺序，现在要逆序
                    sortType = desc;
                    $this.attr('tip', tipTex['desc']);
                    $this.find('.order_tag').html('∧');
                    oldTrs.each(function () {
                        var $col = $(this).find('td').eq(index)
                        $col.removeClass(vars.ascClass)
                        $col.addClass(vars.descClass)
                    })
                } else if ($this.text().indexOf('∧') !== -1) {//原来倒序
                    $this.find('.order_tag').html('∨')
                    $this.attr('tip', tipTex['asc'])
                    sortType = asc;
                    oldTrs.each(function () {
                        var $col = $(this).find('td').eq(index)
                        $col.removeClass(vars.descClass)
                        $col.addClass(vars.ascClass)
                    })
                } else {//原来无序,改顺序
                    var brother = $this.parent().parent().find('th')
                    oldTrs.find('td').removeClass(vars.ascClass)
                    oldTrs.find('td').removeClass(vars.descClass)
                    if (vars.defaultOrder == 'asc') {//如果默认是顺序排序
                        oldTrs.each(function () {//调整表格颜色
                            $(this).find('td').eq(index).addClass(vars.ascClass)
                        })
                        brother.each(function () {//调整上下箭头和提示文字
                            $(this).find(vars.orderTag).html('')
                            $(this).find('a').attr('tip', tipTex['no-2-asc'])
                        })
                        $this.find('.order_tag').html('∨')
                        $this.attr('tip', tipTex['asc'])
                        sortType = asc;
                    } else {
                        oldTrs.each(function () {
                            $(this).find('td').eq(index).addClass(vars.descClass)
                        })
                        brother.each(function () {
                            $(this).find(vars.orderTag).html('')
                            $(this).find('a').attr('tip', tipTex['no-2-desc'])
                        })
                        $this.find('.order_tag').html('∧')
                        $this.attr('tip', tipTex['desc'])
                        sortType = desc;
                    }
                }
                $this.trigger('mouseover')//变更鼠标悬停显示提示的文字
                var len = oldTrs.length; //所有待排总数
                var dataArr = [];
                for (i = 0; i < len; i++) {//将原始序号和待排序的列放入dataArr数组
                    dataArr[i] = [parseInt(oldTrs.eq(i).find('td').eq(0).text()), oldTrs.eq(i).find('td').eq(index).text()];
                }

                function asc(a, b) {
                    if(isNaN(a[1])){//不是数字
                        var aDate=Date.parse(a[1].replace('-','/'))
                        var bDate=Date.parse(b[1].replace('-','/'))
                        if(!isNaN(aDate)){//判断NaN看是不是日期字符串。-转/为了兼容ie8
                            //是日期
                            return aDate-bDate;
                        }else{//是字符串
                            return a[1]>b[1]?1:-1
                        }
                    }else {
                        return a[1] - b[1];
                    }
                }

                function desc(a, b) {
                    if(isNaN(a[1])){//不是数字
                        var aDate=Date.parse(a[1].replace('-','/'))
                        var bDate=Date.parse(b[1].replace('-','/'))
                        if(!isNaN(aDate)){//判断NaN看是不是日期字符串。-转/为了兼容ie8
                            //是日期
                            return bDate-aDate;
                        }else{//是字符串
                            return b[1]>a[1]?1:-1
                        }
                    }else {
                        return b[1] - a[1];
                    }
                }

                dataArr.sort(sortType);
                //取得了排序数组,再对oldTrs文字数组进行排序
                var data_len = dataArr.length;
                var newTr = ''
                //组装回去
                for (i = 0; i < data_len; i++) {
                    oldTrs.eq(dataArr[i][0]).find('td').eq(0).html(i + 1)
                    newTr += '<tr>' + oldTrs.eq(dataArr[i][0]).html() + '</tr>'//根据dataArr排后的序号来顺序放入
                }
                $(_this).html(newTr)
                $(_this).prepend(headTr)
                oldTrs = null//清理大垃圾
                headTr = null
                newTr = null
            })
        })
    }
    /**
     * 设置点击某元素后触发导航栏点击，并可跳转到特定锚点
     * 使用:$(selector).pOpenTabUrl()
     *'speed':600,              //滚动速度，多少毫秒到达
     *'checkInterval':800,      //检测被打开页是否加载完的间隔
     *'offSet':200,             //偏移量，原始是把目标滚动到窗口最顶端，减掉200表示拉下来200px
     *'scrollToAnchcor':true    //是否滚动到目标。如果否就不跳
     *
     */
    $.fn.pOpenTabUrl = function (opts) {
        var vars = $.extend({
            'speed': 600, //滚动速度，多少毫秒到达
            'checkInterval': 800,        //检测被打开页是否加载完的间隔
            'offSet': 200,       //偏移量，原始是把目标滚动到窗口最顶端，减掉200表示拉下来200px
            'scrollToAnchcor': true  //是否滚动到目标。如果否就不跳
        }, opts);
        return this.each(function () {
            $(this).click(function (e) {
                var url = $(this).attr('openurl');
                //anchor标志跳转的
                if ($(this).attr('anchor')) {
                    var anchor = $(this).attr('anchor');
                }
                //触发导航栏点击，打开另一页
                $nav = $('.leftbar__link--level2[openurl="' + url + '"]', window.top.document)

                if ($nav.length !== 0) {
                    $nav[0].click();
                } else {
                    pClickLevel2(e)
                }
                if (!vars.scrollToAnchcor) {
                    return
                }
                //获取打开的页
                $frame = $('.content__frame[name="' + url + '"]', window.top.document);
                //获得锚点高度
                if ($(this).attr('anchor')) {
                    //检测目标高度（首次载入时可能会有显示延迟，做个定时器）
                    hasTop = window.setInterval(getTop, vars.checkInterval);

                    function getTop() {
                        //检测加载完毕
                        if ($frame.contents().find('a[name="' + anchor + '"]').length !== 0) {
                            target_top = $frame.contents().find('a[name="' + anchor + '"]').offset().top - vars.offSet;
                            $frame.contents().find('html,body').animate({scrollTop: target_top}, vars.spped);
                            clearInterval(hasTop)
                        }
                    }
                }
            })
        })
    }
    /*$(selector).pStyle()自动设置样式
    *@param string style     默认扁平
    *@param string height 整体高度
    * @param string width 宽度
    * @param string padding 扁平模式下指透明框大小
    * @param string border 内容框的边框宽度  如设置了content边框要在里面写明
    * @param string backgroundColor:透明框颜色
    * todo ie11的宽高获取，ie11 pading和border的获取完善.在ie8解释引擎下没事。没有设置width和height时的获取
    *需要的html：
    *
     <div class="popdiv"><div class="popdiv__back"></div><div class="popdiv--"><div class="popdiv__head"><p class="popdiv__title">提示信息</p><div class="popdiv__close">X</div></div><div class="popdiv__body"></div></div></div>

     * 需要的css：
     * .popdiv__wrapper{
     padding:0px;
     border-width: 2px;
     border: 2px solid #000; background-color: #EDEDED;font-size: 14px;
     position: relative;
     width:200px;height:100px;
     }
     .popdiv__head{
     color: #1F1F1F;font-size:15px;font-weight: bold;
     height:30px;line-height: 30px;background-color: #69E7ED;cursor:move;border-bottom:#59C5CA solid 1px ;
     }
     .popdiv__title{margin-left: 10px;float:left;line-height: 15px;margin-top: 5px}
     .popdiv__close {
     color: #fff;
     float: right;
     margin-right: 5px;
     width: 40px;
     height: 20px;
     line-height: 20px;
     background-color: #3f9cff;
     text-align: center;
     font-size: 12px;
     cursor: pointer
     }
     .popdiv__body{padding:15px;overflow:auto;}
    * */
    $.fn.pStyle = function (opts) {
        //if(typeof console === "undefined") { var console = { log: function (logMsg) { } };}
        var vars = $.extend({
            "style": "flat",
            height: null,
            width: null,
            padding: "10px",
            border: "2px",
            opacity: 0.4,
            "backgroundColor": "#000"
        }, opts);
        //根据传入的参数设置css
        var setCss = function ($ele, attr) {
            vars[attr] != null ? $ele.css(attr, vars[attr]) : 0;
        };
        //设置扁平 style
        var flatStyle = function ($handler) {
            $back = $(".popdiv__back", $handler);
            $content = $(".popdiv__wrapper", $handler);
            //alert($content.css("width")+","+$content.css("height"));
            setCss($handler, "width");
            setCss($handler, "height");
            //设置透明边宽度
            setCss($back, "opacity");
            setCss($handler, "padding");
            $back.css({
                "width": $handler.css("width"),
                "height": $handler.css("height"),
                "position": "absolute",
                "left": 0,
                "top": 0,
                "z-index": -10,
                "background-color": vars.backgroundColor
            })
            //为了兼容垃圾ie不得不舍弃获取
            var shrink = 2 * (parseInt(vars.padding) + parseInt(vars.border));
            //var shrink=2*($handler.YgetCoord("padding")+$content.YgetCoord("border-width")+$content.YgetCoord("padding"))
            //alert($handler.css("padding")+","+$content.css("border-width")+","+$content.css("padding")+","+$handler.css("width")+","+shrink);
            $content.css({
                "width": ($handler.pGetCoord("width") - shrink) + "px"
                , "height": ($handler.pGetCoord("height") - shrink) + "px"
            });
            //alert($content.css("width")+","+$content.css("height"));

        };

        return this.each(function () {
            switch (vars.style) {
                case"flat":
                    flatStyle($(this));
                    break;
                default:
                    flatStyle($(this));
            }
        })
    };
    /*$(selector).pMoving() 可移动插件
    *@param obj opts 接受参数对象，里面包含：
    *@param handler 接受选择器或jquery对象。默认为自己的jquery对象包装
    *@param JSON appearance 点击后变成的外观
    *@param Function fx 动态效果函数
    *@param Function overEvent  结束后执行函数
    *@param JSON oldCss 原外观
    *@param desktopMode Boolean 桌面窗口模拟，true的话会点击置顶
    */
    $.fn.pMoving = function (opts) {
        //if(typeof console === "undefined") { var console = { log: function (logMsg) { } };}
        var vars = $.extend({
            handler: null,
            appearance: {"opacity": 0.7},
            fx: null,
            overEvent: function () {
            },
            oldCss: {},
            desktopMode: true
        }, opts);
        return this.each(function () {

            //判断handler,为空则是自己，非空为选择器或jquery对象
            var handler;
            //maxIndex为当前窗口最大index
            window.maxIndex = window.maxIndex ? window.maxIndex : 1000;
            if (typeof vars.handler == 'undefined' || vars.handler == null || vars.handler == "") {
                handler = $(this)
            }
            else {
                typeof vars.handler == 'string' ? handler = $(vars.handler, this) : handler = vars.handler;
            }
            //获取原有样式
            // console.log("原始index:" +$(this).css("z-report"));
            for (var key in vars.appearance) {
                vars.oldCss[key] = $(this).css(key);
            }

            // console.log( vars.oldCss);
            // console.log(vars.appearance);
            //被移动的对象
            var whole = this;
            //为了兼容2b的ie6变完全透明加上这句话
            $(whole).children(":not(.popdiv__back)").css("opacity", 1)
            var relativeX, relativeY;
            handler.bind("mousedown", function (event) {

                vars.desktopMode ? window.maxIndex++ : 0;
                $(whole).css(vars.appearance);
                vars.desktopMode ? $(whole).css("z-index", window.maxIndex) : 0;
                relativeX = event.pageX - parseInt($(whole).css("left"));
                relativeY = event.pageY - parseInt($(whole).css("top"));
                // console.log("可执行设置坐标"+relativeX+","+relativeY)
                //alert("可执行设置坐标"+relativeX+","+relativeY)
                $(document).bind("mousemove", function (event) {
                    $(whole).css("top", event.pageY - relativeY);
                    $(whole).css("left", event.pageX - relativeX);

                    // console.log("可执行设置坐标" +$(whole).css("top"));
                })
            });

            $(document).bind("mouseup", function (event) {
                vars.overEvent();
                $(document).unbind("mousemove");
                $(whole).css(vars.oldCss);
                //console.log($(whole).attr("id")+"回复后的index:" +$(whole).css("z-report"))

            })
        })

    };
    /*$(selector).pPop()      弹出层插件
    *@param poper 触发者接受选择器或jquery对象。空则无条件弹出
    *@param closer 关闭者,空为弹窗中的.popdiv__close
    *@param function.js fx 动态效果函数
    *@param Boolean needMask 是否有遮罩层
    *@param string  maskId 如果设置mask就要设置id和needMask
    *@param string  eventType 触发的事件
    *@param Boolean autoScroll 滚动时弹窗是否也自动滚动
    *@param Boolean autoClose 是否自动关闭 todo未实现
    *@param int divWidth 设定popdiv宽
    *@param int divHeight 设定popdiv高

    */
    $.fn.pPop = function (opts) {
        //if(typeof console === "undefined") { var console = { log: function (logMsg) { } };}
        var vars = $.extend({
            "poper": null,
            "closer": null,
            "fx": null,
            // 如果设置mask就要设置id和needMask
            needMask: true,
            maskId: "overlay",
            "popInEvent": function () {
            },
            "popOutEvent": function () {
            },
            eventType: "click",
            autoScroll: true,
            autoClose: false,
            offSet: {"x": 0, "y": 0},
            toBeTop: true

        }, opts);
        if (window.top == window.self || !vars.toBeTop) {
            windowT = window
            var $document = $(document)
            var $body = $(document.body)
        } else {
            windowT = window.top
            var $document = $(windowT.document)
            var $body = $.pIsIE6() ? $('html,window.top.document.body') : $(windowT.document.body)

        }
        var popIn = function (event) {
            vars.popInEvent();
            //判断是触发式弹出还是无条件弹出
            var $popdiv = event.data.$popdiv || event;
            //设置最大索引值。最大索引值在桌面模式下有用
            windowT.maxIndex = windowT.maxIndex ? ++windowT.maxIndex : 1000;
            vars.needMask == true ? vars.maskIndex = windowT.maxIndex : 0;
            //console.log("当前maxindex:"+window.maxIndex+"弹出层"+$popdiv.attr("id")+"的index"+window.maxIndex+"遮罩层"+vars.maskId+"的index"+vars.maskIndex)
            //vars.divHeight==null?$popdiv.css("height",vars.divHeight):0;
            $popdiv.css({
                "display": "block",
                "left": ($(windowT).width() - $popdiv.width()) / 2 + $(windowT).scrollLeft() + vars.offSet.x + "px",
                "top": ($(windowT).height() - $popdiv.height()) / 2 + $(windowT).scrollTop() + vars.offSet.y + "px",
                "z-index": ++windowT.maxIndex
            });

            //iframe为了遮罩ie6 select.第二个div是为了拖拽时候防止过快时移动到iframe上停止
            if (vars.needMask) {
                //为了防止多次弹出时避免遮罩层出现bug，必须设定index，id
                $('<div id="' + vars.maskId + '" style="background-color:#000000;height:' + $document.height() + 'px;width:' + $document.width() + 'px;left:0px;right:0px;position:absolute;z-index:' + vars.maskIndex + '"></div>').prependTo($body).css({"opacity": "0.2"}).append('<iframe frameborder="0" border="0" style="width:100%;height:100%;position:absolute;left:0;top:0;filter:Alpha(opacity=0);"></iframe>').append('<div style="height:100%;width:100%;position:absolute;left:0;right:0"></div>');
            } //绑定特定函数，便于解绑.当要自适应时 TODO IE6 不响应
            $(windowT).bind("scroll", {"$popdiv": $popdiv}, addjust);
            $(windowT).bind("resize", {"$popdiv": $popdiv}, addjust);
        };
        var addjust = function (event) {
            var $popdiv = event.data.$popdiv;
            var $mask = $("#" + vars.maskId, windowT.document)
            //判断事件类型，如果是resize要改变遮罩层的大小
            if (event.type == "resize") {
                $mask.css({"width": $(windowT).width() + "px", "height": $document.height() + "px"})
            }
            //是否自动滚动
            vars.autoScroll == true ? $popdiv.css({
                "left": ($(windowT).width() - $popdiv.width()) / 2 + $(windowT).scrollLeft() + vars.offSet.x + "px",
                "top": ($(windowT).height() - $popdiv.height()) / 2 + $(windowT).scrollTop() + vars.offSet.y + "px"

            }) : 0
        };
        var popOut = function (event) {
            // console.log(event)
            var $popdiv = event.data.$popdiv;
            var $mask = $("#" + vars.maskId, windowT.document)
            vars.popOutEvent();
            $popdiv.css("display", "none");
            $mask.remove()
            $(windowT).unbind("scroll", addjust)
            $(windowT).unbind("resize", addjust)
        };
        return this.each(function () {
            var poper, closer, reason;
            //设定呼出者和关闭者
            var $popdiv = $(this);
            if (typeof vars.poper == 'undefined' || vars.poper == null || vars.poper == "") {
                reason = "no"
            }
            else {
                typeof vars.poper == "string" ? poper = $(vars.poper) : poper = vars.poper;
            }
            //判断是否无条件弹出
            if (reason == "no") {
                popIn($popdiv);
            } else {//弹出者某事件后执行popIn
                poper.bind(vars.eventType, {"$popdiv": $popdiv}, popIn);
            }
            //alert(typeof vars.closer)
            if (typeof vars.closer == 'undefined' || vars.closer == null || vars.closer == "") {
                closer = $(".popdiv__close", $popdiv)
            }
            else {
                typeof vars.closer == "string" ? closer = $(vars.closer) : closer = vars.closer;
            }

            closer.on(vars.eventType, {"$popdiv": $popdiv}, popOut);

        })
    }
    /**
     * 让pop弹出层显示消息,
     * @param msg
     * @param inFrame 是否在框架内页面弹出,默认不在
     * @returns {*}
     */
    $.fn.pPopMsg = function (msg, inFrame) {
        return this.each(function () {
            $(this).pPop({toBeTop: !inFrame})
            $(this).find('.popdiv__content').html(msg)
        })

    }
    /**
     * 让pop弹出层显示消息,在框架内
     * @param msg
     */
    $.fn.pPopMsgOnFrame = function (msg) {
        return this.each(function () {
            $(this).pPop({toBeTop: false})
            $(this).find('.popdiv__content').html(msg)
        })

    }
    /** todo 添加到ceem中
     * 自动生成form表单并绑定点击事件
     * @param url 表单提交地址
     * @param hidden 隐藏数据{'控件name名':'控件value值'}
     * @param type  提交方式，默认post
     * @param validate 检验函数，rules规则
     * @param input 表单中的输入控件名列表对象单个格式: {'name':'控件name名','type':'text','cn':'中文名称','value':'表单值','html':'特殊表单传递html值'}
     '@param  submit  提交按钮 默认:{'name':'pForm__submit','cn':'确定'}
     '@param  callback 提交后函数
     */
    $.pForm = function (opts) {
        var vars = $.extend({
            'poper': '.notice-pop',
            'msg': '',
            'url': null,
            'hidden': null,
            'type': 'post',
            'input': null,
            'submit': {'cn': '确定'},
            'validate': null,
            'inframe': true,
            'overCall': function () {
            }
        }, opts)
        if (vars.url === null) {
            alert('pForm:提交地址不能为空')
            return false
        }

        html = '<form method="' + vars.type + '" action="' + vars.url + '">';
        html += '<p class="form__p">' + vars.msg + '</p>';
        for (var h = 0; h < vars.hidden.length; h++) {//添加隐藏控件
            html += '<input type="hidden" class="' + vars.hidden[h].name + '" value="' + vars.hidden[h].value + '" name="' + vars.hidden[h].name + '">'
        }
        for (var v = 0; v < vars.input.length; v++) {//遍历每一个输入控件
            var i = vars.input[v]
            istr = ''
            i.type = i.type || 'text';  //如果没定义默认是text
            i.value = i.value || '';    //如果没定义默认是''
            istr += '<div class="form__row">' +
                '<label class="form__label">' + i.cn + '</label>' +
                '<div class="input-container__div">';
            if (i.type == 'area') {//如果是textarea
                istr += '<textarea class="form-control form__textarea ' + i.name + '" name="' + i.name + '" >' + i.value + '</textarea>'
            } else if (i.type == 'select') {//如果是select控件
                if (i.html == undefined) {
                    alert('pForm:select控件' + i.name + '的html没有赋值!')
                    return false
                }
                istr = '<div class="beautify-select__div">' +
                    '<select name="' + i.name + '" class="form-control beautify-select__select ' + i.name + '">' + i.html + '</select>' +
                    '</div>'
            }
            else {
                //非select 和area列表
                istr += '<input type="' + i.type + '" class="form-control form__input--text ' + i.name + '" name="' + i.name + '" value="' + i.value + '" />'
            }
            istr += '</div></div>';//单个控件完毕
            html += istr;
        }//for
        //提交按钮的固件
        vars.submit.name = vars.submit.name || ''
        html += '<div class="form__row"><a class="button button--orange pForm__submit ' + vars.submit.name + '" href="javascript://">' + vars.submit.cn + '</a></div>' +
            '</form>'

        var $pForm = $(html);
        if (vars.validate) {//验证表单
            $pForm.validate(vars.validate)
        }
        //alert(html)
        $pForm.on('click', '.pForm__submit', function () {
            if (vars.validate && !$pForm.valid()) {
                alert('有必填项没填，请检查！')
                return false;
            }
            $pForm.ajaxSubmit(function (text) {
                vars.overCall(text)
            })
        })
        $(vars.poper).pPop({toBeTop: !vars.inframe});
        $('.popdiv__content', vars.poper).html('').append($pForm);
    }
    /**
     * 折叠子菜单
     * @param $parent_li 菜单li元素
     * @param direction     方向
     */
    $.pSidebarToggle = function ($parent_li, direction) {
        if ($parent_li.has('ul').length > 0) {
            $ul = $($parent_li).find('ul:first');
            $arrow = $($parent_li).find('.leftbar__arrow');
            if (direction == 'up') {
                $arrow.html('&lsaquo;');
                $ul.hide(500);
            } else {
                $ul.show(500);
                $arrow.html('v');
            }
        }
    }
    /**
     * 读取xml生成返回jquery对象
     * @param opts 读取路径JSON
     * @returns {*} xmlJquery对象
     * @constructor
     */
    $.pLoadXml = function (opts) {
        var vars = $.extend({
            url: "test.xml",
            data: {},
            type: "get",
            //一般来说必须要同步，因为异步取回为空，异步时需要success回调里利用data
            async: false,
            success: function () {
            },
            error: function () {
            }
        }, opts);
        //ajax方式读取xml
        var xml;
        //兼容ie6无法读取xml,使用text
        var type = "text";
        try {
            new ActiveXObject("Microsoft.XMLDOM")
        }
        catch (e) {
            type = "xml"
        }
        $.ajax({
            type: vars.type,
            url: vars.url,
            dataType: type,
            data: vars.data,
            async: vars.async,
            success: function (data, textStatus, jqXHR) {//读取成功

                if (typeof data == "string") {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = false;
                    xml.loadXML(data);
                } else {
                    xml = data;
                }
                vars.success(data, textStatus, jqXHR)
            },
            error: function (jqXHR, textStatus, errorThrown) {//读取失败时
                alert('pLoadXml:取回xml失败！请查看console!');
                console.log(jqXHR.status + ' * ' + jqXHR.statusText + ' * ' + jqXHR.responseText + jqXHR.status + ' * ' + jqXHR.statusText + ' * ' + jqXHR.responseText)

                vars.error(jqXHR, textStatus, errorThrown)
            }
        });
        return xml;
    };
    $.pTree = {
        /*todo 函数，用于不同数据源。返回一项node下的html
         *
         * */
        getLiHtml: function ($xmlNodeData) {
            var aString = '';
            for (key in attrArr) {
                aString += ' ' + attrArr[key] + '="' + $xmlNodeData.attr(attrArr[key]) + '"'
            }
            var pre = preString = "";
            var icon = "node";
            var alt = "点击修改节点";
            if ($(">CHANNEL", $this).length) {
                pre = "closed";
                preString = ' <img src="../page_img/none.gif" class="' + pre + '"/> ';
                icon = "nodes";
                alt = "点击获取子节点";
            }
            aString = preString + '<img src="../page_img/none.gif" class="' + icon + '"/><a title="' + alt + '" target="getter"  class="detail" href="admin_edit_channel_' + icon + '.php?id=' + $this.attr("number") + '" ' + aString + '>' + $this.attr("name") + '</a>';
            return '<li>' + aString + '</li>';
        },
        /*备用函数，用于改造成ajax数据源返回儿子们节点的html
         *todo         改造
        * */
        getSonsHtml: function ($context, type) {
            typeof type == 'undefined' ? type = "li" : 1;
            var html = '';
            $('>CHANNEL', $context).each(function () {
                switch (type) {
                    case"li":
                        html += this.getLiHtml($(this));
                }

            });
            return html;
        },
        /*返回整个子孙树
        *
        * */
        getTreeHtml: function ($context) {
            var allTree = this;
            var liString = '';
            $('>CHANNEL', $context).each(function () {
                $this = $(this);
                var aString = '';
                for (key in attrArr) {
                    aString += ' ' + attrArr[key] + '="' + $this.attr(attrArr[key]) + '"'
                }
                var pre = preString = "";
                var icon = "node";
                var alt = "点击修改节点";
                //有子节点的话
                if ($(">CHANNEL", $this).length) {
                    pre = "closed";
                    preString = ' <img src="../page_img/none.gif" class="' + pre + '"/> ';
                    icon = "nodes";
                    alt = "点击获取子节点";
                }
                var innerString = preString + '<img src="../page_img/none.gif" class="' + icon + '"/><a title="' + alt + '" target="getter"  class="detail" href="admin_edit_channel_' + icon + '.php?id=' + $this.attr("number") + '" ' + aString + '>' + $this.attr("name") + '</a>';
                liString += '<li>' + innerString + allTree.getTreeHtml($this) + '</li>';
            });
            //  alert(liString)
            return '<ul class="treeUl">' + liString + '</ul>'
        }

    };
})(jQuery);

