const description = {
  danger: '고온 주의!',
  hot: '더우니 주의!',
  good: '산책하기 좋은 온도',
  soso: '선선하니 좋은 온도',
  cold: '조금 쌀쌀한 온도',
  cdanger: '추우니 주의!'
};

// 현재 기온을 가져와서 적절한 메시지를 표시하는 함수
async function initialize() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=6edee3c2aa182bc44d18ccb204c98a31&lang=kr`;
    const res = await fetch(url);
    const data = await res.json();
    const main = data.main;
    const temp = main.temp;
    const temp2 = temp.toFixed(1); // 소수점 첫째 자리까지 표시
    const weatherIconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
    // 아이콘을 표시할 요소
    const weatherIconEl = document.createElement('img');
    weatherIconEl.src = iconUrl;
    weatherIconEl.style.width = '100px'; // 아이콘의 크기 조정
    weatherIconEl.style.height = '100px';
    // weatherIconEl.style.marginBottom = '70px'; // 아이콘과 텍스트 사이의 간격
    // weatherIconEl.style.marginRight = '30px'; // 아이콘과 텍스트 사이의 간격


    // 기온에 따라 적절한 요소를 보이게 설정
    if (temp >= 35) {
      showElement('danger', temp2, weatherIconEl);
    } else if (temp >= 28) {
      showElement('hot', temp2, weatherIconEl);
    } else if (temp >= 20) {
      showElement('good', temp2, weatherIconEl);
    } else if (temp >= 10) {
      showElement('soso', temp2, weatherIconEl);
    } else if (temp >= 0) {
      showElement('cold', temp2, weatherIconEl);
    } else {
      showElement('cdanger', temp2,weatherIconEl);
    }
  });
}

// 적절한 요소를 보이게 설정하는 함수
function showElement(id, temp, iconElement) {
  const element = document.getElementById(id);
  if (element) {
    element.style.display = 'flex';
    element.style.alignItems = 'center'; // 수직 가운데 정렬
    element.innerHTML = `${description[id]}<br>(현재 기온 : ${temp}°C)`;
    const span = document.createElement('span');
    span.appendChild(iconElement); // 아이콘을 span에 추가
    element.appendChild(span); // span을 element에 추가

    // danger 요소일 경우 blink 클래스를 추가하고 경고 메시지 창을 띄움
    if (id === 'danger') {
      element.classList.add('blink');
      showAlert('고온 주의! 외출을 삼가하세요.');

      // 5초 후에 blink 클래스를 제거하여 깜빡이는 효과를 멈춤
      setTimeout(() => {
        element.classList.remove('blink');
      }, 5000); // 5000ms = 5초
    }
  }
}

// 경고 메시지 창을 표시하는 함수
function showAlert(message) {
  const mapContainer = document.getElementById('map');
  const alertBox = document.createElement('div');
  alertBox.className = 'alert-box';
  alertBox.innerText = message;

  mapContainer.appendChild(alertBox);

  setTimeout(() => {
    alertBox.style.opacity = '0';
    setTimeout(() => {
      mapContainer.removeChild(alertBox);
    }, 500); // 500ms = 0.5초
  }, 5000); // 5000ms = 5초
}

// 요소를 숨기는 함수
function hideElement(id) {
  const element = document.getElementById(id);
  if (element) {
    element.style.display = 'none';
    element.innerHTML = '';
  }
}

// 페이지 로드 시 초기화
initialize();

let map;
let currentMarker;
let markers = []; // 마커를 담을 배열
let ps; // 장소 검색 객체
const list = data.records;

// 지도 초기화 함수
function initMap(lat, lng) {
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3
  };
  map = new kakao.maps.Map(container, options);

  // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
  var mapTypeControl = new kakao.maps.MapTypeControl();

  // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
  // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
  map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

  // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
  var zoomControl = new kakao.maps.ZoomControl();
  map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

  // 현재 위치 마커
  const markerPosition = new kakao.maps.LatLng(lat, lng);
  currentMarker = new kakao.maps.Marker({
    position: markerPosition,
    map: map,
    title: "현재 위치"
  });

  // 현재 위치 인포윈도우
  const currentInfoWindow = new kakao.maps.InfoWindow({
    content: '<div style="width:150px; height:23px; padding:5px; text-align:center; background-color:lightblue;">현재 위치</div>'
  });

  // 현재 위치 마커에 마우스 오버/아웃 이벤트 추가
  kakao.maps.event.addListener(currentMarker, 'mouseover', function () {
    currentInfoWindow.open(map, currentMarker);
  });

  kakao.maps.event.addListener(currentMarker, 'mouseout', function () {
    currentInfoWindow.close();
  });

  // 장소 검색 객체 생성
  ps = new kakao.maps.services.Places();

  // 지도에 터치 이벤트 추가
  addTouchEvents();
}

// 지도에 터치 이벤트를 추가하는 함수
function addTouchEvents() {
  const mapContainer = document.getElementById('map');

  // 터치 시작 이벤트
  mapContainer.addEventListener('touchstart', (event) => {
    console.log('Touch Start:', event.touches);
  });

  // 터치 이동 이벤트
  mapContainer.addEventListener('touchmove', (event) => {
    console.log('Touch Move:', event.touches);
  });

  // 터치 종료 이벤트
  mapContainer.addEventListener('touchend', (event) => {
    console.log('Touch End:', event.changedTouches);
  });
}

// 공원 마커를 생성하는 함수
function createMarker(lat, lng) {
  const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

  // Haversine 공식을 사용하여 두 지점 간의 거리를 계산하는 함수
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 지구 반지름 (단위: km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // 공원 데이터를 거리순으로 정렬
  data.sort((a, b) => {
    const distanceA = calculateDistance(lat, lng, a.위도, a.경도);
    const distanceB = calculateDistance(lat, lng, b.위도, b.경도);
    return distanceA - distanceB;
  });

  // 현재 지도에 표시된 마커들을 모두 제거
  clearMarkers();

  // 거리를 기준으로 데이터를 슬라이스한 후 마커와 인포윈도우 생성
  data.forEach(park => {
    const markerPosition = new kakao.maps.LatLng(park.위도, park.경도);
    const distance = calculateDistance(lat, lng, park.위도, park.경도).toFixed(2);

    // 원하는 거리 기준을 설정합니다.
    if (distance <= 2.0) {
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        map: map,
        title: park.공원명,
        image: new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(24, 35)),
      });
      markers.push(marker); // 마커를 배열에 추가

      // 인포윈도우 내용 구성
      const infowindowContent = `
          <div style="text-align: center; background-color: lightyellow; padding: 10px; white-space: nowrap;">
              <h4 style="margin: 0;">${park.공원명}</h4>
              <p style="margin: 0;">주소: ${park.소재지지번주소}</p>
              <p style="margin: 0;">직선거리: ${distance} km</p>
          </div>
      `;
      const infowindow = new kakao.maps.InfoWindow({
        content: infowindowContent
      });

      kakao.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.open(map, marker);
      });

      kakao.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
      });

      // 마커에 클릭 이벤트 추가
      kakao.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
      });

      // 인포윈도우에 클릭 이벤트 추가하여 클릭 시 닫히도록 설정
      kakao.maps.event.addListener(infowindow, 'domready', function () {
        const iwContent = document.querySelector('.wrap');
        if (iwContent) {
          iwContent.addEventListener('click', function () {
            infowindow.close();
          });
        }
      });

      // 지도를 클릭하면 인포윈도우가 닫히도록 설정
      kakao.maps.event.addListener(map, 'click', function () {
        infowindow.close();
      });
    }
  });
}

// 장소 검색 함수
function searchPlaces() {
  const keyword = document.getElementById('keyword').value;

  if (!keyword.trim()) {
    alert('키워드를 입력해주세요!');
    return;
  }

  // 장소 검색 객체를 통해 키워드로 장소 검색
  ps.keywordSearch(keyword, placesSearchCB);
}

// 장소 검색 콜백 함수
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    displayPlaces(data);
  } else {
    alert('검색 결과가 존재하지 않습니다.');
  }
}

// 검색 결과를 화면에 표시하는 함수
function displayPlaces(places) {
  const listEl = document.getElementById('results');
  listEl.innerHTML = '';

  for (let i = 0; i < places.length; i++) {
    const itemEl = document.createElement('li');
    // address_name의 첫 번째 단어 추출
    const firstWord = places[i].address_name.split(' ')[0];

    itemEl.innerHTML = places[i].place_name + ' (' + firstWord + ')';

    // 클로저를 사용하여 place_name을 initialize2 함수에 전달
    (function (place_name, y, x) {
      itemEl.onclick = () => {
        const position = new kakao.maps.LatLng(places[i].y, places[i].x);
        map.setCenter(position);

        // 현재 위치 마커 업데이트
        currentMarker.setPosition(position);

        // initialize2 함수 호출 시 place_name 전달
        initialize2(y, x, place_name);

        // 해당 위치를 중심으로 공원 표시
        createMarker(y, x);
      };
    })(places[i].place_name, places[i].y, places[i].x);

    listEl.appendChild(itemEl);
  }
}

// 지도에 표시된 마커들을 모두 제거하는 함수
function clearMarkers() {
  for (const marker of markers) {
    marker.setMap(null);
  }
  markers = []; // 마커 배열 초기화
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('keyword').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      searchPlaces();
    }
  });

  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    initMap(lat, lng);

    // 현재 위치 마커 업데이트
    const newPosition = new kakao.maps.LatLng(lat, lng);
    currentMarker.setPosition(newPosition);

    // 현재 위치를 중심으로 공원 다시 표시
    createMarker(lat, lng);
  }, (err) => {
    console.error(err);
  });
});

// 적절한 요소를 보이게 설정하는 함수
function showElement2(id, temp, place, icon) {
  const element = document.getElementById(id);
  if (element) {
    element.style.display = 'flex';
    element.innerHTML = `${description[id]}<br>(${place}의 현재 기온 : ${temp}°C)`;
    const span = document.createElement('span');
    span.appendChild(icon); // 아이콘을 span에 추가
    element.appendChild(span); // span을 element에 추가

    // danger 요소일 경우 blink 클래스를 추가하여 깜빡이는 효과를 줌
    if (id === 'danger') {
      element.classList.add('blink');
      showAlert('고온 주의! 외출을 삼가하세요.');

      // 5초 후에 blink 클래스를 제거하여 깜빡이는 효과를 멈춤
      setTimeout(() => {
        element.classList.remove('blink');
      }, 5000); // 5000ms = 5초
    }
  }
}

// 특정 위치의 날씨 정보를 다시 가져와서 화면에 표시하는 함수
async function initialize2(plat, plng, place) {
  const lat = plat;
  const lng = plng;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=6edee3c2aa182bc44d18ccb204c98a31&lang=kr`;
  const res = await fetch(url);
  const data = await res.json();
  const main = data.main;
  const temp = main.temp;
  const temp2 = temp.toFixed(1);
  const weatherIconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

  const weatherIconEl = document.createElement('img');
  weatherIconEl.src = iconUrl;
  weatherIconEl.style.width = '100px'; // 아이콘의 크기 조정
  weatherIconEl.style.height = '100px';
  weatherIconEl.style.marginBottom = '70px'; // 아이콘과 텍스트 사이의 간격
  weatherIconEl.style.marginRight = '30px'; // 아이콘과 텍스트 사이의 간격


  // 기온에 따라 적절한 요소를 보이게 설정
  if (temp >= 35) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement2('danger', temp2, place, weatherIconEl);
  } else if (temp >= 28) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement2('hot', temp2, place, weatherIconEl);
  } else if (temp >= 20) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement2('good', temp2, place, weatherIconEl);
  } else if (temp >= 10) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement2('soso', temp2, place, weatherIconEl);
  } else if (temp >= 0) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement2('cold', temp2, place, weatherIconEl);
  } else {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement2('cdanger', temp2, place, weatherIconEl);
  }
}
