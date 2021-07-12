var CustomInput = pc.createScript('customInput');

CustomInput.attributes.add('trigger', { type : 'string' });
CustomInput.prototype.initialize = function() {
    this.placeHolder = this.entity.element.text + '';
    
    this.isActive = false;
    
    this.keys = [];
    this.excludedChars = [8, 13, 9, 16, 20, 17, 91];
    
    this.cursor = false;
    this.lastCursorTime = Date.now();
    
    this.app.keyboard.on('keydown', this.onKeyDown, this);
};

CustomInput.prototype.onKeyDown = function(event) {
    if(event.key == 13){
        if(this.isActive){
            this.entity.element.text = this.placeHolder;
            
            if(this.trigger){
                this.app.fire(this.trigger, this.keys.join(''));   
            }
            
            this.keys = [];
        }
        
        this.isActive = !this.isActive;
    }
    
    if(!this.isActive){
        return false;
    }
    
    if(
        this.excludedChars.indexOf(event.key) === -1 &&
        event.event.key
    ){
        this.keys.push(event.event.key);   
    }
    
    //special functions, backspace
    if(event.key === 8){
        this.keys.splice(this.keys.length - 1, 1);
    }
};

CustomInput.prototype.update = function(dt) {
    if(!this.isActive){
        return false;
    }
    
    if(Date.now() - this.lastCursorTime > 200){
        this.cursor = !this.cursor;
        this.lastCursorTime = Date.now();
    }
    
    this.entity.element.text = this.keys.join('') + (this.cursor ? '_' : ' ');
};