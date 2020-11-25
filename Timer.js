var Timer = pc.createScript('timer');

Timer.prototype.initialize = function() {
    //values
    this.originalValue = this.cloneNumber(this.entity.element.text);
    this.currentValue  = this.cloneNumber(this.originalValue);
    
    //global events
    this.app.on('Timer:' + this.entity.name, this.setTimer, this);
    
    this.on('state', this.onStateChange, this);
    this.on('destroy', this.onDestroy, this);
    
    //for initalizing
    this.onStateChange(true);
};

Timer.prototype.onDestroy = function() {
    this.app.off('Timer:' + this.entity.name, this.setTimer, this);
};

Timer.prototype.setTimer = function() {
    this.currentValue = this.cloneNumber(this.originalValue);
};

Timer.prototype.onStateChange = function(state) {
    if(state === true){
        clearInterval(this.timer);
        this.timer = setInterval(function(self){
            self.setNextValue();
        }, 1000, this);
    }else{
        clearInterval(this.timer);
    }
};

Timer.prototype.setNextValue = function() {
    if(this.currentValue <= 0){
        return false;
    }
    
    this.currentValue--;
    this.entity.element.text = this.currentValue + '';
};

Timer.prototype.cloneNumber = function(value) {
    return parseInt(value + '');
};