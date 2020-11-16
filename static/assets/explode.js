var Explode = pc.createScript('explode');

// initialize code called once per entity
Explode.prototype.initialize = function() {    
    // Find all the entity references we need for the effect as a whole
    this.light = this.entity.findByName("PointLight");
    this.mainVfx = this.entity.particlesystem;
    this.smokeVfx = this.entity.findByName("ExplosionSmoke").particlesystem;
    this.derbisVfx = this.entity.findByName("ExplosionDebris").particlesystem;

    this.timeSinceEnabled = 0;
    this.explosionInterval = 3; 
    
    // For the demo, explode every 3.1 secs
    var self = this;
    setInterval(function () {
        self.explode();
    }, 3100);
};


// update code called every frame
Explode.prototype.update = function(dt) {
    this.timeSinceEnabled += dt;
    if (this.timeSinceEnabled > 0.5) {
        if (this.light.enabled) {
            this.light.enabled = false;
        }
    }    
};


Explode.prototype.explode = function () {
    this.timeSinceEnabled = 0;
    this.light.enabled = true;

    this.mainVfx.reset();
    this.mainVfx.play();

    this.smokeVfx.reset();
    this.smokeVfx.play();

    this.derbisVfx.reset();
    this.derbisVfx.play();     
    
    this.entity.sound.play('vfx');
    
    this.app.fire("camera:shake");
};