export const customMapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff" // Light background
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#000000" // Dark text for contrast
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff" // Light stroke for text
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c9e7f0" // Light blue water
            }
        ]
    }
];


export const indiaInitialRegion = {
    latitude: 28.6139,
    longitude: 77.2090,
    // latitude: 24.2413136,
    // longitude: 88.2416204,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
}
