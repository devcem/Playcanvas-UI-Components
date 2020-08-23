var Checkbox = pc.createScript('checkbox');

Checkbox.attributes.add('default', { type : 'boolean' });
Checkbox.attributes.add('storeValue', { type : 'boolean' });
Checkbox.attributes.add('storeWithName', { type : 'boolean' });

Checkbox.attributes.add('connected', { type : 'entity' });
Checkbox.attributes.add('triggerFunction', { type : 'string' });

Checkbox.prototype.initialize = function() {
    this.timeout = false;
    
    if(this.storeWithName){
        this.elementId = this.entity.name;
    }else{
        this.elementId = this.entity._guid;
    }
    
    this.element = document.createElement('input');
    
    this.element.type = 'checkbox';
    this.element.style.position = 'absolute';
    
    this.element.style.border = '0px';
    this.element.style.background = 'transparent';
    
    this.element.style.outline = 'none';
    this.element.style.margin = '0 auto';
    this.element.style.padding = 'auto';
    this.element.checked = this.default;
    
    document.body.appendChild(this.element);
    
    this.updateStyle();
    window.addEventListener('resize', this.updateStyle.bind(this));
    
    if(this.sleepValue !== null){
        this.setValue(this.sleepValue);
    }
    
    this.on('state', function(self){
        if(this.entity.enabled){
            this.element.style.display = 'block'; 
        }else{
            this.element.style.display = 'none'; 
        }
    }, this);
    
    this.element.onchange = this.onChange.bind(this);
    
    if(this.storeValue){
        var value = window.localStorage.getItem(this.elementId);
        
        if(value){
            this.setValue(window.localStorage.getItem(this.elementId));   
        }
    }
};

Checkbox.prototype.onChange = function() {
    if(this.storeValue){
        window.localStorage.setItem(this.elementId, this.getValue());
    }
    
    if(this.connected){
        var connectedEntity = this.connected;
        var self = this.entity;
        
        eval('connectedEntity.script.' + this.triggerFunction);
    }
};

Checkbox.prototype.updateStyle = function() {
    clearTimeout(this.timeout);
    
    //wait for DOM process
    this.timeout = setTimeout(function(self){
        if(self.entity && self.entity.element && self.entity.element.screenCorners){
            var position = self.entity.element.screenCorners;
            var ratio = 1 / self.app.graphicsDevice.maxPixelRatio;

            self.element.style.left = position[0].x * ratio + 'px';
            self.element.style.bottom = position[0].y * ratio + 'px';

            self.element.style.width = (position[2].x - position[0].x) * ratio + 'px';
            self.element.style.height = (position[2].y - position[0].y) * ratio + 'px';
        }
    }, 100, this);
};

Checkbox.prototype.setValue = function(value) {
    if(!this.element){
        this.sleepValue = value;
    }else{
        this.element.checked = value;
        this.sleepValue = false;
    }
};

Checkbox.prototype.getValue = function() {
    if(this.element){
        return this.element.checked;
    }
};
