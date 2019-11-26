
class Rect{
    constructor(pos){
        this.pos = pos;
        this.dimens = {w:0,h:0};
        this.properties = {
            strokeColor: "#000000",
            strokeSize: 1,
            isFill: false,
            fillColor:"#000000",
            isSelected:false,

        };

    }
    draw(){
        ctx.strokeStyle = this.properties.strokeColor;
        ctx.lineWidth = this.properties.strokeSize;
        ctx.beginPath();
        ctx.rect(this.pos.x, this.pos.y, this.dimens.w, this.dimens.h);
        
        if (this.properties.isFill){
            ctx.fillStyle = this.properties.fillColor;
            ctx.fill();
        }
        if(this.properties.isSelected){
            ctx.setLineDash([5])
        }else if(!this.properties.isSelected){
            ctx.setLineDash([])
        }
        ctx.stroke();
        ctx.closePath();
    }
    detectEdges(x,y){
        if (this.pos.x > x - 10 && this.pos.x < x + 10 && this.pos.y < y && this.dimens.h + this.pos.y > y){
            console.log("???")
            return "left"
        }
        if (this.dimens.w + this.pos.x > x - 10 && this.dimens.w + this.pos.x < x + 10&& this.pos.y < y && this.dimens.h + this.pos.y > y){
            return "right"
        }
        if (this.pos.y > y - 10 && this.pos.y < y + 10 && this.pos.x < x && this.dimens.w + this.pos.x > x){
            return "top"
        }
        if (this.dimens.h + this.pos.y > y - 10 && this.dimens.h + this.pos.y < y + 10 && this.pos.x < x && this.dimens.w + this.pos.x > x){
            return "bottom"
        }
    }
}
class Circle{
    constructor(pos){
        this.pos = pos;
        this.radius = 0;
        this.properties = {
            strokeColor: "#000000",
            strokeSize: 1,
            isFill: false,
            fillColor:"#000000",
            isSelected:false,

        };

    }
    draw(){
        ctx.strokeStyle = this.properties.strokeColor;
        ctx.lineWidth = this.properties.strokeSize;
		ctx.beginPath();
		ctx.arc(
			this.pos.x,
			this.pos.y,
			this.radius,
			0,
			Math.PI*2,
        );
        
        if (this.properties.isFill){
            ctx.fillStyle = this.properties.fillColor;
            ctx.fill();
        }
        if(this.properties.isSelected){
            ctx.setLineDash([5])
        }else if(!this.properties.isSelected){
            ctx.setLineDash([])
        }
        ctx.stroke();
        ctx.closePath();
    }
    detectEdges(x,y){
        let value = Math.sqrt((x-this.pos.x)*(x-this.pos.x) + (y-this.pos.y)*(y-this.pos.y));
        if (value > this.radius - 10 && value < this.radius + 10){
            return "circle"
        }
    }
}


(function(){
    let canvas = document.getElementById('viewport');
    let holder = document.getElementById('canvas-holder');
    let propertiesPanel = document.getElementById('item-settings');
    let objSelector = document.querySelectorAll('input[type=radio][name="object"]')
    ctx = canvas.getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight * .9;
    let mouseIsDown = false;
    let selectedItem = "Rect";
    let resizeObject = false;
    let currObj = null;
    let hitSide = null;
    let objects = [];
    let selectedOffset = {x:0,y:0};
    let mouseDownPos = {x:0,y:0};


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
    function displayPropertiesPanel(x,y){
        propertiesPanel.style.display = "flex";
        propertiesPanel.style.top = y + "px";
        propertiesPanel.style.left = (x + 5) + "px";
    }
    function removePropertiesPanel(){
        propertiesPanel.style.display = "none";
    }


    //CANVAS EVENT LISTENERS
    canvas.addEventListener("mousedown",e => {
        if (!mouseIsDown){
            
            mouseIsDown = true;
            switch(selectedItem){
                case "Select":
                    if(currObj != null){
                        currObj.properties.isSelected = false;
                    }
                    hitSide = null;
                    for (let i = 0; i < objects.length; i++) {
                        const obj = objects[i];
                        hitSide = obj.detectEdges(e.clientX,e.clientY);
                        if(hitSide != null){
                            currObj = obj;
                            currObj.properties.isSelected = true;
                            resizeObject = true;
                            mouseDownPos = {x:e.clientX,y:e.clientY};
                            break;
                        }
                    }
                    if (hitSide != null){
                        break;
                    };
                    resizeObject = false;

                    currObj = isMouseInsideObject(e.clientX,e.clientY);
                    if (currObj != null){
                        displayPropertiesPanel(e.clientX,e.clientY);
                        currObj.properties.isSelected = true;
                    }else{
                        removePropertiesPanel();
                    }
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
    function resizeCurrentObject(x,y){
        let mouseDiffX = (x - mouseDownPos.x);
        let mouseDiffY = (y - mouseDownPos.y);
        if(hitSide === "right"){
            currObj.dimens.w += mouseDiffX;

        }
        if(hitSide === "left"){
            currObj.pos.x += mouseDiffX;
            currObj.dimens.w -= mouseDiffX;
            
        }
        if(hitSide === "top"){
            currObj.pos.y += mouseDiffY;
            currObj.dimens.h -= mouseDiffY;
            
        }
        if(hitSide === "bottom"){
            currObj.dimens.h += mouseDiffY;
            
        }
        if (hitSide === "circle"){
            currObj.radius += mouseDiffX;
            if(currObj.radius < 1){
                currObj.radius = 1;
            }
            
            
        }
        mouseDownPos = {x:x,y:y};
    }
    document.addEventListener("mousemove",e => {
        if (mouseIsDown){
            switch(selectedItem){
                case "Select":
                    if(resizeObject){
                        resizeCurrentObject(e.clientX,e.clientY)
                        break;
                    }
                    if (currObj != null){
                        currObj.pos = {x:e.clientX - selectedOffset.x,y:e.clientY - selectedOffset.y};
                    }
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


    //PROPERTIES PANEL EVENTS
    let strokeColor = document.getElementById("stroke-color");
    let strokeSize = document.getElementById("stroke-size");
    let letFill = document.getElementById("fill");
    let fillColor = document.getElementById("fill-color");

    strokeColor.addEventListener("input", e => {
        currObj.properties.strokeColor = e.target.value;
    });
    strokeSize.addEventListener("input", e => {
        currObj.properties.strokeSize = parseInt(e.target.value);
    })
    letFill.addEventListener("input",e => {
        currObj.properties.isFill = e.target.checked;
    })
    fillColor.addEventListener("input",e => {
        currObj.properties.fillColor = e.target.value;
    })

})();