
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
    resize(x,y,hit){
        if(hit === "right"){
            this.dimens.w += x;

        }
        if(hit === "left"){
            this.pos.x += x;
            this.dimens.w -= x;
            
        }
        if(hit === "top"){
            this.pos.y += y;
            this.dimens.h -= y;
            
        }
        if(hit === "bottom"){
            this.dimens.h += y;
            
        }
    }
    checkIfInside(x,y){
        //total area of rect
        let A = (this.area(this.pos.x,this.pos.y,(this.pos.x + this.dimens.w),this.pos.y,(this.pos.x + this.dimens.w),(this.pos.y + this.dimens.h))+
            this.area(this.pos.x,this.pos.y,this.pos.x,(this.pos.y + this.dimens.h),(this.pos.x + this.dimens.w),(this.pos.y + this.dimens.h)));
        //areas related to mouse click
        let A1 = this.area(x,y,this.pos.x,this.pos.y,(this.pos.x + this.dimens.w),this.pos.y);
        let A4 = this.area(x,y,this.pos.x,this.pos.y,this.pos.x,(this.pos.y + this.dimens.h));
        let A2 = this.area(x,y,(this.pos.x + this.dimens.w),this.pos.y,(this.pos.x + this.dimens.w),(this.pos.y + this.dimens.h));
        let A3 = this.area(x,y,(this.pos.x + this.dimens.w),(this.pos.y + this.dimens.h),this.pos.x,(this.pos.y + this.dimens.h));

        if (A === A1 + A2 + A3 + A4 && A != 0){
            return true;
        }else{
            return false;
        }
    }
    //HELPER FUNCTION
    area(x1,y1,x2,y2,x3,y3){
        return Math.abs((x1 * (y2 - y3) + 
        x2 * (y3 - y1) + 
        x3 * (y1 - y2)) / 2);
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
    resize(x,y,hit){
        this.radius += x;
        if(this.radius < 1){
            this.radius = 1;
        }
    }
    checkIfInside(x,y){
        if (Math.sqrt((x-this.pos.x)*(x-this.pos.x) + (y-this.pos.y)*(y-this.pos.y)) < this.radius){
            return true;
        }else{
            return false;
        }
    }
}

class CanvasManager{
    constructor(){
        this.objects = [];
        this.currObj = null;
        this.selectedItem = "Rect";
        this.selectedOffset = {x:0,y:0};
        this.currMousePos = {x:0,y:0};
        this.mouseDownPos = {x:0,y:0};
        this.mouseIsDown = false;
        this.hitSide = null;
    }
    update(){
        this.objects.forEach(obj => {
            obj.draw();
        });
    }
    detectObjects(x,y){
        let foundObj = null;
        this.objects.forEach(obj => {
            if(obj.checkIfInside(x,y)){
                foundObj = obj
                this.selectedOffset = {x:x-obj.pos.x,y:y-obj.pos.y};
            };
        });
        return foundObj;
    }
    processMouseDown(x,y){
        if (!this.mouseIsDown){
            this.mouseIsDown = true;
            switch(this.selectedItem){
                case "Select":
                    if(this.currObj != null){
                        this.currObj.properties.isSelected = false;
                    }
                    this.hitSide = null;
                    for (let i = 0; i < this.objects.length; i++) {
                        const obj = this.objects[i];
                        this.hitSide = obj.detectEdges(x,y);
                        if(this.hitSide != null){
                            this.currObj = obj;
                            this.currObj.properties.isSelected = true;
                            this.resizeObject = true;
                            this.currMousePos = {x:x,y:y};
                            break;
                        }
                    }
                    if (this.hitSide != null){
                        break;
                    };
                    this.resizeObject = false;

                    this.currObj = this.detectObjects(x,y);
                    if (this.currObj != null){
                        this.mouseDownPos = {x:x,y:y};
                        this.currObj.properties.isSelected = true;
                    }
                    removePropertiesPanel();
                    break;
                case "Rect":
                    this.currObj = new Rect({x:x,y:y});
                    this.objects.push(this.currObj);
                    break;
                case "Circle":
                    this.currObj = new Circle({x:x,y:y});
                    this.objects.push(this.currObj);
                    break;
            }
            


        }
    }
    processMouseMove(x,y){
        if (this.mouseIsDown){
            
            switch(this.selectedItem){
                case "Select":
                    if(this.resizeObject){
                        let mouseDiffX = (x - this.currMousePos.x);
                        let mouseDiffY = (y - this.currMousePos.y);
                        this.currObj.resize(mouseDiffX,mouseDiffY,this.hitSide);
                        break;
                    }
                    if (this.currObj != null){
                        this.currObj.pos = {x:x - this.selectedOffset.x,y:y - this.selectedOffset.y};
                    }
                    break;
                case "Rect":
                    this.currObj.dimens = {w:x - this.currObj.pos.x,h:y - this.currObj.pos.y};
                    break;
                case "Circle":
                    this.currObj.radius = Math.abs(x - this.currObj.pos.x);
                    break;
            }
            this.currMousePos = {x:x,y:y};
        }
    }
    processMouseUp(x,y){
        if (this.mouseIsDown){
            this.mouseIsDown = false;
            console.log(this.mouseDownPos);
            console.log({x:x,y:y})
            if(this.mouseDownPos.x === x && this.mouseDownPos.y === y){
                displayPropertiesPanel(x,y);
            }
        }
    }
}


(function(){
    canvas = document.getElementById('viewport');
    let holder = document.getElementById('canvas-holder');
    let propertiesPanel = document.getElementById('item-settings');
    let objSelector = document.querySelectorAll('input[type=radio][name="object"]')
    ctx = canvas.getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight * .9;
    let canMan = new CanvasManager();


    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        canMan.update();
        requestAnimationFrame(draw);
    }
    draw();

    objSelector.forEach(radio => {
        radio.addEventListener('click',e =>{
            canMan.selectedItem = e.target.value;
        });
    });
    // GLOBAL FUNCTIONS TO HANDLE PROPERTIES PANEL
    window.displayPropertiesPanel = function(x,y){
        propertiesPanel.style.display = "flex";
        propertiesPanel.style.top = y + "px";
        propertiesPanel.style.left = (x + 5) + "px";
    }
    window.removePropertiesPanel = function(){
        propertiesPanel.style.display = "none";
    }

    //PROPERTIES PANEL EVENTS
    let strokeColor = document.getElementById("stroke-color");
    let strokeSize = document.getElementById("stroke-size");
    let letFill = document.getElementById("fill");
    let fillColor = document.getElementById("fill-color");

    strokeColor.addEventListener("input", e => {
        canMan.currObj.properties.strokeColor = e.target.value;
    });
    strokeSize.addEventListener("input", e => {
        canMan.currObj.properties.strokeSize = parseInt(e.target.value);
    })
    letFill.addEventListener("input",e => {
        canMan.currObj.properties.isFill = e.target.checked;
    })
    fillColor.addEventListener("input",e => {
        canMan.currObj.properties.fillColor = e.target.value;
    })

    //CANVAS EVENT LISTENERS
    canvas.addEventListener("mousedown",e => {
        canMan.processMouseDown(e.clientX,e.clientY)
        
    });
    document.addEventListener("mousemove",e => {
        canMan.processMouseMove(e.clientX,e.clientY);
    });
    canvas.addEventListener("mouseup",e => {
        canMan.processMouseUp(e.clientX,e.clientY);
    });

})();