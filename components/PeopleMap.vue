<template>
  <div class="people-main">
    <div id="map" ref="kmap" class="people-map" />
    <div class="bottom-info">
      <h3 class="txt">
        인구분포범례
      </h3>
      <table class="range-box">
        <tbody>
          <tr>
            <th class="num1">
              여유
            </th>
            <th class="num2">
              조금여유
            </th>
            <th class="num3">
              보통
            </th>
            <th class="num4">
              조금혼잡
            </th>
            <th class="num5">
              혼잡
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>

export default {
    name: 'PeopleMap',
    data () {
        return {
            map: null
            // coordi: this.$store.state.main.coordiParam
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
                tileAnimation: false,
                draggable: false,
                scrollwheel: false,
                disableDoubleClick: true,
                disableDoubleClickZoom: true
            }
            const map = new kakao.maps.Map(this.$refs.kmap, options)
            this.map = map

            this.seoulSubPolygon()
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

                const polygon = this.drawPolygon({
                    path,
                    strokeWeight: 3,
                    strokeColor: '#FDFDFD',
                    fillColor: this.$calcWeekAgoRate1(this.$store.state.main.coordiParam[featuresData[i].properties.SIG_CD].rating),
                    fillOpacity: 0.5,
                    strokeOpacity: 1
                })

                this.OverlayText({
                    content: `<div style="font-weight: bold;">${featuresData[i].properties.SIG_KOR_NM}</div>`,
                    position: new kakao.maps.LatLng(this.$store.state.main.coordiParam[featuresData[i].properties.SIG_CD].y, this.$store.state.main.coordiParam[featuresData[i].properties.SIG_CD].x)
                })

                kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
                    polygon.setOptions({ fillOpacity: 1 })
                })

                kakao.maps.event.addListener(polygon, 'mouseout', function (mouseEvent) {
                    polygon.setOptions({ fillOpacity: 0.5 })
                })
                kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
                    this.map.setCenter(new kakao.maps.LatLng(this.$store.state.main.coordiParam[featuresData[i].properties.SIG_CD].y, this.$store.state.main.coordiParam[featuresData[i].properties.SIG_CD].x))
                })
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
            return polygon
        },
        OverlayText (params) {
            const customOverlay = new kakao.maps.CustomOverlay(params)
            customOverlay.setMap(this.map)
        }

    }
}
</script>

<style lang="scss" scoped>
    @import '~assets/css/main.scss';
</style>
