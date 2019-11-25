
class Rect{
    constructor(pos){
        this.pos = pos;
        this.dimens = {w:0,h:0};
        this.properties = {
            strokeColor: "#ff0000",
            isFill: false,
            fillColor:"#000000",

        };

    }
    draw(){
        ctx.strokeStyle = this.properties.strokeColor;
        ctx.beginPath();
        ctx.rect(this.pos.x, this.pos.y, this.dimens.w, this.dimens.h);
        ctx.stroke();
        if (this.properties.isFill){
            ctx.fillStyle = this.properties.fillColor;
            ctx.fill();
        }

        ctx.closePath();
    }
}
class Circle{
    constructor(pos){
        this.pos = pos;
        this.radius = 0;

    }
    draw(){
		ctx.beginPath();
		ctx.arc(
			this.pos.x,
			this.pos.y,
			this.radius,
			0,
			Math.PI*2,
		);
        ctx.stroke();
        ctx.closePath();
    }
}


(function(){
    let canvas = document.getElementById('viewport');
    let holder = document.getElementById('canvas-holder');
    let objSelector = document.querySelectorAll('input[type=radio][name="object"]')
    ctx = canvas.getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight * .9;
    let mouseIsDown = false;
    let selectedItem = "Rect";
    let currObj = null;
    let objects = [];
    let selectedOffset = {x:0,y:0};


    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height); 
        objects.forEach(obj => {
            obj.draw();
        });
        requestAnimationFrame(draw);
    }
    draw();

    objSelector.forEach(radio => {
        radio.addEventListener('click',e =>{
            selectedItem = e.target.value;
        });
    });

    // find area of triangle
    function area(x1,y1,x2,y2,x3,y3){
        return Math.abs((x1 * (y2 - y3) + 
                    x2 * (y3 - y1) + 
                    x3 * (y1 - y2)) / 2);
    }

    function checkRect(x,y,obj){
            //total area of rect
            A = (area(obj.pos.x,obj.pos.y,(obj.pos.x + obj.dimens.w),obj.pos.y,(obj.pos.x + obj.dimens.w),(obj.pos.y + obj.dimens.h))+
                area(obj.pos.x,obj.pos.y,obj.pos.x,(obj.pos.y + obj.dimens.h),(obj.pos.x + obj.dimens.w),(obj.pos.y + obj.dimens.h)));
            //areas related to mouse click
            A1 = area(x,y,obj.pos.x,obj.pos.y,(obj.pos.x + obj.dimens.w),obj.pos.y);
            A4 = area(x,y,obj.pos.x,obj.pos.y,obj.pos.x,(obj.pos.y + obj.dimens.h));
            A2 = area(x,y,(obj.pos.x + obj.dimens.w),obj.pos.y,(obj.pos.x + obj.dimens.w),(obj.pos.y + obj.dimens.h));
            A3 = area(x,y,(obj.pos.x + obj.dimens.w),(obj.pos.y + obj.dimens.h),obj.pos.x,(obj.pos.y + obj.dimens.h));

            if (A === A1 + A2 + A3 + A4 && A != 0){
                return true;
            }else{
                return false;
            }
    }
    function checkCirc(x,y,obj){
        if (Math.sqrt((x-obj.pos.x)*(x-obj.pos.x) + (y-obj.pos.y)*(y-obj.pos.y)) < obj.radius){
            return true;
        }else{
            return false;
        }
    }



    function isMouseInsideObject(x,y){
        foundObj = null;
        objects.forEach(obj => {
            switch(obj.constructor.name){
                case "Rect":
                    if (checkRect(x,y,obj)){
                        foundObj = obj;
                        selectedOffset = {x:x-obj.pos.x,y:y-obj.pos.y};
                    }
                    break;
                case "Circle":
                    if (checkCirc(x,y,obj)){
                        foundObj = obj;
                        selectedOffset = {x:x-obj.pos.x,y:y-obj.pos.y};
                    }
                    break;
            }

        });
        return foundObj;
    }


    canvas.addEventListener("mousedown",e => {
        if (!mouseIsDown){
            
            mouseIsDown = true;
            switch(selectedItem){
                case "Select":
                    currObj = isMouseInsideObject(e.clientX,e.clientY);
                    break;
                case "Rect":
                    currObj = new Rect({x:e.clientX,y:e.clientY});
                    objects.push(currObj);
                    break;
                case "Circle":
                    currObj = new Circle({x:e.clientX,y:e.clientY});
                    objects.push(currObj);
                    break;
            }
            


        }
    });
    canvas.addEventListener("mousemove",e => {
        if (mouseIsDown){
            switch(selectedItem){
                case "Select":
                    currObj.pos = {x:e.clientX - selectedOffset.x,y:e.clientY - selectedOffset.y};
                    break;
                case "Rect":
                    currObj.dimens = {w:e.clientX - currObj.pos.x,h:e.clientY - currObj.pos.y};
                    break;
                case "Circle":
                    currObj.radius = Math.abs(e.clientX - currObj.pos.x);
                    break;
            }
        }
    });
    canvas.addEventListener("mouseup",e => {
        if (mouseIsDown){
            mouseIsDown = false;
        }
        
    });
})();