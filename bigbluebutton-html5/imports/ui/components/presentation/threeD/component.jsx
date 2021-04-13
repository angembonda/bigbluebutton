//import React, { PureComponent } from 'react';
import React, { Component } from "react";
import PropTypes from 'prop-types';
import * as BABYLON from "babylonjs";
import 'babylonjs-loaders';
import 'babylonjs-serializers';
import { Session } from 'meteor/session';
import {sendCameraUrl, getCameraUrl, removeCameraUrl,setMeshUrl,getMeshUrl, addmesh,getNewMesh, removeUpdatedMesh, removeNewMesh } from './service';
import Button from '/imports/ui/components/button/component';

var scene;
var ground;
var objectUrl;
var startingPoint;
var currentMesh;
var redSphere;
var mesh1;


class ThreeComponent extends Component{
    constructor(props) {
    super(props);

    this.state = { useWireFrame: false, shouldAnimate: false, };
    // this._3dButtonClick = this._3dButtonClick.bind(this);
    
    }

    componentDidMount = () => {
     
      
      window.addEventListener('keydown', this.handleKeyDown, false);
      // Add Events
      window.addEventListener("resize", this.onWindowResize, false);
    
    
      var { imageUri, } = this.props;

        if(imageUri)
        {
           this.engine = new BABYLON.Engine(this.canvas, true);

            //Create Scene
            scene = new BABYLON.Scene(this.engine);
          
           // var canvas = this.engine.getRenderingCanvas();
            this.addLight();
          
            this.camera = this.addCamera(imageUri);
            BABYLON.SceneLoader.Append( uri, "", scene, function () { 
              //  scene.createDefaultCamera(true, true, false);
            })
            var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
            groundMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            groundMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            groundMaterial.emissiveColor = BABYLON.Color3.Black();
            ground = BABYLON.MeshBuilder.CreateGround("ground", {width:500, height:500 }, scene,false);
            ground.material = groundMaterial;
            ground.position.y= -1;
/*            var redMat = new BABYLON.StandardMaterial("ground", scene);
             redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            redMat.emissiveColor = BABYLON.Color3.Red();
            redSphere = BABYLON.MeshBuilder.CreateSphere("red", {diameter:5}, scene);
            redSphere.material = redMat; 
            redSphere.position.y = 2;
            redSphere.position.x -= 2; */

            scene.onPointerObservable.add((pointerInfo) => {      		
              switch (pointerInfo.type) {
              case BABYLON.PointerEventTypes.POINTERDOWN:
                if(pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh != ground) {
                            this.pointerDown(pointerInfo.pickInfo.pickedMesh);
                        }
                break;
              case BABYLON.PointerEventTypes.POINTERUP:
                            this.pointerUp();
                break;
              case BABYLON.PointerEventTypes.POINTERMOVE:  
                    
                            this.pointerMove();
              
                break;
                }
            });


        }

      this.engine.runRenderLoop(() => {
        scene.render();  
      });
    
    
    };
      
    
    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize, false);
       
       
    };


    onWindowResize = event => {
    this.engine.resize();
    };
    getGroundPosition = ()=> {
      var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
      if (pickinfo.hit) {
        return pickinfo.pickedPoint;
      }
      return null;
    };
    pointerDown = (mesh)=> {
      currentMesh = mesh;
      startingPoint = this.getGroundPosition();
      if (startingPoint) { 
      setTimeout(function () {
        scene.activeCamera.detachControl(this.canvas);
       }, 0);
      }
    };
    pointerUp = ()=> {
      if (startingPoint) {
        scene.activeCamera.attachControl(this.canvas);
        startingPoint = null;
        return;
      }
    };
    pointerMove = () =>{
      
        if (!startingPoint) {
            return;
        }
        var current = this.getGroundPosition();
        if (!current) {
            return;
        }

        var diff = current.subtract(startingPoint);
        currentMesh.locallyTranslate(diff);
        

        startingPoint = current;

    };
    addLight =()=>{
      var light = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(0, 10, 0),
        scene
      ); 
    
