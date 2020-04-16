var Slider = pc.createScript('slider');

Slider.attributes.add('defaultValue', { type : 'number', default : 100 });
Slider.attributes.add('min', { type : 'number', default : 0 });
Slider.attributes.add('max', { type : 'number', default : 100 });
Slider.attributes.add('step', { type : 'number', default : 1 });
Slider.attributes.add('displayElement', { type : 'entity' });
Slider.attributes.add('storeValue', { type : 'boolean' });
Slider.attributes.add('storeWithName', { type : 'boolean' });

Slider.attributes.add('connected', { type : 'entity' });
Slider.attributes.add('triggerFunction', { type : 'string' });

Slider.prototype.initialize = function() {
    this.element = document.createElement('input');
    this.element.type = 'range';
    
    this.element.style.position = 'absolute';
    this.element.style.fontFamily = this.fontFamily;
    
    this.element.style.border = '0px';
    this.element.style.margin = '0px';
    this.element.style.padding = '0px';
    this.element.style.background = 'transparent';

    this.element.style.boxSizing = 'border-box';
    this.element.value = this.defaultValue;
    
    this.element.min = this.min;
    this.element.max = this.max;
    
    this.element.onchange = this.onChange.bind(this);
    
    this.element.style.outline = 'none';
    document.body.appendChild(this.element);
    
    this.updateStyle();
    
    if(this.storeWithName){
        this.elementId = this.entity.name;
    }else{
        this.elementId = this.entity._guid;
    }
    
    var value = window.localStorage.getItem(this.elementId);
        
    if(value){
        this.setValue(window.localStorage.getItem(this.elementId));   
    }
    
    this.on('state', function(self){
        if(this.entity.enabled){
            this.element.style.display = 'block'; 
        }else{
            this.element.style.display = 'none'; 
        }
    }, this);
};

Slider.prototype.onFocus = function() {
    this.focusEntity.enabled = true;
};

Slider.prototype.onBlur = function() {
    this.focusEntity.enabled = false;
};

Slider.prototype.onChange = function() {
    if(this.storeValue){
        window.localStorage.setItem(this.elementId, this.getValue());
    }
    
    if(this.connected){
        var connectedEntity = this.connected;
        var self = this.entity;
        
        eval('connectedEntity.script.' + this.triggerFunction);
    }
};

Slider.prototype.updateStyle = function() {
    if(this.entity.element.screenCorners){
        var position = this.entity.element.screenCorners;
        var ratio = 1 / this.app.graphicsDevice.maxPixelRatio;
    
        this.element.style.left = position[0].x * ratio + 'px';
        this.element.style.bottom = position[0].y * ratio + 'px';

        this.element.style.width = (position[2].x - position[0].x) * ratio + 'px';
        this.element.style.height = (position[2].y - position[0].y) * ratio + 'px';
    }
};

Slider.prototype.update = function(dt) {
    this.updateStyle();
    
    if(this.displayElement){
        this.displayElement.element.text = this.getValue();   
    }
};

Slider.prototype.setValue = function(value) {
    this.element.value = value;
};

Slider.prototype.getValue = function() {
    if(this.element){
        return this.element.value;   
    }
};