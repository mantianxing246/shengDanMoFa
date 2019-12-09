const camera = document.getElementById("camera")
const add = document.getElementById("add")
const btn = document.getElementById("btn")
const loading = $(".loading")
const isMobile = isIphone()
const sex = $(".select-sex>div")
const kuang = $(".kuang")
const video = document.getElementById("video")
const dialog = $(".dialog")
var sexStr = 0
var img = ""
var orientationImg = ""
add.onclick = function () {
    if (isMobile) {
        phone()
        camera.click()
    } else {
        dialog.show()
        mediaDevicesPhone()
    }
}
btn.onclick = function () {
    if (!sexStr) {
        alert("请选择性别")
        return
    }
    loading.addClass("loadEffect")
    zg($(".zg"))
    if (!img) {
        loading.addClass("loadEffect")
        return
    }
    sessionStorage.setItem("files", JSON.stringify({
        sex: sexStr,
        img: ""
    }))
    ajax(img, function (res) {
        if (res.data) {
            loading.removeClass("loadEffect")
            sessionStorage.setItem("faceToken", res.data)
            location.href = "./selectRole.html"
        } else {
            loading.addClass("loadEffect")
        }
    }, function () {
       alert("图片不合格，请重新拍摄")
    })
}
//性别选择
sex.click(function (e) {
    $(this).siblings().find(".template").attr({
        id: ""
    })
    $(this).find(".template").attr({
        id: "active"
    })
    sexStr = $(this).attr("sex")
    if (sexStr == 1) {
        $(this).find(".template").attr({
            style: "box-shadow: 0px 0px 40px #00a6ff;"
        })
    } else {
        $(this).find(".template").attr({
            style: "box-shadow: 0px 0px 40px #c82960;"
        })
    }
    e.preventDefault()
})

//使用手机自带的相机拍照
function phone() {
    camera.onchange = function (e) {
        var files = e.target.files || e.dataTransfer.files;
        var reader = new FileReader();
        reader.onload = function () {
            if (this.result) {
                loading.removeClass("loadEffect")
                img = this.result
                $("#imgSrc").attr({
                    src: this.result
                })
                imgRotate(files[0], $("#imgSrc"))
            }
        }
        reader.readAsDataURL(files[0]);
    }
}
//电脑使用摄像头拍照
function mediaDevicesPhone() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia({
                audio: true,
                video: {
                    width: 300,
                    height: 200
                }
            },
            function (stream) {
                var video = document.querySelector('video')
                try {
                    video.src = window.URL.createObjectURL(stream)
                } catch (e) {
                    video.srcObject = stream
                }
                video.play()
            },
            function (err) {
                console.log(err)
            }
        )
    }
    $(".pz").click(function () {
        var canvas = document.getElementById("canvas")
        var context = canvas.getContext("2d")
        context.drawImage(video, 0, 0, 300, 150)
        const imgSrc = canvas.toDataURL("image/png")
        img = imgSrc
        $("#imgSrc").attr({
            src: imgSrc
        })
        dialog.hide()
    })
}

//判断是否脸部在框里
function ajax(base64, success, fail) {
    $.ajax({
        type: "POST",
        url: URL + "/christmas/api/christmas/faceDetect1",
        // url: "http://192.168.5.25:8080/api/christmas/faceDetect1",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify({
            "img":base64Return(base64)
        }),
        success: function (res) {
            if (!res.code) {
                fail()
            } else {
                success(res)
            }
        },
        fail: function () {
            fail()
        }
    })
}


function imgRotate(file, ele) {
    EXIF.getData(file, function () {
        EXIF.getAllTags(this);
        Orientation = EXIF.getTag(this, 'Orientation');
        if (!isIos()) {
            if (Orientation == 6) {
                //原图逆时针转了90, 所以要顺时针旋转90
                orientationImg =
                    "transform:rotate(-90deg) translate(-28px,-28px);width:642px;height:586px;"
                ele.attr({
                    style: orientationImg
                })
            }
            if (Orientation == 3) {
                //原图逆时针转了180, 所以顺时针旋转180
                orientationImg = "transform: rotate(180deg);"
                ele.attr({
                    style: orientationImg
                })
            }
            if (Orientation == 8) {
                //原图顺时针旋转了90, 所以要你时针旋转90
                orientationImg =
                    " transform:rotate(-90deg) translate(-28px,-28px);width:642px;height:586px;"
                ele.attr({
                    style: orientationImg
                })
            }
        }
    })
}

function base64Return(dataurl){
    return dataurl.split(',')[1]
}

// function dataURLtoFile(dataurl, filename) { //将base64转换为文件  
//     var arr = dataurl.split(','),
//         mime = arr[0].match(/:(.*?);/)[1],
//         bstr = atob(arr[1]),
//         n = bstr.length,
//         u8arr = new Uint8Array(n);
//     while (n--) {
//         u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new File([u8arr], filename, {
//         type: mime
//     });
// }

pageHeight()
stopPageSwiper()
setSelectHeight()