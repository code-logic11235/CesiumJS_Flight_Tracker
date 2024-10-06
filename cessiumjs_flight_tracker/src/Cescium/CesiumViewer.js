// src/CesiumViewer.js
import React, { useEffect } from 'react';
import {
    Cartesian3,
    createOsmBuildingsAsync,
    Ion,
    Math as CesiumMath,
    Terrain,
    Viewer
} from 'cesium'; // Import all necessary components
import 'cesium/Build/Cesium/Widgets/widgets.css'; // Ensure CSS is included

const CesiumViewer = () => {
    useEffect(() => {
        // Set the base URL for Cesium's static files
        window.CESIUM_BASE_URL = '/cesium/'; // Adjust this as necessary

        // Set your access token
        Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_ACCESS_TOKEN;

        // Initialize the Cesium Viewer
        const viewer = new Viewer('cesiumContainer', {
            terrain: Terrain.fromWorldTerrain(),
        });

        // Check if the viewer is initialized properly
        if (!viewer) {
            console.error('Failed to initialize Cesium viewer.');
            return; // Exit if viewer is not initialized
        }

        // Fly the camera to San Francisco
        viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
            orientation: {
                heading: CesiumMath.toRadians(0.0),
                pitch: CesiumMath.toRadians(-15.0),
            },
        });

        // Use an async function to add OSM buildings
        const addBuildings = async () => {
            try {
                const buildingTileset = await createOsmBuildingsAsync();
                viewer.scene.primitives.add(buildingTileset);
            } catch (error) {
                console.error('Error adding buildings:', error);
            }
        };

        addBuildings(); // Call the async function

        return () => {
            viewer.destroy(); // Cleanup on component unmount
        };
    }, []);

    return <div id="cesiumContainer" style={{ width: '100%', height: '100vh' }} />;
};

export default CesiumViewer;