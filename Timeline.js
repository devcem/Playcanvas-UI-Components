var Timeline = pc.createScript('timeline');

Timeline.attributes.add('autoplay', { type : 'boolean' });

Timeline.attributes.add('position', { type : 'boolean', default : false });
Timeline.attributes.add('scale', { type : 'boolean', default : false });
Timeline.attributes.add('rotation', { type : 'boolean', default : false });
Timeline.attributes.add('opacity', { type : 'boolean', default : false });
Timeline.attributes.add('duration', { type : 'number', default : 1 });
Timeline.attributes.add('delay', { type : 'number', default : 0 });
Timeline.attributes.add('ease', {
    type : 'string',
    enum : [
        { Linear : 'Linear' },
        { QuadraticIn : 'QuadraticIn' },
        { QuadraticOut : 'QuadraticOut' },
        { QuadraticInOut : 'QuadraticInOut' },
        { CubicIn : 'CubicIn' },
        { CubicOut : 'CubicOut' },
        { CubicInOut : 'CubicInOut' },
        { QuarticIn : 'QuarticIn' },
        { QuarticOut : 'QuarticOut' },
        { QuarticInOut : 'QuarticInOut' },
        { QuinticIn : 'QuinticIn' },
        { QuinticOut : 'QuinticOut' },
        { QuinticInOut : 'QuinticInOut' },
        { SineIn : 'SineIn' },
        { SineOut : 'SineOut' },
        { SineInOut : 'SineInOut' },
        { ExponentialIn : 'ExponentialIn' },
        { ExponentialOut : 'ExponentialOut' },
        { ExponentialInOut : 'ExponentialInOut' },
        { CircularIn : 'CircularIn' },
        { CircularOut : 'CircularOut' },
        { CircularInOut : 'CircularInOut' },
        { BackIn : 'BackIn' },
        { BackOut : 'BackOut' },
        { BackInOut : 'BackInOut' },
        { BounceIn : 'BounceIn' },
        { BounceOut : 'BounceOut' },
        { BounceInOut : 'BounceInOut' },
        { ElasticIn : 'ElasticIn' },
        { ElasticOut : 'ElasticOut' },
        { ElasticInOut : 'ElasticInOut' }
    ],
    default : 'Linear'
});

Timeline.attributes.add('startFrame', {
    type: 'json',
    schema: [{
        name: 'position',
        type: 'vec3',
    }, {
        name: 'rotation',
        type: 'vec3'
    }, {
        name: 'scale',
        type: 'vec3',
        default : [1, 1, 1]
    },{
        name  : 'opacity',
        type  : 'number',
        default : 1
    }]
});

Timeline.attributes.add('endFrame', {
    type: 'json',
    schema: [{
        name: 'position',
        type: 'vec3',
    }, {
        name: 'rotation',
        type: 'vec3'
    }, {
        name: 'scale',
        type: 'vec3',
        default : [1, 1, 1]
    },{
        name  : 'opacity',
        type  : 'number',
        default : 1
    }]
});

Timeline.prototype.initialize = function() {
    this.app.on(this.entity.name + ':Timeline', this.onPlay, this);
    
    if(this.autoplay){
        this.onPlay();
    }
};

Timeline.prototype.getEase = function() {
    return pc[this.ease];
};

Timeline.prototype.reset = function() {
    if(this.positionFrames){
        this.positionFrames.stop();    
    }
    
    if(this.rotationFrames){
        this.rotationFrames.stop();    
    }
    
    if(this.scaleFrames){
        this.scaleFrames.stop();    
    }
    
    if(this.opacityFrames){
        this.opacityFrames.stop();    
    }
};

Timeline.prototype.setFirstFrame = function() {
    if(this.position){
        this.entity.setLocalPosition(this.startFrame.position);
    }
    
    if(this.rotation){
        this.entity.setLocalEulerAngles(this.startFrame.rotation);
    }
    
    if(this.scale){
        this.entity.setLocalScale(this.startFrame.scale);
    }
    
    if(this.opacity){
        this.entity.element.opacity = this.startFrame.opacity;
    }
};

Timeline.prototype.onPlay = function() {
    this.reset();
    this.setFirstFrame();
    
    if(this.position){
        this.positionFrames = this.entity.tween(
            this.entity.getLocalPosition()
        ).to({
            x : this.endFrame.position.x,
            y : this.endFrame.position.y,
            z : this.endFrame.position.z
        }, this.duration, this.getEase());
        
        this.positionFrames.start();
    }
    
    if(this.rotation){
        this.rotationFrames = this.entity.tween(
            this.entity.getLocalEulerAngles()
        ).rotate({
            x : this.endFrame.rotation.x,
            y : this.endFrame.rotation.y,
            z : this.endFrame.rotation.z
        }, this.duration, this.getEase());
        
        this.rotationFrames.start();
    }
    
    if(this.scale){
        this.scaleFrames = this.entity.tween(
            this.entity.getLocalScale()
        ).to({
            x : this.endFrame.scale.x,
            y : this.endFrame.scale.y,
            z : this.endFrame.scale.z
        }, this.duration, this.getEase());
        
        this.scaleFrames.start();
    }
    
    if(this.opacity){
        this.opacityFrames = this.entity.tween(
            this.entity.element
        ).to({
            opacity : this.endFrame.opacity
        }, this.duration, this.getEase());
        
        this.opacityFrames.start();
    }
};
