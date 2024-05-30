const description = {
  danger: '고온 주의!',
  hot: '더우니 주의!',
  good: '산책하기 좋은 온도',
  soso: '선선하니 좋은 온도',
  cold: '조금 쌀쌀한 온도',
  cdanger: '추우니 주의!'
};

// 현재 기온
async function initialize() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=6edee3c2aa182bc44d18ccb204c98a31&lang=kr`;
    const res = await fetch(url);
    const data = await res.json();
    const main = data.main;
    const temp = main.temp;
    const weather = data.weather[0].description;

    // 기온에 따라 적절한 요소를 보이게 설정
    if (temp >= 35) {
      showElement('danger', temp, weather);
    } else if (temp >= 28) {
      showElement('hot', temp, weather);
    } else if (temp >= 20) {
      showElement('good', temp, weather);
    } else if (temp >= 10) {
      showElement('soso', temp, weather);
    } else if (temp >= 0) {
      showElement('cold', temp, weather);
    } else {
      showElement('cdanger', temp, weather);
    }
  })
};

function showElement(id, temp, weather) {
  const element = document.getElementById(id);
  if (element) {
    element.style.display = 'flex';
    element.innerHTML = `${description[id]}<br>(현재 기온 : ${temp}°C, 날씨 : ${weather})`;
  }
}
function hideElement(id) {
  const element = document.getElementById(id);
  if (element) {
    element.style.display = 'none';
    element.innerHTML = '';
  }
}
initialize();

let map;
let currentMarker;
let markers = []; // 마커를 담을 배열
let ps; // 장소 검색 객체
const list = data.records;


function initMap(lat, lng) {
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3
  };
  map = new kakao.maps.Map(container, options);

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
}

function createMarker(lat, lng) {
  const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

  // 현재 위치
  const currentPosition = new kakao.maps.LatLng(lat, lng);

  // 공원과 현재 위치 간의 거리를 계산하는 함수 (Haversine 공식 사용)
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

  // 상위 5개의 공원을 표시
  data.slice(0, 5).forEach(park => {
    const markerPosition = new kakao.maps.LatLng(park.위도, park.경도);
    const distance = calculateDistance(lat, lng, park.위도, park.경도).toFixed(2);

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
  });
}

function searchPlaces() {
  const keyword = document.getElementById('keyword').value;

  if (!keyword.trim()) {
    alert('키워드를 입력해주세요!');
    return;
  }

  // 장소 검색 객체를 통해 키워드로 장소 검색
  ps.keywordSearch(keyword, placesSearchCB);
}

function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    displayPlaces(data);
  } else {
    alert('검색 결과가 존재하지 않습니다.');
  }
}

function displayPlaces(places) {
  const listEl = document.getElementById('results');
  listEl.innerHTML = '';

  for (let i = 0; i < places.length; i++) {
    const itemEl = document.createElement('li');
    itemEl.innerHTML = places[i].place_name;
    itemEl.onclick = () => {
      const position = new kakao.maps.LatLng(places[i].y, places[i].x);
      map.setCenter(position);

      // 현재 위치 마커 업데이트
      currentMarker.setPosition(position);
      initialize2(places[i].y, places[i].x);

      // 해당 위치를 중심으로 공원 표시
      createMarker(places[i].y, places[i].x);
    };
    listEl.appendChild(itemEl);
  }
}

function clearMarkers() {
  for (const marker of markers) {
    marker.setMap(null);
  }
  markers = []; // 마커 배열 초기화
}

// 검색창 엔터키 기능
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
  });
}, (err) => {
  console.error(err);
});

async function initialize2(plat, plng) {
  const lat = plat;
  const lng = plng;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=6edee3c2aa182bc44d18ccb204c98a31&lang=kr`;
  const res = await fetch(url);
  const data = await res.json();
  const main = data.main;
  const temp = main.temp;
  const weather = data.weather[0].description;

  // 기온에 따라 적절한 요소를 보이게 설정
  if (temp >= 35) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement('danger', temp , weather);
  } else if (temp >= 28) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement('hot', temp, weather);
  } else if (temp >= 20) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement('good', temp, weather);
  } else if (temp >= 10) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement('soso', temp, weather);
  } else if (temp >= 0) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement('cold', temp, weather);
  } else {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement('cdanger', temp, weather);
  }
};