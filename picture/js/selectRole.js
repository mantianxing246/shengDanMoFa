const files = JSON.parse(sessionStorage.getItem("files"))
const faceToken = sessionStorage.getItem("faceToken")
const generatingPhotos = $(".select-mode") //生成照片点击按钮
const name = $(".name") //姓名
const ImgSize = $(".Img-size") //二维码图片
const dialog = $(".dialog")
const dialog2 = $(".dialog2")
const loading = $(".loading")
const isMobile = isIphone()
var index = 0 //当前选中的是第几个模板
var touchSlider = null
var templateIdArr = [] //模板id
var nameStr = ""


//初始化页面需要做的
init()

function init() {
    getAllTemplate()
    // stopPageSwiper()//防止页面滑动
    //遮盖层
    generatingPhotos.click(function () {
        dialog.show()
        zg($(".zg"))
    })
    //姓名监听
    name.keydown(function (e) {
        if (e.keyCode == 13) {
            nameStr = $(this).val()
            if (!nameStr) {
                alert("请输入您的姓名")
                return
            }
            dialog.hide()
            $(this).val("")
            if (isMobile) {
                saveImage(function (res) {
                    location.href = "../html/share.html?uuid=" + res.data.uuid
                })
            } else {
                saveImage(function (res) {
                    const data = res.data
                    dialog2.show()
                    zg($(".zg"))
                    $(".ewm-kuang img").attr({
                        src: URL + "/" + data.qrCodeUrl
                    })
                })
            }
        }
    })
    name.click(function (e) {
        e.stopPropagation()
        e.preventDefault();
    })
    ImgSize.click(function (e) {
        e.stopPropagation()
        e.preventDefault();
    })
    dialog.click(function () {
        dialog.hide()
    })
    dialog2.click(function () {
        dialog2.hide()
    })
    stopScroll()
}
//合成图片
function faceMerge(templateId, index) {
    loading.addClass("loadEffect")
    $.ajax({
        url: URL + "/christmas/api/christmas/faceMerge",
        type: "POST",
        data: {
            faceToken: faceToken,
            sex: files.sex,
            templateId: templateId
        },
        success: function (res) {
            const data = res.data
            lastTime = new Date().getTime()
            $(".select").eq(index).find("img").attr({
                "src": URL + "/" + data[0]
            })
            if (templateId == 0) {
                templateIdArr.splice(0, 1)
            } else {
                templateIdArr.splice(templateIdArr.indexOf(templateId), 1)
            }
            loading.removeClass("loadEffect")
            console.log(res.data[0])
            // alert(JSON.stringify(res.data))
        },
        fail: function () {

        }
    })
}

//模板
function getAllTemplate() {
    $.ajax({
        url: URL + "/christmas/api/christmas/getAllTemplate",
        type: "GET",
        data: {
            sex: files.sex
        },
        success: function (res) {
            faceMerge(0, 0) //打开页面先合成图片
            const data = res.data
            var str = "",
                str2 = ""
            res.data.forEach(function (value, index) {
                templateIdArr.push(value.id)
                str += `<img src="../images/${files.sex==1?'template_man_':'template_woman_'}${index+1}.jpg" alt="" faceMergeId="${value.id}" index="${index}">`
                str2 += `<div id="slider">
                            <div class="select">
                                <div><img src="" alt="" id="img"></div>
                            </div>
                        </div>`
            })
            $(".select-sex").html(str)
            $("#slider").html(str2)
            setSelectHeight()
            pageHeight() //页面的高度
            slider() //滑动
            $(".select-sex>img").click(function () {
                index = parseInt($(this).attr("index"))
                touchSlider.slide(index)
            })
        },
        fail: function () {}
    })
}

//滑动
function slider() {
    touchSlider = new TouchSlider('slider', {
        speed: 1000,
        direction: 0,
        interval: 6000,
        fullsize: true,
        autoPlay: false
    })
    touchSlider.pause()
    touchSlider.on('before', function (m, n) {
        index = n
        var faceMergeId = parseInt($(".select-sex>img").eq(index).attr("faceMergeId")) //当三个模板请求都结束后，采用原来的，不请求
        if (templateIdArr.includes(faceMergeId)) { //如果数组里面存在id，才请求
            faceMerge(faceMergeId, index)
        }
    })
}

//生成二维码
function saveImage(success) {
    const imgUrl = "image" + $(".select").eq(index).find("img").attr("src").split("image")[1]
    $.ajax({
        url: URL + "/christmas/api/christmas/saveImage",
        type: "POST",
        data: {
            imgUrl: imgUrl,
            name: nameStr
        },
        success: function (res) {
            success(res)
        },
        fail: function () {}
    })
}

function stopScroll() {
    document.getElementById("dialog").addEventListener("touchmove", function (e) {
        e.stopPropagation();
        e.preventDefault();
    }, false);
    document.getElementById("dialog2").addEventListener("touchmove", function (e) {
        e.stopPropagation();
        e.preventDefault();
    }, false);
}