/*       var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
      var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets/skybox.jpg', scene);
      skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      skybox.material = skyboxMaterial;  */
    }
    addCamera = (uri) => {

      
        // ---------------ArcRotateCamera or Orbit Control----------
        var camera = new BABYLON.ArcRotateCamera(
          "Camera",
          Math.PI / 2,
          Math.PI / 4,
          4,
          BABYLON.Vector3.Zero(),
          scene
        );
        camera.inertia = 0;
        camera.angularSensibilityX = 250;
        camera.angularSensibilityY = 250;
    
        // This attaches the camera to the canvas
        camera.attachControl(this.canvas, true);
        camera.setPosition(new BABYLON.Vector3(10, 20, 10));
/*         mesh1 = BABYLON.SceneLoader.ImportMesh("BJS-3D-logo_light.000", uri,"", scene, function () { 
          //  scene.createDefaultCamera(true, true, false);
        }); */
        mesh1 = BABYLON.SceneLoader.Append( uri, "", scene, function () { 
          //  scene.createDefaultCamera(true, true, false);
        })

        camera.setTarget(BABYLON.Vector3.Zero());
        camera.keysLeft = []
        camera.keysRight = []
        camera.keysUp = []
        camera.keysDown = []
        

        return camera;
        
       
      };
    handleKeyDown = event =>  {

      if (event.key === 'a')  this.camera.alpha = this.camera.alpha + 0.06; // A
      if (event.key === 'w') this.camera.beta = this.camera.beta + 0.06 // W
      if (event.key === 's') this.camera.beta = this.camera.beta - 0.06; // S
      if (event.key === 'd') this.camera.alpha = this.camera.alpha - 0.06; // D
      
    };
 /*    onPointerDown = event => {
      if (event.button !== 0) {
          return;
      }
        debugger;
      // check if we are under a mesh
      var pickInfo = scene.pick(scene.pointerX, scene.pointerY);
      if (pickInfo.hit) {
          currentMesh = pickInfo.pickedMesh;
          startingPoint = this.getGroundPosition(event);

          if (startingPoint) { // we need to disconnect camera from canvas
              setTimeout(function () {
                  scene.activeCamera.detachControl(this.canvas);
              }, 0);
          }
      }
    };

    onPointerUp =  () => {
      if (startingPoint) {
          scene.activeCamera.attachControl(this.canvas, true);
          startingPoint = null;
          return;
      }
    }

    onPointerMove = event => {
      if (!startingPoint) {
          return;
      }

      var current = this.getGroundPosition(event);

      if (!current) {
          return;
      }

      var diff = current.subtract(startingPoint);
      //currentMesh.position.addInPlace(diff);
      currentMesh.locallyTranslate(diff);
     
     

      startingPoint = current;
    }

 */

    Download=()=> {
      var filename ="scene"
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
      var serializedScene = BABYLON.SceneSerializer.Serialize(scene);
      var strScene = JSON.stringify(serializedScene);
      if (filename.toLowerCase().lastIndexOf(".babylon") !== filename.length - 8 || filename.length < 9) {
        filename += ".babylon";
      }
      var blob = new Blob([strScene], { type: "octet/stream" });
      // turn blob into an object URL; saved as a member, so can be cleaned out later
      objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);
      var link = window.document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      var click = document.createEvent("MouseEvents");
      click.initEvent("click", true, false);
      link.dispatchEvent(click);
 
    };
  

    ViewerSceneHandler = ()=> {
      
      try{
        var CameraUrl = getCameraUrl();
        var MeshUrl = getMeshUrl();
        this.camera.position=JSON.parse(CameraUrl);
        removeCameraUrl();
        var newMesh=scene.getMeshByName("BJS-3D-logo_light.000");
        newMesh.position = JSON.parse(MeshUrl);
     

      }
      catch(err){console.log(err);}
    };
   

render() {
   var { svgHeight,svgWidth,isPresenter, } = this.props;
  
  if(this.handleKeyDown)
  { if (isPresenter)
    {
      try{

        sendCameraUrl(JSON.stringify(this.camera.position));
        var newMesh=scene.getMeshByName("BJS-3D-logo_light.000");
        setMeshUrl(JSON.stringify(newMesh.position));
        
      }
      catch(err){console.log(err);}
      
    }else
    {this.ViewerSceneHandler();}
  }
  


    return (
      <div>
        
        <Button onClick={this.Download}>save Scene</Button>
       
       
        
        <div>
          <canvas
          style={{ width: svgWidth, height: svgHeight }}
          ref={canvas => {
              this.canvas = canvas;
          }} 
          />
        </div>
      </div>
      
    );
}
}
export default ThreeComponent;
ThreeComponent.propTypes={

  isViewer: PropTypes.bool.isRequired,
  isPresenter: PropTypes.bool.isRequired,
    // Image Uri
  imageUri: PropTypes.string.isRequired,
  // Width of the slide (Svg coordinate system)
  svgWidth: PropTypes.number.isRequired,
  // Height of the slide (Svg coordinate system)
  svgHeight: PropTypes.number.isRequired,
};