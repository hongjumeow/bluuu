let scene,camera,renderer,cloudParticles=[],flash,rain,rainGeo,rainCount=150000,geometry,controls;
function init(){
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,1000);
    camera.position.set(0,0,1);
    camera.rotation.x=1.16;
    camera.rotation.y=-0.12;
    camera.rotation.z=0.27;

    ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);
    
    directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0,0,1);
    scene.add(directionalLight);

    flash = new THREE.PointLight(0x062d89,30,500,1.7);;
    flash.position.set(200,300,100);
    scene.add(flash);

    renderer = new THREE.WebGLRenderer();
    scene.fog = new THREE.FogExp2(0x11111f,0.002);
    renderer.setClearColor(scene.fog.color);
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // controls = new THREE.OrbitControls(
    //     camera, renderer.domElement);
    // controls.target.set(0,0, 1);
    // // controls.object.position.set(0,0,1);
    // controls.minDistance =20;
    // controls.maxDistance = 150;
    // controls.noKeys = true;
    // controls.rotateSpeed = 1.4;
    // controls.update();
    // controls.enablePan = true;
    // controls.enableDamping = true;

    //adding rains
    rainGeo=new THREE.BufferGeometry(); 
    let vertices = [];
    for(let i=0;i<rainCount;i++){

        rainDrop=new THREE.Vector3(
            Math.random()*400-200,
            Math.random()*500-250,
            Math.random()*400-200
        );
        vertices.push(rainDrop);
    }
    geometry = new THREE.BufferGeometry().setFromPoints(vertices);

    rainMaterial= new THREE.PointsMaterial({
        color:0xaaaaaa,
        size:0.1,
        transparent:true
    });
    rain = new THREE.Points(geometry,rainMaterial);
    scene.add(rain);

    //adding clouds
    let loader = new THREE.TextureLoader();
    loader.load("./resources/smoke.png",function(texture){
        cloudGeo = new THREE.PlaneBufferGeometry(500,500);
        cloudMaterial = new THREE.MeshLambertMaterial({
            map:texture,
            transparent:true, 
        });
        for(let p=0; p<25; p++){
            let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
            cloud.position.set(
                Math.random()*800-400,
                500,
                Math.random()*500-450
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random()*360;
            cloud.material.opacity = 0.6;
            cloudParticles.push(cloud);
            scene.add(cloud);
        }
        // animate();
    });
    animate();
}
function animate(){
    cloudParticles.forEach(p=>{
        p.rotation.z -=0.001;
    });

    let positions = geometry.attributes.position.array;
    
    for(let i=0; i<positions.length; i+=3){
        let velocity = 0;
        velocity-=0.1+Math.random()*0.8;
        positions[i+1]+=velocity;
        if(positions[i+1]<-200){
            positions[i+1]=200;
        }
    }
    geometry.attributes.position.needsUpdate = true;
    rain.rotation.y+=0.002;

    if(Math.random()>0.97||flash.power>100){
        if(flash.power<100)
        flash.position.set(
            Math.random()*400,
            300+Math.random()*200,
            100
        );
        flash.power = 50+Math.random() *500;


    }
    renderer.render(scene,camera);
    // controls.update();
    requestAnimationFrame(animate);
    

}
function resize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', function(){
    resize();
});
init();