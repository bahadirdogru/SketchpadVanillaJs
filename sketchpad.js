
    // Windows screen object.   
    var win;
    // Canvas onject
    var canvas = null;
    var ctx = null;
    var erase_drawing = false;
    var stop = false;
    //Aktif Renk
    var color = "#FF0000";
    // Aktif Kalınlık
    var thickness = 7;
    //Renkler:
    var red = "#FF0000";
    var darkred = '#E61B1B';
    var yellow = '#FFE600';
    var yellowhighlight = '#ebe40036';
    var green = '#26E600';
    var black = '#000000';
    var orange = '#FF5500';
    var blue = '#0000FF';
    // avaible height and width
    var height = 0;
    var width = 0;

    var flag = false;
    var prevX = 0;
    var currX = 0;
    var prevY = 0;
    var currY = 0;
    var prevtouchX = 0;
    var prevtouchY = 0;
    var touchX = 0;
    var touchY = 0;

    function vindow() {
        console.log("vindow()");
        // vanilla JS window width and height
        // https://gist.github.com/joshcarr/2f861bd37c3d0df40b30
        var w = window;
        var d = document;
        var e = d.documentElement;
        var g = d.getElementsByTagName('body')[0];
        var x = w.innerWidth || e.clientWidth || g.clientWidth;
        var y = w.innerHeight || e.clientHeight || g.clientHeight;
        win = {
            "document": d,
            "documentElement": e,
            "body": g,
            "width": x,
            "height": y
        };
    }

    function setVindow() {
        console.log("setVindow()");
        vindow();
        height = win.height;
        width = win.width;
        if (height > 32767) {
            //https://stackoverflow.com/a/11585939/3878620
            alert("Unfortunately due to chrome browser limits,  chrome does not support pages with a height greater than 32,767 pixels.");
        }
    }

    function getTouchPos(e) {
        console.log("getTouchPos()");
        if (!e)
            e = event;
        if (e.touches) {
            if (e.touches.length == 1) {
                prevtouchX = touchX;
                prevtouchY = touchY;
                var touch = e.touches[0];
                touchX = touch.pageX - touch.target.offsetLeft;
                touchY = touch.pageY - touch.target.offsetTop;
            }
        }
    }

    function createCanvas() {
        console.log("createCanvas()");

        setVindow();
        if (canvas == null) {
        canvas = document.createElement("canvas");
        canvas.id = "kanvas";

        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        document.body.appendChild(canvas);
        }
        addEventListeners();
    }

    function addEventListeners(){
        console.log("addEventListeners()");

        canvas.addEventListener("mousemove", function (e) {
            findxy('move', e);
        }, false);
        canvas.addEventListener("mousedown", function (e) {
            findxy('down', e);
        }, false);
        canvas.addEventListener("mouseup", function (e) {
            findxy('up', e);
        }, false);
        canvas.addEventListener("mouseout", function (e) {
            findxy('out', e);
        }, false);
        canvas.addEventListener('touchstart', sketchpad_touchStart, false);
        canvas.addEventListener('touchmove', sketchpad_touchMove, false);
    
        document.addEventListener('keydown', keydown); 
    }
    
    function changeColor(newColor){
        color = newColor;
    }

    function draw() {
        console.log("draw()");

        ctx.beginPath();

        //ctx.globalAlpha = 0.5;
        if (erase_drawing) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = thickness * 3;
            ctx.strokeStyle = color;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currX, currY);
            ctx.closePath();
            ctx.stroke();
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.lineWidth = thickness;
            ctx.strokeStyle = color;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currX, currY);
            ctx.closePath();
            ctx.stroke();
        }
    }

    function drawTouch(x, y) {
        console.log("drawTouch()");

        ctx.beginPath();
        //ctx.globalAlpha = 0.2;
        if (erase_drawing) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = thickness * 3;
            ctx.strokeStyle = color;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.moveTo(prevtouchX, prevtouchY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.lineWidth = thickness;
            ctx.strokeStyle = color;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.moveTo(prevtouchX, prevtouchY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }
    }

    function findxy(res, e) {
        console.log("findxy()");

        if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = e.pageX - canvas.offsetLeft;
            currY = e.pageY - canvas.offsetTop;

            ctx.beginPath();
            //ctx.globalAlpha = 0.2;
            if (!erase_drawing) {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = color;
                ctx.lineWidth = thickness;
                ctx.lineJoin = "round";
                ctx.lineCap = "round";
                ctx.moveTo(currX, currY - 0.001);
                ctx.lineTo(currX, currY);
            } else {
                ctx.globalCompositeOperation = "destination-out";
                ctx.strokeStyle = color;
                ctx.lineWidth = thickness * 3;
                ctx.lineJoin = "round";
                ctx.lineCap = "round";
                ctx.moveTo(currX, currY - 0.001);
                ctx.lineTo(currX, currY);
            }
            ctx.closePath();
            ctx.stroke();
            flag = true;
        }
        if (res == 'up' || res == "out") {
            flag = false;
        }
        if (res == 'move') {
            if (flag) {
                prevX = currX;
                prevY = currY;
                currX = e.pageX - canvas.offsetLeft;
                currY = e.pageY - canvas.offsetTop;
                draw();
            }
        }
    }

    function sketchpad_touchStart() {
        console.log("sketchpad_touchStart()");

        getTouchPos();
        prevtouchX = touchX;
        prevtouchY = touchY;
        drawTouch(touchX, touchY);
        event.preventDefault();
    }

    function sketchpad_touchMove(e) {
        console.log("sketchpad_touchMove()");

        getTouchPos();
        drawTouch(touchX, touchY);
        event.preventDefault();
    }

    function keydown(e) {
        console.log("keydown()");

        if (!this.stop) {
            console.log(`keykode: ${e.which}, type: ${e.type}, key:${e.key}`);
            switch (e.which) {
                case 8: // backspace
                    this.erase();
                    break;
                case 27: // escape
                    this.exit();
                    break;
            }
        }
    }

    function exit() {
        console.log("exit()");
        //document.getElementById('can').style.display = "none";
        //this.canvas.style.display = "none";
        removeDom(canvas);
        stop = true;
        canvas = null;
    }

    function removeDom(e) {
        console.log("removeDom()");
        console.log({e});

        if (e) {
          e.parentNode.removeChild(e);
        }
      }

    function cizim (){
        console.log("cizim()");
        erase();
        erase_drawing = false;
        //document.getElementById('can').style.display = "block";
        canvas.style.display = "block";
    }
    
    function eraser() {
        console.log("eraser()");

        erase_drawing = true;
    }
    
    function cizim_ac() {
        console.log("cizim_ac()");

        erase();
        //document.getElementById('can').style.display = "block";
        canvas.style.display = "block";
    }
    
    function erase() {
        console.log("erase()");

        ctx.clearRect(0, 0, canvas.width - 0.1, canvas.height - 0.1);
    }
    
    function pen() {
        console.log("pen()");

        erase_drawing = false;
    }
