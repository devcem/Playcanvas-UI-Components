var Scrollbar = pc.createScript('scrollbar');

Scrollbar.attributes.add('speed', { type : 'number', default : 0.035 });
Scrollbar.attributes.add('padding', { type : 'number', default : 30 });

Scrollbar.prototype.initialize = function() {
    this.lastUpdate = Date.now();
    this.percentage = 0;
    this.entity.element.on('mousewheel', this.onWheel, this);
    
    this.contentEntity = this.entity.findByName('Content');
};

Scrollbar.prototype.onWheel = function(data) {
    if(data.event.deltaY > 0){
        this.entity.scrollview.scroll.y =-this.speed;
    }else{
        this.entity.scrollview.scroll.y = 1 + this.speed;
    }
};

Scrollbar.prototype.update = function(dt) {
    if(Date.now() - this.lastUpdate > 1000 && this.contentEntity){
        var totalHeight = 0;
        var entities = this.contentEntity.children;
        
        for(var entityIndex in entities){
            var entity = entities[entityIndex];
            
            totalHeight+=entity.element.calculatedHeight;
        }
        
        this.contentEntity.element.height = totalHeight + this.padding;
        this.lastUpdate = Date.now();
    }
};