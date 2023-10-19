
let keyList = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 66, 65]
let DownKeyList: Array<number> = []
let time: any
document.addEventListener('keydown', function (e: { keyCode: number, ctrlKey: any ,preventDefault:any}) {
    if(e.ctrlKey && e.keyCode == 83) {
        e.preventDefault()
        return;
    }
    //Esc 关闭
    if(e.keyCode === 27 ) {
        return;
    }
    DownKeyList.push(e.keyCode)
    if(time != undefined) {
        clearInterval(time)
    }
    time = setInterval(() => {
        DownKeyList = []
    },10000)
    DownKeyList.forEach((item, index) => {
        if (item !== keyList[index]) {
            DownKeyList = []
        }
    })
    if(DownKeyList.length === keyList.length) {
        DownKeyList = []
        clearInterval(time)
    }

});

