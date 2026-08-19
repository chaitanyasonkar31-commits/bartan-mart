/**
 * GTA 5: Bhopal City Edition - 3D Bhopal City & Environment Builder
 * Renders Bhopal VIP Road Expressway, Upper Lake (Bada Talaab) water mesh, Raja Bhoj Statue,
 * Pani Puri Thelas, Kirana Shops, Police Station, Bungalows, Apartments, Vehicle Fleet & 3D NPCs!
 */

window.IndianCityBuilder = (function() {

  function buildCity(scene, region) {
    const cityGroup = new THREE.Group();

    // 1. Ground Grass Plane
    const groundGeo = new THREE.PlaneGeometry(800, 800);
    const groundMat = PhysicalMaterials.createGrassMaterial(region.groundColor);
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    cityGroup.add(groundMesh);

    // 2. Bhopal Upper Lake (Bada Talaab) Water Mesh
    const lakeGeo = new THREE.PlaneGeometry(800, 300);
    const lakeMat = PhysicalMaterials.createWaterMaterial();
    const lakeMesh = new THREE.Mesh(lakeGeo, lakeMat);
    lakeMesh.rotation.x = -Math.PI / 2;
    lakeMesh.position.set(0, 0.2, -250);
    lakeMesh.name = "bhopal_upper_lake";
    cityGroup.add(lakeMesh);

    // Lake Shoreline Railing
    const railMat = PhysicalMaterials.createGlowingNeonMaterial(0x00f2fe);
    const railGeo = new THREE.BoxGeometry(800, 1.2, 0.4);
    const railMesh = new THREE.Mesh(railGeo, railMat);
    railMesh.position.set(0, 0.8, -100);
    cityGroup.add(railMesh);

    // 3. Raja Bhoj Statue & Arch Landmark
    const pedestalGeo = new THREE.CylinderGeometry(6, 8, 10, 16);
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x5a4b3c, roughness: 0.7 });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.set(0, 5, -80);
    cityGroup.add(pedestalMesh);

    const statueGeo = new THREE.ConeGeometry(3, 8, 8);
    const statueMat = PhysicalMaterials.createGlowingNeonMaterial(0xffab00);
    const statueMesh = new THREE.Mesh(statueGeo, statueMat);
    statueMesh.position.set(0, 14, -80);
    cityGroup.add(statueMesh);

    // 4. Bhopal VIP Road Expressway (Dark Asphalt with Yellow Lane Dashes)
    const roadMat = PhysicalMaterials.createRoadMaterial();
    const vipRoadGeo = new THREE.PlaneGeometry(800, 40);
    const vipRoadMesh = new THREE.Mesh(vipRoadGeo, roadMat);
    vipRoadMesh.rotation.x = -Math.PI / 2;
    vipRoadMesh.position.set(0, 0.1, -70);
    vipRoadMesh.receiveShadow = true;
    cityGroup.add(vipRoadMesh);

    // Yellow Lane Center Line Dashes
    const laneMat = PhysicalMaterials.createGlowingNeonMaterial(0xffab00);
    for (let x = -380; x <= 380; x += 20) {
      const lane = new THREE.Mesh(new THREE.PlaneGeometry(10, 0.8), laneMat);
      lane.rotation.x = -Math.PI / 2;
      lane.position.set(x, 0.15, -70);
      cityGroup.add(lane);
    }

    // Cross City Road Grid
    const crossRoadGeo = new THREE.PlaneGeometry(40, 600);
    const crossRoadMesh = new THREE.Mesh(crossRoadGeo, roadMat);
    crossRoadMesh.rotation.x = -Math.PI / 2;
    crossRoadMesh.position.set(0, 0.1, 100);
    cityGroup.add(crossRoadMesh);

    // 5. Accessible Buildings (Police Station, Bungalows, Apartments)
    // Police Station Building
    const policeStationGeo = new THREE.BoxGeometry(60, 25, 40);
    const policeStationMat = PhysicalMaterials.createBuildingMaterial(0x1a2e4a);
    const policeStationMesh = new THREE.Mesh(policeStationGeo, policeStationMat);
    policeStationMesh.position.set(-90, 12.5, 30);
    policeStationMesh.castShadow = true;
    cityGroup.add(policeStationMesh);

    const policeSign = new THREE.Mesh(new THREE.BoxGeometry(35, 6, 2), PhysicalMaterials.createGlowingNeonMaterial(0x00f2fe));
    policeSign.position.set(-90, 28, 30);
    cityGroup.add(policeSign);

    // Traditional Bungalows
    buildBungalow(cityGroup, 90, 0, 30, 0xffab00);
    buildBungalow(cityGroup, 160, 0, 30, 0x00e676);

    // 6. Pani Puri / Golgappa Thelas (Carts) & Kirana Shops
    const thela1 = Models3D.createPaniPuriThela();
    thela1.position.set(-30, 0, -45);
    cityGroup.add(thela1);

    const thela2 = Models3D.createPaniPuriThela();
    thela2.position.set(30, 0, -45);
    cityGroup.add(thela2);

    // 7. Parked Vehicles (BMW, Fortuner, Scorpio, Rickshaw, Police Cruiser)
    const bmw = Models3D.createBmwSedan(0x00f2fe);
    bmw.position.set(20, 0, -60);
    cityGroup.add(bmw);

    const fortuner = Models3D.createFortunerSuv(0xffffff);
    fortuner.position.set(-20, 0, -60);
    cityGroup.add(fortuner);

    const scorpio = Models3D.createScorpioSuv();
    scorpio.position.set(-50, 0, -60);
    cityGroup.add(scorpio);

    const rickshaw = Models3D.createAutoRickshaw();
    rickshaw.position.set(50, 0, -60);
    cityGroup.add(rickshaw);

    const policeCar = Models3D.createPoliceCruiser();
    policeCar.position.set(-80, 0, 10);
    cityGroup.add(policeCar);

    // 8. 3D Human NPCs (Male, Female, Children)
    buildHumanNPCs(cityGroup);

    scene.add(cityGroup);
    return {
      cityGroup: cityGroup,
      bmw: bmw,
      fortuner: fortuner,
      scorpio: scorpio,
      rickshaw: rickshaw,
      policeCar: policeCar,
      lakeMesh: lakeMesh
    };
  }

  function buildBungalow(group, x, y, z, colorHex) {
    const bungGroup = new THREE.Group();
    bungGroup.position.set(x, y, z);

    const baseGeo = new THREE.BoxGeometry(40, 18, 30);
    const baseMat = PhysicalMaterials.createBuildingMaterial(0x3a3028);
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 9;
    baseMesh.castShadow = true;
    bungGroup.add(baseMesh);

    // Sloping Tile Roof
    const roofGeo = new THREE.ConeGeometry(28, 10, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.rotation.y = Math.PI / 4;
    roofMesh.position.y = 23;
    bungGroup.add(roofMesh);

    group.add(bungGroup);
  }

  function buildHumanNPCs(group) {
    // Male NPC
    const male1 = Models3D.createHumanModel("MALE", 0x00f2fe);
    male1.position.set(-15, 0, -40);
    group.add(male1);

    // Female NPC
    const female1 = Models3D.createHumanModel("FEMALE", 0xff1744);
    female1.position.set(-13, 0, -40);
    group.add(female1);

    // Child NPC
    const child1 = Models3D.createHumanModel("CHILD", 0xffab00);
    child1.position.set(-11, 0, -40);
    group.add(child1);
  }

  return {
    buildCity: buildCity
  };

})();
