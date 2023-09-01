<script>

import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import View from 'ol/View'
import Map from 'ol/Map'
import { fromLonLat } from 'ol/proj'
import { XYZ, Vector as VectorSource, Cluster } from 'ol/source'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import GeoJSON from 'ol/format/GeoJSON'
import { Icon } from 'ol/style'

export default {
    name: 'MainMap',
    data () {
        return {
            olMap: undefined
        }
    },
    mounted () {
        this.$nextTick(() => {
            const coordinates = [
                fromLonLat([126.88527, 37.48026]),
                fromLonLat([126.8767, 37.4864])
            ]
            const features = coordinates.map(
                coord => new Feature({ geometry: new Point(coord) })
            )
            const vectorSource = new VectorSource({
                features
            })
            const clusterSource = new Cluster({
                distance: 30,
                source: vectorSource
            })
            const clusterLayer = new VectorLayer({
                source: clusterSource,
                style: this.createClusterStyleFunction()
            })
            const vectorHangjeongSource = new VectorSource({
                url: '행정구역_20230701.geojson',
                format: new GeoJSON({
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                })
            })
            const vectorHangjeong = new VectorLayer({
                source: vectorHangjeongSource,
                style (feature) {
                    const cityName = feature.get('sidonm')
                    const district = feature.get('sggnm')
                    let color
                    switch (cityName) {
                    case '서울특별시':
                        switch (district) {
                        case '종로구':
                            color = 'blue'
                            break
                        case '강남구':
                            color = 'red'
                            break
                        case '금천구':
                            color = '#0293FF'
                            break
                        default:
                            color = 'gray'
                        }
                        return new Style({
                            fill: new Fill({
                                color
                            })
                        })

                    case '인천광역시':
                        switch (district) {
                        case '미추홀구':
                            color = 'green'
                            break
                        case '계양구':
                            return null
                        default:
                            return null
                        }
                        return new Style({
                            fill: new Fill({
                                color
                            })
                        })

                    default:
                        return null
                    }
                }
            })

            this.olMap = new Map({
                target: 'map',
                layers: [
                    new TileLayer({
                        source: new XYZ({
                            url: `http://api.vworld.kr/req/wmts/1.0.0/${process.env.VWORLD_API}/Base/{z}/{y}/{x}.png`
                        })
                    }),
                    vectorHangjeong,
                    clusterLayer
                ],
                view: new View({
                    center: fromLonLat([126.88527, 37.48026]),
                    zoom: 17,
                    minZoom: 10,
                    maxZoom: 20
                }),
                controls: []
            })
        })
    },
    methods: {
        createClusterStyleFunction () {
            // Define your style function here
            const styleCache = {}

            return function (feature) {
                const size = feature.get('features').length
                let style = styleCache[size]

                if (!style) {
                    style = new Style({
                        image: new Icon({
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            src: size > 1 ? 'marker.png' : 'location.png',
                            scale: [0.1, 0.1]
                        })
                    })
                    styleCache[size] = style
                }
                return style
            }
        }
    }
}
</script>

<template>
  <div id="map" ref="map" class="main-map" />
</template>

<style scoped>
.main-map {
    width: 100vw;
    height: 100vh;
}
</style>
