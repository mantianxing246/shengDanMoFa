const URL = "http://christmas.3tilabs.com"
const selectProportion=1.13

function isIphone() {
    var sUserAgent = navigator.userAgent;
    return sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('iPhone') > -1 || sUserAgent.indexOf('iPad') > -1 || sUserAgent.indexOf('iPod') > -1 || sUserAgent.indexOf('Symbian') > -1
}

function pageHeight() {
    const containerHeight = $(".container").height()
    const windowHeight = $(window).height()
    if (windowHeight > containerHeight) {
        $(".container").addClass("heightPage")
    }
}

// 判断安卓
function isIos() {
    var u = navigator.userAgent;
    if (u.indexOf("iPhone") > -1 || u.indexOf("iOS") > -1) {
        return true;
    }
    return false;
}


//遮盖层
function zg(el) {
    el.addClass("btn-zg")
    setTimeout(function () {
        el.removeClass("btn-zg")
    }, 2000)
}

//防止页面上下滑动
function stopPageSwiper() {
    document.addEventListener("touchmove", function (e) {
        e.preventDefault();
    }, false); //禁止页面滑动
}
//应为要在desk上显示，所以为了适配，图片的高度这样设置
function setSelectHeight(){
    $(".select").css({
        height:$(".select").width()*selectProportion+"px"
    })
}