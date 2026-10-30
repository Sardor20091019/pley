package uz.pley.app.presentation.map

object MapDarkStyle {
    val JSON: String = """
        [
          {
            "elementType": "geometry",
            "stylers": [
              { "color": "#0F1117" }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              { "visibility": "off" }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#757B8A" }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              { "color": "#0F1117" }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              { "color": "#272E3F" }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#9CA3AF" }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#D1D5DB" }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#6B7280" }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              { "color": "#121C1A" }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#4B7C6F" }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              { "color": "#1A1F2C" }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#6B7280" }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
              { "color": "#22293A" }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              { "color": "#2C354B" }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
              { "color": "#37425E" }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
              { "color": "#1A1F2C" }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              { "color": "#080C14" }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              { "color": "#3B4252" }
            ]
          }
        ]
    """.trimIndent()
}

