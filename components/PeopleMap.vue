<template>
  <div id="map" ref="kmap" class="people-map" />
</template>
<script>

export default {
    name: 'PeopleMap',
    data () {
        return {
            map: null,
            coordiParam: {
                11110: {
                    x: 126.9773213,
                    y: 37.59491732,
                    color: '#FF5733'
                },
                11140: {
                    x: 126.9959681,
                    y: 37.56014356,
                    color: '#FFC300'
                },
                11170: {
                    x: 126.979907,
                    y: 37.53138497,
                    color: '#FF33E0'
                },
                11200: {
                    x: 127.0410585,
                    y: 37.55102969,
                    color: '#33FF5E'

                },
                11215: {
                    x: 127.0857435,
                    y: 37.54670608,
                    color: '#334BFF'

                },
                11230: {
                    x: 127.0548481,
                    y: 37.58195655,
                    color: '#FF33BB'

                },
                11260: {
                    x: 127.0928803,
                    y: 37.59780259,
                    color: '#33F5FF'

                },
                11290: {
                    x: 127.0175795,
                    y: 37.6057019,
                    color: '#8A33FF'
                },
                11305: {
                    x: 127.011189,
                    y: 37.64347391,
                    color: '#FF9133'

                },
                11320: {
                    x: 127.0323688,
                    y: 37.66910208,
                    color: '#33FFB2'

                },
                11350: {
                    x: 127.0750347,
                    y: 37.65251105,
                    color: '#CC33FF'

                },
                11380: {
                    x: 126.9270229,
                    y: 37.61921128,
                    color: '#3394FF'

                },
                11410: {
                    x: 126.9390631,
                    y: 37.57778531,
                    color: '#FF3371'

                },
                11440: {
                    x: 126.90827,
                    y: 37.55931349,
                    color: '#33FFD8'

                },
                11470: {
                    x: 126.8554777,
                    y: 37.52478941,
                    color: '#33FF7D'

                },
                11500: {
                    x: 126.822807,
                    y: 37.56123543,
                    color: '#FF8C33'

                },
                11530: {
                    x: 126.8563006,
                    y: 37.49440543,
                    color: '#336BFF'

                },
                11545: {
                    x: 126.9008202,
                    y: 37.46056756,
                    color: '#FFB433'

                },
                11560: {
                    x: 126.9101695,
                    y: 37.52230829,
                    color: '#F433FF'

                },
                11590: {
                    x: 126.9516415,
                    y: 37.49887688,
                    color: '#33FFA3'

                },
                11620: {
                    x: 126.9453372,
                    y: 37.46737569,
                    color: '#33FF36'

                },
                11650: {
                    x: 127.0312203,
                    y: 37.47329547,
                    color: '#FF33F0'

                },
                11680: {
                    x: 127.0629852,
                    y: 37.49664389,
                    color: '#FF33AC'

                },
                11710: {
                    x: 127.115295,
                    y: 37.50561924,
                    color: '#33FF2B'

                },
                11740: {
                    x: 127.1470118,
                    y: 37.55045024,
                    color: '#3378FF'
                }
            }
        }
    },
    mounted () {
        if (window.kakao && window.kakao.maps) {
            this.initMap()
        } else {
            const script = document.createElement('script')
            script.src =
                '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=cb2a3115c41241e5e85df10a385b544c'
            /* global kakao */
            script.onload = () => kakao.maps.load(this.initMap)
            document.head.appendChild(script)
        }
    },
    methods: {
        // 코드정리 ㄱㄱ
        initMap () {
            const options = {
                center: new kakao.maps.LatLng(37.566535, 126.9779692),
                level: 8,
                tileAnimation: false
            }
            const map = new kakao.maps.Map(this.$refs.kmap, options)
            this.map = map

            this.seoulPolygon()
            this.seoulSubPolygon()
        },
        async seoulPolygon () {
            const coordinateData = await this.asyncData('/korea.geojson')
            const featuresData = coordinateData.features[0].geometry.coordinates[0][0]
            const path = []
            featuresData.forEach((item) => {
                path.push(new kakao.maps.LatLng(item[1], item[0]))
            })
            this.drawPolygon(
                {
                    path,
                    strokeWeight: 5,
                    strokeColor: '#212121',
                    strokeOpacity: 0.6
                }
            )
        },
        async seoulSubPolygon () {
            const coordinateData = await this.asyncData('/seoul.geojson')
            const featuresData = coordinateData.features
            for (let i = 0; i < featuresData.length; i++) {
                const axis = featuresData[i].geometry.coordinates[0]
                const path = []
                axis.forEach((item) => {
                    path.push(new kakao.maps.LatLng(item[1], item[0]))
                })

                this.drawPolygon({
                    path,
                    strokeWeight: 0,
                    strokeColor: 'gray',
                    fillColor: this.coordiParam[featuresData[i].properties.SIG_CD].color,
                    fillOpacity: 1
                })

                this.OverlayText({
                    content: `<div style="font-weight: bold;">${featuresData[i].properties.SIG_KOR_NM}</div>`,
                    position: new kakao.maps.LatLng(this.coordiParam[featuresData[i].properties.SIG_CD].y, this.coordiParam[featuresData[i].properties.SIG_CD].x)
                })

                // kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
                //     polygon.setOptions({ fillOpacity: 0.8 })
                //     console.log('asdasdasds', kakao.maps.polygon)
                //     customOverlay.setContent('<div style="font-weight: bold; color: black; font-size: 18px; z-index: 10000">빵빵이</div>')
                //
                //     // customOverlay.setPosition(new kakao.maps.LatLng(this.coordiParam[featuresData[i].properties.SIG_CD].y, this.coordiParam[featuresData[i].properties.SIG_CD].x))
                //     customOverlay.setMap(this.map)
                // })
                // kakao.maps.event.addListener(polygon, 'mouseout', function () {
                //     polygon.setOptions({ fillColor: '#fff' })
                //     customOverlay.setMap(null)
                // })
            }
        },
        async asyncData (path) {
            try {
                const response = await fetch(path)
                return await response.json()
            } catch (error) {
                return { jsonData: null }
            }
        },
        drawPolygon (params) {
            const polygon = new kakao.maps.Polygon(params)
            polygon.setMap(this.map)
        },
        OverlayText (params) {
            const customOverlay = new kakao.maps.CustomOverlay(params)
            customOverlay.setMap(this.map)
        }

    }
}
</script>

<style scoped>
    .people-map {
        width: 100vw;
        height: 100vh;
    }
</style>
