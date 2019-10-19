var Checkbox = pc.createScript('checkbox');

Checkbox.attributes.add('default', { type : 'boolean' });
Checkbox.prototype.initialize = function() {
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
};

Checkbox.prototype.updateStyle = function() {
    if(this.entity.element.screenCorners){
        var position = this.entity.element.screenCorners;
    
        this.element.style.left = position[0].x + 'px';
        this.element.style.bottom = position[0].y + 'px';

        this.element.style.width = (position[2].x - position[0].x) + 'px';
        this.element.style.height = (position[2].y - position[0].y) + 'px';
    }
};

Checkbox.prototype.update = function(dt) {
    this.updateStyle();
};

Checkbox.prototype.getValue = function() {
    return this.element.checked;
};