var Input = pc.createScript('input');

Input.attributes.add('placeholder', { type : 'string' });
Input.attributes.add('type', {
    type: 'string',
    enum: [
        { 'Text': 'text' },
        { 'Email': 'email' },
        { 'Password': 'password' }
    ],
    default : 'text'
});
Input.attributes.add('maxLength', { type : 'number', default : 64 });
Input.attributes.add('fontSize', { type : 'number', default : 1 });
Input.attributes.add('padding', { type : 'number', default : 1 });
Input.attributes.add('scaleUnit', {
    type: 'string',
    enum: [
        { 'Viewport Width': 'vw' },
        { 'Viewport Height': 'vh' },
        { 'Pixel': 'px' }
    ],
    default : 'vw'
});
Input.attributes.add('color', { type : 'rgb' });
Input.attributes.add('whitePlaceholder', { type : 'boolean' });
Input.attributes.add('fontFamily', { type : 'string', default : 'Arial, sans-serif' });
Input.attributes.add('storeValue', { type : 'boolean' });

Input.attributes.add('focusEntity', { type : 'entity' });

Input.prototype.initialize = function() {
    this.element = document.createElement('input');
    this.element.placeholder = this.placeholder;
    
    this.element.type = this.type;
    
    this.element.style.position = 'absolute';
    this.element.style.fontFamily = this.fontFamily;
    
    this.element.style.border = '0px';
    this.element.style.background = 'transparent';
    
    this.element.style.fontSize = this.fontSize + this.scaleUnit;
    this.element.style.padding = this.padding + this.scaleUnit;
    this.element.style.boxSizing = 'border-box';
    
    if(this.maxLength > 0){
        this.element.maxlength = this.maxLength;
    }
    
    var color = 'rgb(' + (this.color.r * 255) + ', ' + (this.color.g * 255) + ', ' + (this.color.b * 255) + ')';
    this.element.style.color = color;
    
    this.element.style.outline = 'none';
    
    if(this.whitePlaceholder){
        this.element.className = 'white-placeholder';
    }
    
    document.body.appendChild(this.element);
    
    //disable focus entity
    if(this.focusEntity){
        this.focusEntity.enabled = false;   
        
        this.element.onfocus = this.onFocus.bind(this);
        this.element.onblur = this.onBlur.bind(this);
    }
    
    this.element.onchange = this.onChange.bind(this);
    
    //if(this.storeValue){
        var value = window.localStorage.getItem(this.entity._guid);
        
        if(value){
            this.setValue(window.localStorage.getItem(this.entity._guid));   
        }
    //}
    
    this.updateStyle();
    
    this.on('state', function(self){
        if(this.entity.enabled){
            this.element.style.display = 'block'; 
        }else{
            this.element.style.display = 'none'; 
        }
    }, this);
};

Input.prototype.store = function() {
    this.storeValue = true;
    this.onChange();
};

Input.prototype.onFocus = function() {
    this.focusEntity.enabled = true;
};

Input.prototype.onBlur = function() {
    this.focusEntity.enabled = false;
};

Input.prototype.onChange = function() {
    if(this.storeValue){
        window.localStorage.setItem(this.entity._guid, this.getValue());
    }
};

Input.prototype.updateStyle = function() {
    if(this.entity.element.screenCorners){
        var position = this.entity.element.screenCorners;
        var ratio = 1 / this.app.graphicsDevice.maxPixelRatio;
    
        this.element.style.left = position[0].x * ratio + 'px';
        this.element.style.bottom = position[0].y * ratio + 'px';

        this.element.style.width = (position[2].x - position[0].x) * ratio + 'px';
        this.element.style.height = (position[2].y - position[0].y) * ratio + 'px';
    }
};

Input.prototype.update = function(dt) {
    this.updateStyle();
};

Input.prototype.setValue = function(value) {
    this.element.value = value;
};

Input.prototype.getValue = function() {
    if(this.element){
        return this.element.value;   
    }
};

Input.prototype.focus = function() {
    if(this.element){
        this.element.focus();
    }
};

Input.prototype.blur = function() {
    if(this.element){
        this.element.blur();
    }
};