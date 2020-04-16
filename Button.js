var Button = pc.createScript('button');

Button.attributes.add('connected', { type : 'entity' });
Button.attributes.add('immediateTrigger', { type : 'boolean' });
Button.attributes.add('triggerFunction', { type : 'string' });
Button.attributes.add('leaveFunction', { type : 'string' });
Button.attributes.add('booleanTrigger', { type : 'boolean' });
Button.attributes.add('playSound', { type : 'boolean' });
Button.attributes.add('waitResolve', { type : 'boolean' });
Button.attributes.add('hoverScale', { type : 'boolean' });

Button.prototype.initialize = function() {  
    this.spinner = false;
    this.text = false;
    
    if(Utils.isMobile()){
        this.entity.element.on('touchstart', this.onPress, this);
        this.entity.element.on('touchend', this.onLeave, this);   
    }else{
        this.entity.element.on('mouseenter', this.onHover, this);
        this.entity.element.on('mouseleave', this.onLeave, this);
        this.entity.element.on('mousedown', this.onPress, this);
    }
    
    if(this.entity.findByName('Spinner')){
        this.spinner = this.entity.findByName('Spinner');
        this.spinner.enabled = false;
    }
    
    if(this.entity.findByName('Text')){
        this.text = this.entity.findByName('Text');
        this.text.enabled = true;
    }
};

Button.prototype.onHover = function (event) {
    document.body.style.cursor = 'pointer';
    
    if(this.hoverScale){
        this.entity.setLocalScale(1.1, 1.1, 1.1);
    }
};

Button.prototype.onLeave = function (event) {
    document.body.style.cursor = 'default';
    
    if(this.hoverScale){
        this.entity.setLocalScale(1, 1, 1);
    }
    
    if(this.connected){
        var connectedEntity = this.connected;
        
        if(this.booleanTrigger){
            eval('connectedEntity.script.' + this.triggerFunction + ' = false;'); 
        }
        
        if(this.leaveFunction){
            eval('connectedEntity.script.' + this.leaveFunction);
        }
    }
};

Button.prototype.loading = function () {
    if(!this.entity.enabled){
        return false;
    }
    
    this.spinner.enabled = true;
    this.text.enabled = false;
    
    this.entity.button.active = false;
};

Button.prototype.resolve = function () {
    if(!this.entity.enabled){
        return false;
    }
    
    this.spinner.enabled = false;
    this.text.enabled = true;
    
    this.entity.button.active = true;
};

Button.prototype.onPress = function (event) {
    if(!this.entity.button.active){
        return false;
    }
    
    if(this.immediateTrigger){
        this.onPressFire(event);
    }else{
        setTimeout(function(self, _event){
            self.onPressFire(_event);
        }, 100, this, event);
    }
};

Button.prototype.onPressFire = function (event) {
    if(this.playSound){
        this.entity.sound.play('click');
    }
    
    if(this.waitResolve){
        this.spinner.enabled = true;
        this.text.enabled = false;
        
        this.entity.button.active = false;
    }
    
    if(this.connected){
        var connectedEntity = this.connected;
        var self = this.entity;
        
        if(this.booleanTrigger){
            eval('connectedEntity.script.' + this.triggerFunction + ' = true;');   
        }else{
            eval('connectedEntity.script.' + this.triggerFunction);
        }
    }else{
        eval(this.triggerFunction);
    }
};