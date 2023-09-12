import './App.css';
import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

function Camera() {
  const { camera } = useThree();
  camera.position.x = 30;
  camera.position.y = 0;
  camera.position.z = -30;
  camera.lookAt(0, 0, 0);
  return null;
}


function Shape(props) {

  const mesh = useRef();
  useFrame(() => {
    mesh.current.rotation.y += 0.005;
  });


  const allShapes = {
    box: new THREE.BoxGeometry(props.dimensions.height, props.dimensions.width, props.dimensions.length),
    cylinder: new THREE.CylinderGeometry(1, 1, 1, 32),
    donut: new THREE.TorusGeometry(0.5, 0.2, 3, 20)
  }

  const innerDimensions = {
    height: props.dimensions.height * 1,
    width: props.dimensions.width * 1,
    length: props.dimensions.length * 1,
  };

  const shapeGeometry = allShapes[props.shape] || allShapes.box;

  const allColors = {
    box: "gray",
    cylinder: "pink",
    donut: "blue"
  }

  return (
    <mesh {...props} ref={mesh} scale={[0.15, 0.15, 0.15]}>
      <primitive object={shapeGeometry} attach={"geometry"} />
      <meshStandardMaterial color={allColors[props.shape]} depthTest={false} />

      <mesh position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
        <primitive object={new THREE.BoxGeometry(innerDimensions.height, innerDimensions.width, innerDimensions.length)} attach={"geometry"} />
        <meshStandardMaterial color={"#FFFFFF"} transparent alphaTest={0.2} />
      </mesh>
    </mesh>
  );
}

function handleInputChange(e) {
  const max = e.target.id === 'boxHeight' ? 200 : 100;
  const min = 0;
  let inputValue = parseFloat(e.target.value);

  if (inputValue > max) {
    inputValue = max;
  } else if (inputValue < min) {
    inputValue = min;
  }

  e.target.value = inputValue;
}

export default function App() {
  const initialShape = 
    <Shape
      shape={"box"}
      dimensions={{ height: 100, width: 100, length: 10 }}
      key={0}
      position={[0, 0, 0]}
    />

  const [shapesOnCanvas, setShapesOnCanvas] = useState([initialShape])

  const addShape = (e) => {

    // Store the length of the shapeOnCanvas, to know how many there are, We also use this to calculate the position
    const shapeCount = shapesOnCanvas.length
    const min = e.target.id === 50;

    // Access the button data-Attribute to know what shape we are adding
    const shape = e.target.getAttribute("data-shape")

    // Get the values of the inputs
    const height = parseFloat(document.getElementById('boxHeight').value) * window.innerHeight / 500;
    const width = parseFloat(document.getElementById('boxWidth').value) * window.innerHeight / 500;

    if (height.value < min) {
      height.value = min;
    }

    if (width.value < min) {
      width.value = min;
    }

    const length = 10 * window.innerHeight / 500;
    console.log("Box details", height, width, length);
    console.log(shape);

    // Create the new shape
    const newShape =
      <Shape
        shape={shape}
        dimensions={{ height, width, length }}
        key={shapeCount}
        position={[0, 0, 0]} // Use totalWidth as the x-coordinate
      />

    resetShapes()
    setShapesOnCanvas(prevShapes => [...prevShapes, newShape]);
  }

  const resetShapes = () => {
    setShapesOnCanvas([])
  }

  return (
    <div>
      <h1>Imagine your Personal window </h1>
      <div style={{ width: "100%", height: "80vh" }}>
        <Canvas className='canvas'>
          <Camera />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={1.5} />

          {[...shapesOnCanvas]}

          <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </div>
      <div className="row">
        <div className="column">
          <input type="number" placeholder="Height in cm (0 - 100 cm)" id="boxWidth" min="0" max="100" onChange={handleInputChange} />
          <input type="number" placeholder="Width in cm (0 - 200 cm)" id="boxHeight" min="0" max="200" onChange={handleInputChange} />
        </div>
        <div className="column">
          <button onClick={addShape} data-shape={"box"}>Create custom Window</button>
          <button onClick={resetShapes}>Reset</button> {/* Add this line */}
        </div>
      </div>
    </div>
  );
}


