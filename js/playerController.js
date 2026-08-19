/**
 * GTA 5: Bhopal City Edition - Player Character Controller & Proximity Detector
 * Handles 3D Human Character movement (WASD Walk/Run), Camera Follow, and
 * Vehicle Enter / Exit triggers for BMW, Fortuner, Scorpio, Rickshaw, and Police Cruiser!
 */

window.PlayerController = (function() {

  let playerMesh = null;
  let isDriving = false;
  let currentVehicle = null;
  let vehicleType = "FOOT";

  let rotationY = 0;
  const moveSpeed = 0.45;

  function createPlayerMesh(scene) {
    playerMesh = Models3D.createHumanModel("MALE", 0x00f2fe);
    playerMesh.position.set(0, 0, 10);
    scene.add(playerMesh);
    return playerMesh;
  }

  function update(keys, camera, cityObjects) {
    if (isDriving && currentVehicle) return;
    if (!playerMesh) return;

    let isMoving = false;
    let moveZ = 0;
    let turnRot = 0;

    if (keys['KeyW'] || keys['ArrowUp']) {
      moveZ = -moveSpeed;
      isMoving = true;
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
      moveZ = moveSpeed * 0.6;
      isMoving = true;
    }
    if (keys['KeyA'] || keys['ArrowLeft']) {
      turnRot = 0.05;
    }
    if (keys['KeyD'] || keys['ArrowRight']) {
      turnRot = -0.05;
    }

    rotationY += turnRot;
    playerMesh.rotation.y = rotationY;

    if (isMoving) {
      const dir = new THREE.Vector3(0, 0, moveZ);
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
      playerMesh.position.add(dir);
    }

    // Camera Follow on Foot
    camera.position.x = playerMesh.position.x - Math.sin(rotationY) * 14;
    camera.position.z = playerMesh.position.z - Math.cos(rotationY) * 14;
    camera.position.y = playerMesh.position.y + 8;
    camera.lookAt(playerMesh.position.x, playerMesh.position.y + 1.5, playerMesh.position.z);

    // Check Vehicle Proximity (BMW, Fortuner, Scorpio, Rickshaw, Police)
    checkVehicleProximity(cityObjects);
  }

  function checkVehicleProximity(cityObjects) {
    const promptEl = document.getElementById('vehicle-prompt');
    if (!promptEl || !playerMesh || isDriving) {
      if (promptEl) promptEl.style.display = 'none';
      return;
    }

    const pos = playerMesh.position;
    const vehicles = [
      { mesh: cityObjects.bmw, name: "BMW M-Series Sedan" },
      { mesh: cityObjects.fortuner, name: "Toyota Fortuner 4x4" },
      { mesh: cityObjects.scorpio, name: "Mahindra Scorpio SUV" },
      { mesh: cityObjects.rickshaw, name: "Auto-Rickshaw Tuk-Tuk" },
      { mesh: cityObjects.policeCar, name: "Police Cruiser" }
    ];

    let found = null;
    for (let v of vehicles) {
      if (v.mesh && pos.distanceTo(v.mesh.position) < 7) {
        found = v;
        break;
      }
    }

    if (found) {
      promptEl.style.display = 'block';
      promptEl.textContent = `🚗 Press [F] or [E] to Drive ${found.name}!`;
      currentVehicle = found;
    } else {
      promptEl.style.display = 'none';
      currentVehicle = null;
    }
  }

  function toggleVehicleDrive() {
    if (isDriving) {
      isDriving = false;
      vehicleType = "FOOT";
      if (playerMesh) {
        playerMesh.visible = true;
        if (currentVehicle && currentVehicle.mesh) {
          playerMesh.position.copy(currentVehicle.mesh.position).add(new THREE.Vector3(3, 0, 0));
        }
      }
      document.getElementById('hud-vehicle-name').textContent = "On Foot (Walking)";
    } else if (currentVehicle) {
      isDriving = true;
      vehicleType = currentVehicle.name;
      if (playerMesh) playerMesh.visible = false;
      document.getElementById('hud-vehicle-name').textContent = `Driving: ${currentVehicle.name}`;
    }
  }

  return {
    createPlayerMesh: createPlayerMesh,
    update: update,
    toggleVehicleDrive: toggleVehicleDrive,
    isDriving: function() { return isDriving; },
    getCurrentVehicle: function() { return currentVehicle; },
    getPlayerMesh: function() { return playerMesh; }
  };

})();
