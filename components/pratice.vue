<template>
  <div id="map" ref="map" class="map" />
</template>

<script>

import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import Map from 'ol/Map'
import { fromLonLat } from 'ol/proj'
// import { XYZ, Vector as VectorSource, Cluster } from 'ol/source'
import { XYZ, Vector as VectorSource } from 'ol/source'
// import Feature from 'ol/Feature'
// import Point from 'ol/geom/Point'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
// import Stroke from 'ol/style/Stroke'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
// import { Icon } from 'ol/style'

export default {
    name: 'PraticePage',
    data () {
        return {
            olMap: undefined,
            sectorColor: {
                종로구: 'rgba(255, 150, 150, 0.7)',
                중구: 'rgba(150, 150, 255, 0.7)',
                용산구: 'rgba(150, 255, 150, 0.7)',
                성동구: 'rgba(255, 255, 150, 0.7)',
                광진구: 'rgba(255, 192, 203, 0.7)',
                동대문구: 'rgba(255, 182, 193, 0.7)',
                중랑구: 'rgba(173, 216, 230, 0.7)',
                성북구: 'rgba(244, 164, 96, 0.7)',
                강북구: 'rgba(255, 160, 122, 0.7)',
                도봉구: 'rgba(240, 230, 140, 0.7)',
                노원구: 'rgba(192, 192, 192, 0.7)',
                은평구: 'rgba(173, 216, 230, 0.7)',
                서대문구: 'rgba(144, 238, 144, 0.7)',
                마포구: 'rgba(173, 216, 230, 0.7)',
                양천구: 'rgba(255, 255, 153, 0.7)',
                강서구: 'rgba(255, 204, 153, 0.7)',
                구로구: 'rgba(221, 160, 221, 0.7)',
                금천구: 'rgba(224, 255, 255, 0.7)',
                영등포구: 'rgba(255, 182, 193, 0.7)',
                동작구: 'rgba(210, 105, 30, 0.7)',
                관악구: 'rgba(211, 211, 211, 0.7)',
                서초구: 'rgba(255, 99, 71, 0.7)',
                강남구: 'rgba(123, 104, 238, 0.7)',
                송파구: 'rgba(173, 255, 47, 0.7)',
                강동구: 'rgba(255, 215, 0, 0.7)'
            }
        }
    },
    computed: {
        matchColor (value) {
            return this.sectorColor[value]
        }
    },
    mounted () {
        // layer1
        const vectorLayer1 = new VectorLayer({
            source: new VectorSource({
                url: '대한민국_광역자치단체_경계_2017.geojson',
                format: new GeoJSON({
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                })
            }),
            style (feature) {
                const cNum = feature.get('CTPRVN_CD')
                switch (cNum) {
                case '11' :
                    return new Style({
                    })
                default:
                    return new Style({
                        fill: new Fill({
                            color: 'rgba(0, 0, 0, 0.7)'
                        })
                    })
                }
            }
        })

        // layer2
        const vectorLayer2 = new VectorLayer({
            source: new VectorSource({
                url: '서울_자치구_경계_2017.geojson',
                format: new GeoJSON({
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                })
            }),
            style (feature) {
                const district = feature.get('SIG_CD')
                let color

                switch (district) {
                case '11110':
                    color = 'rgba(255, 150, 150, 1)'
                    break
                case '11140':
                    color = 'rgba(150, 150, 255, 1)'
                    break

                default:
                    color = 'black'
                }
                return new Style({
                    fill: new Fill({
                        color
                    })
                })
                // return new Style({
                //     fill: new Fill({
                //         color: this.sectorColor[district]
                //     })
                // })
                // return new Style({
                //     fill: new Fill({
                //         color: this.sectorColor[district]
                //     })
                // })
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
                vectorLayer1,
                vectorLayer2
            ],
            view: new View({
                center: fromLonLat([126.9779692, 37.566535]),
                zoom: 12,
                minZoom: 12,
                maxZoom: 12
            })
            // interactions: []
        })
    }
}
</script>

<style scoped>
    .map {
        width: 100vw;
        height: 100vh;
    }
</style>
