var Checkbox = pc.createScript('checkbox');

Checkbox.attributes.add('default', { type : 'boolean' });
Checkbox.attributes.add('storeValue', { type : 'boolean' });
Checkbox.attributes.add('storeWithName', { type : 'boolean' });

Checkbox.attributes.add('connected', { type : 'entity' });
Checkbox.attributes.add('triggerFunction', { type : 'string' });

Checkbox.prototype.initialize = function() {
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
    if(this.entity.element.screenCorners){
        var position = this.entity.element.screenCorners;
        var ratio = 1 / this.app.graphicsDevice.maxPixelRatio;
    
        this.element.style.left = position[0].x * ratio + 'px';
        this.element.style.bottom = position[0].y * ratio + 'px';

        this.element.style.width = (position[2].x - position[0].x) * ratio + 'px';
        this.element.style.height = (position[2].y - position[0].y) * ratio + 'px';
    }
};

Checkbox.prototype.update = function(dt) {
    this.updateStyle();
};

Checkbox.prototype.setValue = function(value) {
    this.element.checked = value;
};

Checkbox.prototype.getValue = function() {
    if(this.element){
        return this.element.checked;
    }
};