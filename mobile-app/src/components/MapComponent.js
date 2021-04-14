import React, { useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Image } from 'react-native';
import carImageIcon from '../../assets/images/available_car.png';

export default function MapComponent(props) {

    const [state, setState] = useState({
        marginBottom: 0
    })

    const { mapRegion, mapStyle, nearby, onRegionChangeComplete, onPanDrag } = props;
    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            loadingEnabled
            showsMyLocationButton={false}
            style={[mapStyle, { marginBottom: state.marginBottom }]}
            region={mapRegion}
            onRegionChangeComplete={onRegionChangeComplete}
            onPanDrag={onPanDrag}
            onMapReady={() => setState({ ...state, marginBottom: 1 })}
        >
            {nearby ? nearby.map((item, index) => {
                return (
                    <Marker.Animated
                        coordinate={{ latitude: item.location ? item.location.lat : 0.00, longitude: item.location ? item.location.lng : 0.00 }}
                        key={index}
                    >
                        <Image
                            source={carImageIcon}
                            style={{ height: 40, width: 40 }}
                        />
                    </Marker.Animated>

                )
            })
                : null}

        </MapView>
    );

}
