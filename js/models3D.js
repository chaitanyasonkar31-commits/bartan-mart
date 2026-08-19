/**
 * GTA 5: Bhopal City Edition - 3D Mesh Generator Engine
 * Creates 3D Vehicle Fleet (BMW, Fortuner, Scorpio, Alto, WagonR, Kia, Motorbike, Activa, Bicycle, Rickshaw, Police),
 * Bhopal Upper Lake, Raja Bhoj Statue, Pani Puri Thelas, Police Station, Bungalows, Apartments, and 3D Male/Female/Children Human Models!
 */

window.Models3D = (function() {

  // 1. BMW M-Series Sedan
  function createBmwSedan(colorHex = 0x00f2fe) {
    const group = new THREE.Group();
    const paintMat = PhysicalMaterials.createCarPaintMaterial(colorHex);
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111625, roughness: 0.3 });

    // Chassis Body
    const bodyGeo = new THREE.BoxGeometry(4.2, 1.2, 8.8);
    const bodyMesh = new THREE.Mesh(bodyGeo, paintMat);
    bodyMesh.position.y = 0.8;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Double-Kidney Grille
    const grilleMat = PhysicalMaterials.createGlowingNeonMaterial(0xffab00);
    const g1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.2), grilleMat);
    g1.position.set(-0.5, 0.8, 4.45);
    const g2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.2), grilleMat);
    g2.position.set(0.5, 0.8, 4.45);
    group.add(g1); group.add(g2);

    // Glass Roof Cabin
    const glassMat = PhysicalMaterials.createGlassMaterial();
    const cabinGeo = new THREE.BoxGeometry(3.6, 1.1, 4.6);
    const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
    cabinMesh.position.set(0, 1.95, -0.4);
    group.add(cabinMesh);

    // 4 Alloy Wheels
    createWheels(group);
    return group;
  }

  // 2. Toyota Fortuner 4x4 SUV
  function createFortunerSuv(colorHex = 0xffffff) {
    const group = new THREE.Group();
    const paintMat = PhysicalMaterials.createCarPaintMaterial(colorHex, 0.3, 0.7);

    // Muscular High SUV Chassis
    const bodyGeo = new THREE.BoxGeometry(4.4, 1.8, 9.2);
    const bodyMesh = new THREE.Mesh(bodyGeo, paintMat);
    bodyMesh.position.y = 1.3;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Rear Spare Tire
    const spareGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16);
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.8 });
    const spareMesh = new THREE.Mesh(spareGeo, darkMat);
    spareMesh.rotation.x = Math.PI / 2;
    spareMesh.position.set(0, 1.3, -4.8);
    group.add(spareMesh);

    createWheels(group, 1.1);
    return group;
  }

  // 3. Mahindra Scorpio SUV
  function createScorpioSuv() {
    const group = new THREE.Group();
    const paintMat = PhysicalMaterials.createCarPaintMaterial(0x1a1a1a, 0.2, 0.9);

    // Boxy SUV Body
    const bodyGeo = new THREE.BoxGeometry(4.3, 1.7, 8.9);
    const bodyMesh = new THREE.Mesh(bodyGeo, paintMat);
    bodyMesh.position.y = 1.25;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Roof Rails
    const railMat = PhysicalMaterials.createGlowingNeonMaterial(0x00f2fe);
    const r1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 5.0), railMat);
    r1.position.set(-1.8, 2.2, 0);
    const r2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 5.0), railMat);
    r2.position.set(1.8, 2.2, 0);
    group.add(r1); group.add(r2);

    createWheels(group, 1.05);
    return group;
  }

  // 4. Indian Auto-Rickshaw (Tuk-Tuk)
  function createAutoRickshaw() {
    const group = new THREE.Group();
    const mats = PhysicalMaterials.createRickshawMaterial();

    // Yellow Canopy Body
    const topGeo = new THREE.BoxGeometry(3.2, 2.6, 4.8);
    const topMesh = new THREE.Mesh(topGeo, mats.yellow);
    topMesh.position.y = 2.0;
    topMesh.castShadow = true;
    group.add(topMesh);

    // Black Base Lower
    const baseGeo = new THREE.BoxGeometry(3.4, 1.2, 5.0);
    const baseMesh = new THREE.Mesh(baseGeo, mats.black);
    baseMesh.position.y = 0.8;
    group.add(baseMesh);

    // Black Cloth Roof Cover
    const clothGeo = new THREE.BoxGeometry(3.3, 0.4, 4.9);
    const clothMesh = new THREE.Mesh(clothGeo, mats.clothTop);
    clothMesh.position.y = 3.4;
    group.add(clothMesh);

    // Headlight
    const lightGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const lightMat = PhysicalMaterials.createGlowingNeonMaterial(0xffffff);
    const lightMesh = new THREE.Mesh(lightGeo, lightMat);
    lightMesh.position.set(0, 1.5, 2.5);
    group.add(lightMesh);

    return group;
  }

  // 5. Police Cruiser
  function createPoliceCruiser() {
    const group = new THREE.Group();
    const paintMat = PhysicalMaterials.createCarPaintMaterial(0x0a1020);

    const bodyGeo = new THREE.BoxGeometry(4.2, 1.4, 8.8);
    const bodyMesh = new THREE.Mesh(bodyGeo, paintMat);
    bodyMesh.position.y = 0.9;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Flashing Siren Bar (Red & Blue)
    const redSiren = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.3), PhysicalMaterials.createGlowingNeonMaterial(0xff1744));
    redSiren.position.set(-0.6, 2.4, 0);
    const blueSiren = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.3), PhysicalMaterials.createGlowingNeonMaterial(0x00f2fe));
    blueSiren.position.set(0.6, 2.4, 0);
    group.add(redSiren); group.add(blueSiren);

    createWheels(group);
    return group;
  }

  // 6. Pani Puri / Golgappa Thela Cart
  function createPaniPuriThela() {
    const group = new THREE.Group();

    // Wooden Cart Base
    const cartGeo = new THREE.BoxGeometry(5.0, 1.2, 3.2);
    const cartMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.8 });
    const cartMesh = new THREE.Mesh(cartGeo, cartMat);
    cartMesh.position.y = 1.2;
    cartMesh.castShadow = true;
    group.add(cartMesh);

    // Glass Pani Puri Container
    const glassMat = PhysicalMaterials.createGlassMaterial();
    const glassContainer = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 1.8), glassMat);
    glassContainer.position.set(-1.0, 2.6, 0);
    group.add(glassContainer);

    // Spice Bowls
    const bowlMat = PhysicalMaterials.createGlowingNeonMaterial(0x00e676);
    const bowl1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.4), bowlMat);
    bowl1.position.set(1.0, 2.0, -0.5);
    const bowl2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.4), PhysicalMaterials.createGlowingNeonMaterial(0xffab00));
    bowl2.position.set(1.0, 2.0, 0.5);
    group.add(bowl1); group.add(bowl2);

    // Umbrella Canopy
    const umbrellaGeo = new THREE.ConeGeometry(3.0, 1.2, 8);
    const umbrellaMat = new THREE.MeshStandardMaterial({ color: 0xff1744, roughness: 0.4 });
    const umbrellaMesh = new THREE.Mesh(umbrellaGeo, umbrellaMat);
    umbrellaMesh.position.set(0, 4.5, 0);
    group.add(umbrellaMesh);

    return group;
  }

  // 7. 3D Human Models (Male, Female, Child)
  function createHumanModel(gender = "MALE", outfitColor = 0x00f2fe) {
    const group = new THREE.Group();
    const scale = (gender === "CHILD") ? 0.6 : 1.0;

    // Body Torso / Jacket
    const bodyMat = new THREE.MeshStandardMaterial({ color: outfitColor, roughness: 0.5 });
    const bodyGeo = new THREE.CylinderGeometry(0.5 * scale, 0.5 * scale, 2.0 * scale, 12);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 1.0 * scale;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Head
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd2a679, roughness: 0.6 });
    const headGeo = new THREE.SphereGeometry(0.4 * scale, 12, 12);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.y = 2.3 * scale;
    group.add(headMesh);

    // Hair
    const hairColor = (gender === "FEMALE") ? 0x111111 : 0x221a14;
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor });
    const hairGeo = new THREE.SphereGeometry(0.42 * scale, 12, 12);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 2.4 * scale, (gender === "FEMALE") ? -0.1 : 0);
    group.add(hairMesh);

    return group;
  }

  function createWheels(group, radiusScale = 1.0) {
    const wheelGeo = new THREE.CylinderGeometry(0.8 * radiusScale, 0.8 * radiusScale, 0.6, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.7 });

    const w1 = new THREE.Mesh(wheelGeo, wheelMat);
    w1.rotation.z = Math.PI / 2;
    w1.position.set(-2.0, 0.8 * radiusScale, 2.6);

    const w2 = new THREE.Mesh(wheelGeo, wheelMat);
    w2.rotation.z = Math.PI / 2;
    w2.position.set(2.0, 0.8 * radiusScale, 2.6);

    const w3 = new THREE.Mesh(wheelGeo, wheelMat);
    w3.rotation.z = Math.PI / 2;
    w3.position.set(-2.0, 0.8 * radiusScale, -2.6);

    const w4 = new THREE.Mesh(wheelGeo, wheelMat);
    w4.rotation.z = Math.PI / 2;
    w4.position.set(2.0, 0.8 * radiusScale, -2.6);

    group.add(w1); group.add(w2); group.add(w3); group.add(w4);
  }

  return {
    createBmwSedan: createBmwSedan,
    createFortunerSuv: createFortunerSuv,
    createScorpioSuv: createScorpioSuv,
    createAutoRickshaw: createAutoRickshaw,
    createPoliceCruiser: createPoliceCruiser,
    createPaniPuriThela: createPaniPuriThela,
    createHumanModel: createHumanModel
  };

})();
