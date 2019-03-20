(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})
    (document, window);

$(document).ready(function () {
    var getstory_select = JSON.parse(localStorage.getItem('selected_arr')) == null ?[]:JSON.parse(localStorage.getItem('selected_arr'))
    var mySwiper
    var selected_arr = []
    var count_true = 0
    var attention = true //判断用户是否关注
    var status = true // 判断此用户是否绑定手机号
    var share_status = false // 判断是否已经分享
    var zhuanzeng = true //是否将流量转增
    var dianji  = ''
    var show_card_tip = {
        'gug': ['1、国家宝藏 ', '2、延禧宫', '3、御花园'], // 故宫
        'tam': ['1、人民英雄纪念碑', '2、升国旗', '3、毛主席'], // 天安门
        'beh': ['1、白塔', '2、九龙壁', '3、鸭子船'], // 北海
        'tit': ['1、祭天', '2、祈年殿', '3、三音石'], // 天坛
        'xis': ['1、红叶', '2、鬼见愁', '3、静翠湖'], // 香山
        'ydq': ['1、石狮子', '2、拱桥', '3、七七事变'], // 银锭桥
        'ymy': ['1、万园之园', '2、八国联军', '3、遗址保护'], // 圆明园
        'chc': ['1、世界闻名', '2、烽火台', '3、孟姜女'], // 长城
        'qhy': ['1、荷塘月色', '2、皇家园林', '3、水木清华']   // 清华园
    }
   
    

// 开始游戏
$('.start_game').on('click',function(){
    $('.page').addClass('hide');
    $('.main').show();
    $('.topic').show();
    mySwiper.init();//现在才初始化
})

$('.topic_list div').on('click',function(){
    $(this).css('pointer-events', 'none')
    $(this).siblings('div').css('pointer-events', 'none') // 选中一个后，其他不能点击
    var number = $(this).parent('.topic_list').attr('class').replace('topic_list list_', '')
    var animate_left = 0.2 + (number-1) * 0.64 + 'rem'
    // 点击答题时，将人换成动图
    $('.small_people').prop('src', './images/ti_jin_ren.gif')
    if (number < 10) {
        $('.small_people').animate({ left: animate_left }, 1500, function () {
            $('.small_people').prop('src', './images/ti_jin_ren.png')
        })
    }
    var right_val = $(this).siblings('input').val() // 获取题目的正确答案
    var item_val = $(this).children('span:eq(0)').text() // 获取当前选中的答案的内容
    // 判断当前选中的答案是否包含正确答案
    if (item_val.includes(right_val)) {
        $(this).css({ 'background': '#30b469', 'color': '#fff' });
        $(this).children('span:eq(1)').addClass('ti_right');
        // $(this).parent('.topic_list').siblings('.show_img').children('div').children('img').prop('src', `./images/ti_0${number}_02.png`)
        $(this).parent('.topic_list').siblings('.show_img').children('div').children('img').prop('src', "./images/ti_0"+number+"_02.png")
        setTimeout(function () {
            mySwiper.slideNext();
        }, 1500);
        selected_arr.push(true)
    } else {
        $(this).css({ 'background': '#ff5959', 'color': '#fff' })
        $(this).children('span:eq(1)').addClass('ti_wrong');
        setTimeout(function () {
            mySwiper.slideNext();
        }, 1500);
        selected_arr.push(false)
    }
    localStorage.setItem('selected_arr',JSON.stringify(selected_arr));
    var click_number = Number(number-1)
    $(".progress_bar li:eq("+click_number+"):not(:first-child)").html("<p><span></span><span class='jindut_color'></span></p>")
    $(".progress_bar li:eq(0):first-child").html("<p><span></span></p>")
    if (selected_arr.length == 9) {
        setTimeout(function(){
            true_number(selected_arr)
        },2000)
    }
})

 // 重新答题
 $('.again').on('click',function(){
    if (share_status == true) {
        localStorage.removeItem('selected_arr')
        // window.location.reload();
        window.location.href="index.html?time="+((new Date()).getTime());
        // window.location.href="./index.html"
        // window.location.href="#begin";
    } else {
        showCover();
        $('.share').show();

    }
})


// 显示遮罩
function showCover() {
    $('.cover').css('height', $(document).height());
    $('.cover').css('width', $(document).width());
    $('.cover').show();
    $('html,body').css('position','fixed');
}
// 点击分享遮罩层
    $('.share_hide').on('click', function () {
        hiddenCover()
        $('.share').hide();
        // 点击蒙版以后已分享 测试用
        share_status = true;
    })



        // 判断对的个数及显示的弹窗
        function true_number(arr) {
            $('.topic').css('display', 'none')
            $('.main_content').css('display', 'block')
            $('.main').prop('class', 'main main_bg')
            $.each(arr,function(index,item){
                if (item == true) {
                    count_true++
                    // new_count_true++
                    var img_index = index+1
                    $(".show_card li:eq("+index+")").addClass('show_display')
                    $(".show_card li:eq("+index+")").css('background',"url(images/cards_0"+img_index+".png) no-repeat")
                } else {
                    $(".show_card li:eq("+index+")").addClass('show_hide')
                }
            })
            // 展示弹窗中显示的几个地表
            $('.right_question span:eq(0)').text(count_true)
            $('.right_question span:eq(1)').text(count_true+"个")
            if (count_true < 6) {
            } else if (count_true < 9) {
                $('.receive_left').css({ 'background': 'url(images/btn_red.png) no-repeat', 'text-shadow': '2px 2px 1px #da1210' })
            } else {
                $('.receive_left').css({ 'background': 'url(images/btn_red.png) no-repeat', 'text-shadow': '2px 2px 1px #da1210' })
                $('.receive_right').css({ 'background': 'url(images/btn_red.png) no-repeat', 'text-shadow': '2px 2px 1px #da1210' })
            }
        }

        // 点击有图片的卡片
        $('.show_card li').on('click',function(){
            var index = $(this).index(); // 查找当前选中时第几个li
            var _this = $(this)
            if ($(this).hasClass('show_display')) {
                $(this).addClass("add_transform");
                setTimeout(function () {
                    showCover()
                    var card_detail = index+1
                    $('.pop_post img').prop('src', "images/postcard_0"+card_detail+".png")
                    $('.pop_post').show()
                    _this.removeClass("add_transform");
                }, 1000)
            } else {
                $('.pop_att ul').html('')
                switch (index) {
                    case 0:
                        $.each(show_card_tip['gug'],function(index,item){
                            $('.pop_att ul').append("<li>"+item+"</li>")
                        })
                        break;
                    case 1:
                        $.each(show_card_tip['tam'],function(index,item){
                            $('.pop_att ul').append("<li>"+item+"</li>")
                        })
                        break;
                    case 2:
                        $.each(show_card_tip['beh'],function(index,item){
                            $('.pop_att ul').append("<li>"+item+"</li>")
                        })
                        break;
                    case 3:
                        $.each(show_card_tip['chc'],function(index,item){
                            $('.pop_att ul').append("<li>"+item+"</li>")
                        })
                        break;
                    case 4:
                        $.each(show_card_tip['tit'],function(index,item){
                            $('.pop_att ul').append("<li>"+item+"</li>")
                        })
                        break;
                    case 5:
                        $.each(show_card_tip['xis'],function(index,item){
                            $('.pop_att ul').append("<li>"+item+"</li>")
                        })
                        break;
                    case 6:
                        $.each(show_card_tip['ydq'],function(index,item){
                            $('.pop_att ul').append("<li>"+item+"</li>")
                        })
                        break;
                    case 7:
                        $.each(show_card_tip['qhy'],function(index,item){
                            $('.pop_att ul').append("<li>"+item+"</li>")
                        })
                        break;
                    case 8:
                        $.each(show_card_tip['ymy'],function(index,item){
                            $('.pop_att ul').append("<li>"+item+"</li>")
                        })
                        break;
                }
                showCover();
                $('.pop_att').show()
            }
        })

        // 点击猜到了
        $(".guessed").on('click',function(){
            $('.pop_att').hide()
            hiddenCover()
        })
        
        // 绑定手机号，点击提交
        $('.submit_form').on('click',function(){
            $('.bind').hide() // 绑定手机号隐藏
            $('.main_content').show()
            // 请求后台，返回绑定状态，修改status
            status = true
        })

        // 点击本网确定
        $('.pop_benw .close').on('click',function(){
            hiddenCover()
            $('.pop_benw').hide()
        })

        // 发送好友
        $('.libao .close').on('click',function(){
            $('.libao').hide()
            $('.share').show()
        })

        //  异网弹窗1点击取消
        $('.pop_yio div:eq(1) span:eq(0)').on('click',function(){
            $('.pop_yio').hide()
            hiddenCover()
            zhuanzeng = false;
        })

        // 点击转增
        $('.pop_yio div:eq(1) span:eq(1)').on('click',function(){
            $('.pop_yio').hide()
            $('.pop_yit').show()
        })

        // 点击异网2
        $('.pop_yit .close').on('click',function(){
            if(istel($('#inputTel').val())){
                $('.pop_yit').hide()
                $('.pop_yith').show()
            }else{
                alert("请输入正确的北京移动号码")
            }
        })

        // 点击异网弹窗3更改
        $(".pop_yith div:eq(1) span:eq(0)").on('click',function(){
            $('.pop_yith').hide()
            $('.pop_yit').show()
        })

        // 点击异网弹窗3确定
        $('.pop_yith div:eq(1) span:eq(1)').on('click',function(){
            $('.pop_yith').hide()
            $('.pop_yif').show()
            if(dianji == 'zuo'){
               $('.receive_left').text('点击查看')
            }else{
                $('.receive_right').text('点击查看')
            }
        })

        $('.pop_yif .close').on('click',function(){
            $('.pop_yif').hide()
            hiddenCover()
        })
        
        
        
        // 清缓存
        $('.qing').on('click',function(){
            localStorage.removeItem('selected_arr')
            window.location.reload()
        })

        // 点击活动规则
        $('.rule').on('click',function(){
            showCover()
            $('.pop_rule').show();
        })
        
        // 点击规则关闭按钮
        $('.ru_close').on('click',function(){
            $('.pop_rule').hide();
            hiddenCover()
        })

        // 立即关注
        $('.ljgz').on('click',function(){
            attention = false
            $(this).attr('disabled',true).text('未关注')
        })
        
        // 绑定手机号
        $('.jb_mobile').on('click',function(){
            status = false
            $(this).attr('disabled',true).text('未绑定')
        })
        
        // 立即分享
        // $('.li_share').on('click',function(){
        //     share_status = false
        //     $(this).attr('disabled',true).text('未分享')
        // })

        $('.post_cards').on('click',function(){
            hiddenCover()
            $('.pop_post').hide()
        })
        
       
        // 点左边按钮
        $('.receive_left').on('click',function(){
            var show_text = $(this).text()
            dianji = 'zuo'
            if (show_text.includes('领取')) {
                if (count_true < 6) {
                    // alert('小于6')
                    $('.timu_number').text('6道及6道以上')
                    showCover();
                    $('.libao').show();
                } else {
                    //已经关注
                    if (attention) {
                        if (status) {
                            var select_val = $('.select_wang').val()// 获取本网还是异网
                            if( select_val == 0){
                                $('.x_unclaimed').css('background', 'url(images/lhx_02.png) no-repeat')
                                $(this).text('点击查看')
                                showCover();
                                $('.pop_benw').show();
                            }else{
                                showCover();
                                $('.x_unclaimed').css('background', 'url(images/lhx_02.png) no-repeat')
                                $('.pop_yio').show()
                                // if(zhuanzeng){
                                //     $('.pop_yio').show()
                                // }
                                
                            }
                        } else {
                            $('.main_content').hide()
                            $('.bind').show() // 绑定手机号展示
                        }
                    } else {
                        // 未关注
                        // showCover()
                        // $('.pop_attention').show()
                        window.location.href = "https://mp.weixin.qq.com/s/L5sqfIUePU0ZWzL_eVwr_A";
                    }
                }
            } else {
                var select_val = $('.select_wang').val() // 获取本网还是异网
                showCover()
                select_val == 0 ? $('.pop_benw').show() : $('.pop_yif').show()
            }
        })

        // 点右边按钮
        $('.receive_right').on('click',function(){
            var show_text = $(this).text()
            dianji = 'you'
            if (show_text.includes('领取')) {
                if (count_true < 6) {
                    $('.timu_number').text('9道')
                    showCover();
                    $('.libao').show();
                } else if (count_true < 9) {
                    $('.timu_number').text('9道')
                    showCover();
                    $('.libao').show();
                } else {
                    //已经关注
                    if (attention) {
                        if (status == "false") {
                            $('.main_content').hide()
                            $('.bind').show() // 绑定手机号展示
                        } else {
                            var select_val = $('.select_wang').val()// 获取本网还是异网
                            if( select_val == 0){
                                $('.d_unclaimed').css('background', 'url(images/lhd_02.png) no-repeat')
                                showCover();
                                $(this).text('点击查看')
                                $('.pop_benw').show();
                            }else{
                                showCover();
                                $('.d_unclaimed').css('background', 'url(images/lhd_02.png) no-repeat')
                                $('.pop_yio').show()
                            }
                            // $('.d_unclaimed').css('background', 'url(images/lhd_02.png) no-repeat')
                            // $(this).text('点击查看')
                            // showCover();
                            // let select_val = $('.select_wang').val() // 获取本网还是异网
                            // select_val == 0 ? $('.pop_benw').show() : $('.pop_yio').show()
                        }
                    } else {
                        // 未关注
                        showCover()
                        $('.pop_attention').show()
                    }
                }
            } else {
                var select_val = $('.select_wang').val() // 获取本网还是异网
                showCover()
                select_val == 0 ? $('.pop_benw').show() : $('.pop_yif').show()
            }
        })

        // 隐藏遮罩
        function hiddenCover() {
            $('.cover').hide();
            $('html,body').css('position', 'unset');
        }
        if (getstory_select.length == 9) {
            $('.page').addClass('hide') // 首页隐藏
            $('.main').addClass('main_bg').show()
            selected_arr = getstory_select // 将本地存储的数组赋值给全局变量
            true_number(selected_arr) // 调用选项卡页面展示函数
        } else {
            // 创建swiper容器
            mySwiper= new Swiper('.swiper-container', {
                init: false,
                direction: 'horizontal',
                noSwiping: true,

            })
        }
     //移动手机号码验证
    function istel(tel) {
        var rtn = false;
        //移动号段验证
        var regtel = /^((13[4-9])|(15([0-2]|[7-9]))|(18[2|3|4|7|8])|(178)|(147))[\d]{8}$/;
        if (regtel.test(tel)) {
            rtn = true;
        }
        return rtn;
    }
});
        
