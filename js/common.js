// 로딩화면에서 다음 페이지 완전히 로드된 후 이동
document.addEventListener("DOMContentLoaded", function() {
  // console.log("restpark.html has loaded.");
  // 로컬 스토리지에 로드 완료 플래그를 설정합니다.
  localStorage.setItem('restparkLoaded', 'true');
});

const description = {
  danger: '열사병 주의!',
  hot: '더우니 조심!',
  good: '산책하기 좋은 온도',
  soso: '선선하니 좋은 온도',
  cold: '조금 쌀쌀한 온도',
  cdanger: '저체온증 주의!'
};

// 평균 걸음 길이 (단위: 미터)
const averageStepLength = 0.75;

// 면적을 이용해 둘레와 걸음수를 계산하는 함수
function calculateSteps(area) {
  const radius = Math.sqrt(area / Math.PI); // 반지름 계산
  const circumference = 2 * Math.PI * radius; // 둘레 계산
  const steps = Math.round(circumference / averageStepLength); // 걸음수 계산
  return steps;
}

// 현재 기온을 가져와서 적절한 메시지를 표시하는 함수
async function initialize() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
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

    // 기온에 따라 적절한 요소를 보이게 설정
    if (temp >= 35) {
      showElement('danger', temp2, weatherIconEl);
      changeScrollbarColor('danger');
      changeScrollbarColor2('danger');
      changeSearchButton('danger');
      // changeScrollbar('danger');
    } else if (temp >= 28) {
      showElement('hot', temp2, weatherIconEl);
      changeScrollbarColor('hot');
      changeScrollbarColor2('hot');
      changeSearchButton('hot');
      // changeScrollbar('hot');
    } else if (temp >= 20) {
      showElement('good', temp2, weatherIconEl);
      changeScrollbarColor('good');
      changeScrollbarColor2('good');
      changeSearchButton('good');
      // changeScrollbar('good');
    } else if (temp >= 10) {
      showElement('soso', temp2, weatherIconEl);
      changeScrollbarColor('soso');
      changeScrollbarColor2('soso');
      changeSearchButton('soso');
      // changeScrollbar('soso');
    } else if (temp >= 0) {
      showElement('cold', temp2, weatherIconEl);
      changeScrollbarColor('cold');
      changeScrollbarColor2('cold');
      changeSearchButton('cold');
      // changeScrollbar('cold');
    } else {
      showElement('cdanger', temp2, weatherIconEl);
      changeScrollbarColor('cdanger');
      changeScrollbarColor2('cdanger');
      changeSearchButton('cdanger');
      // changeScrollbar('cdanger');
    }
  });
}

function panTo() {
  const panto = document.getElementById('panTo');
  // Clear the map container
  const mapContainer = document.getElementById('map');
  mapContainer.innerHTML = ''; // Remove all child elements
  mapContainer.appendChild(panto);

  // 이동할 위도 경도 위치를 생성합니다 
  var moveLatLon = new kakao.maps.LatLng(lat, lng);
  initMap(lat, lng);
  clearMarkers();
  createMarker(lat, lng);
  initialize2(lat, lng, '현위치');
  // 지도 중심을 부드럽게 이동시킵니다
  // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
  map.panTo(moveLatLon);
}
// 현위치로 돌아오는 단축키
document.addEventListener('keydown', (event) => {
  if (event.code === 'Tab') {
    panTo();
  }
});

// 적절한 요소를 보이게 설정하는 함수
function showElement(id, temp, iconElement) {
  const element = document.getElementById(id);
  if (element) {
    element.style.display = 'flex';
    element.style.alignItems = 'center'; // 수직 가운데 정렬
    element.innerHTML = `${description[id]}<br>(현재 기온 : ${temp}°C)`;
    const span = document.createElement('span');
    span.id = `${id}-span`
    span.appendChild(iconElement); // 아이콘을 span에 추가
    element.appendChild(span); // span을 element에 추가

    // danger 및 cdanger 요소일 경우 blink 클래스를 추가하고 경고 메시지 창을 띄움
    if (id === 'danger' || id === 'cdanger') {
      element.classList.add('blink');
      showAlert(`${description[id]} 외출을 삼가하세요.`);

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
  alertBox.innerHTML = message;

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

// id에 따라 nav-black을 변경하는 함수
function changeScrollbarColor2(id) {
  const elements = document.getElementsByClassName('nav-black');
  if (elements.length > 0) {
    let color;
    switch (id) {
      case 'danger':
        color = '#890000';
        break;
      case 'cdanger':
        color = '#000089';
        break;
      case 'hot':
        color = '#ce8a8a';
        break;
      case 'good':
        color = '#5cb85c';
        break;
      case 'soso':
        color = '#68828b';
        break;
      case 'cold':
        color = '#000089';
        break;
      default:
        color = '#5cb85c'; // Default color
    }
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = color;
    }
  }
}

// id에 따라 nav-red를 변경하는 함수
function changeScrollbarColor(id) {
  const elements = document.getElementsByClassName('nav-red');
  if (elements.length > 0) {
    let color;
    switch (id) {
      case 'danger':
        color = '#ff0000';
        break;
      case 'cdanger':
        color = '#0000ff';
        break;
      case 'hot':
        color = '#ffaaaa';
        break;
      case 'good':
        color = '#90ee90';
        break;
      case 'soso':
        color = '#add8e6';
        break;
      case 'cold':
        color = '#0000ff';
        break;
      default:
        color = '#5cb85c'; // Default color
    }
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = color;
    }
  }
}

// id에 따라 버튼 색을 변경하는 함수
function changeSearchButton(id) {
  const elements = document.getElementsByClassName('ripple');
  if (elements.length > 0) {
    let color;
    switch (id) {
      case 'danger':
        color = '#ff0000';
        break;
      case 'cdanger':
        color = '#00008b';
        break;
     case 'hot':
        color = '#ffaaaa';
        break;
      case 'good':
        color = '#90ee90';
        break;
      case 'soso':
        color = '#add8e6';
        break;
      case 'cold':
        color = '#0000ff';
        break;
      default:
        color = '#5cb85c'; // Default color
    }
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = color;
    }
  }
}

// function changeScrollbar(id) {
//   console.log('results::-webkit-scrollbar-thumb' + id);

//   const elements = document.querySelectorAll('#results li');
//   console.log(elements);

//   if (elements && elements.length > 0) {
//     let color;
//     switch (id) {
//       case 'danger':
//         color = '#ff0000';
//         break;
//       case 'cdanger':
//         color = '#00008b';
//         break;
//      case 'hot':
//         color = '#ffaaaa';
//         break;
//       case 'good':
//         color = '#90ee90';
//         break;
//       case 'soso':
//         color = '#add8e6';
//         break;
//       case 'cold':
//         color = '#0000ff';
//         break;
//       default:
//         color = '#5cb85c'; // Default color
//     }

//     const style = document.createElement('style');
//     style.appendChild(document.createTextNode(`#results::-webkit-scrollbar-thumb { background: ${color} }`))
//     document.body.appendChild(style);
//     console.log(color);
//     //   for (let i = 0; i < elements.length; i++) {
//   //     elements[i].style.backgroundColor = color; 
//   //   }
//   }
// }

// 페이지 로드 시 초기화
initialize();

let polyline;
let lat;
let lng;
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

  // 사용자 에이전트를 통해 모바일 기기인지 확인하는 함수
  function isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  // 모바일에서만 이벤트 리스너 추가
  if (isMobile()) {
    // 현재 위치 마커에 클릭 이벤트 추가
    kakao.maps.event.addListener(currentMarker, 'click', function () {
      currentInfoWindow.open(map, currentMarker);
    });

    // 지도에 클릭 이벤트 추가
    kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
      // 인포윈도우가 열려 있다면 닫기
      if (currentInfoWindow.getMap()) {
        currentInfoWindow.close();
      }
    });
  }
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

function createInfoWindowContent(park, distance) {
  // 공원 정보와 함께 걸음 수를 표시
  const steps = calculateSteps(park.공원면적);
  return `
      <div class="infowindow-content">
        <div class="infowindow-header">
          <span class="infowindow-title">${park.공원명}</span>
        </div>
        <div class="infowindow-body">
          <p>주소: ${park.소재지지번주소}</p>
          <p>직선거리: ${distance} km</p>
          <p>1바퀴 걸음수: ${steps} 걸음</p> <!-- 1바퀴 걸음수 표시 -->
        </div>
      </div>
    `;
}

// 공원 마커를 생성하는 함수
function createMarker(lat, lng) {
  const imageSrc = "./background/image.png";
  // 아이콘 출처 https://www.flaticon.com/kr/free-animated-icon/city-park_11678602?term=%EA%B3%B5%EC%9B%90&page=1&position=5&origin=search&related_id=11678602

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
        image: new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(35, 35)),
      });
      markers.push(marker); // 마커를 배열에 추가

      const infowindowContent = createInfoWindowContent(park, distance);
      const infowindow = new kakao.maps.InfoWindow({
        content: infowindowContent
      });

      kakao.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.open(map, marker);
      });

      kakao.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
      });

      // 마커에 클릭 이벤트 추가하여 클릭 시 인포윈도우 열기
      kakao.maps.event.addListener(marker, 'click', function () {
        if(polyline) polyline.setMap(null); // Polyline을 지도에서 제거합니다.
        infowindow.open(map, marker);
        findRoute(park.위도, park.경도);
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
function placesSearchCB(data, status) {
  if (status === kakao.maps.services.Status.OK) {
    displayPlaces(data);
  } else {
    alert('검색 결과가 존재하지 않습니다.');
  }
}

// 검색 버튼을 클릭했을 때 실행되는 함수
function searchPlaces() {
  const keyword = document.getElementById('keyword').value;

  if (!keyword.trim()) {
    alert('키워드를 입력해주세요!');
    return;
  }

  // 장소 검색 객체를 통해 키워드로 장소 검색
  ps.keywordSearch(keyword, placesSearchCB);
}

// 스크롤을 맨 위로 이동하는 함수
function scrollToTop() {
  // 결과 리스트의 스크롤을 맨 위로 이동
  const resultsContainer = document.getElementById('results');
  resultsContainer.scrollTop = 0;

  // 페이지 전체의 스크롤을 맨 위로 이동
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 부드러운 스크롤 효과
  });
}

// 검색 결과를 화면에 표시하는 함수
function displayPlaces(places) {
  // 기존의 검색 결과 제거
  clearSearchResults();

  const listEl = document.getElementById('results');

  for (let i = 0; i < places.length; i++) {
    const itemEl = document.createElement('li');

    // 'li' 요소에 클래스 'result-item' 추가
    itemEl.className = "result-item"; // 여기서 클래스 추가

    // address_name의 첫 번째 단어 추출
    const firstWord = places[i].address_name.split(' ')[0];

    // 클로저를 사용하여 place_name을 initialize2 함수에 전달
    (function (place_name, y, x) {
      itemEl.onclick = () => {
        const position = new kakao.maps.LatLng(places[i].y, places[i].x);
        map.setCenter(position);

        // 지도 확대 수준 설정 (1~14 사이의 값)
        const zoomLevel = 3; // 동과 거리 정도로 확대

        map.setLevel(zoomLevel);


        // 현재 위치 마커 업데이트
        currentMarker.setPosition(position);

        // initialize2 함수 호출 시 place_name 전달
        initialize2(y, x, place_name);

        // 해당 위치를 중심으로 공원 표시
        createMarker(y, x);

        // 검색 결과 클릭 시 검색창 닫기
        nav.forEach(nav_el => nav_el.classList.remove('visible'))
        if(polyline) polyline.setMap(null); // Polyline을 지도에서 제거합니다.
      };
    })
    (places[i].place_name, places[i].y, places[i].x);

    itemEl.innerHTML = places[i].place_name + ' (' + firstWord + ')'; // innerHTML 설정은 클래스 추가 이후에

    listEl.appendChild(itemEl);
  }

  // 약간의 딜레이를 주고 애니메이션 클래스 추가
  setTimeout(() => {
    const resultItems = document.querySelectorAll('.result-item');
    resultItems.forEach(item => {
      item.classList.add('show');
    });

    // 스크롤을 맨 위로 이동
    scrollToTop();
  }, 100);
}

// 기존의 검색 결과를 제거하는 함수
function clearSearchResults() {
  const listEl = document.getElementById('results');
  listEl.innerHTML = '';

  // 스크롤을 맨 위로 이동
  scrollToTop();
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

    // danger 및 cdanger 요소일 경우 blink 클래스를 추가하고 경고 메시지 창을 띄움
    if (id === 'danger' || id === 'cdanger') {
      element.classList.add('blink');
      showAlert(`${description[id]} 외출을 삼가하세요.`);

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

  // 기온에 따라 적절한 요소를 보이게 설정
  if (temp >= 35) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement2('danger', temp2, place, weatherIconEl);
    changeScrollbarColor('danger');
    changeScrollbarColor2('danger');
    changeSearchButton('danger');
    // changeScrollbar('danger');
  } else if (temp >= 28) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement2('hot', temp2, place, weatherIconEl);
    changeScrollbarColor('hot');
    changeScrollbarColor2('hot');
    changeSearchButton('hot');
    // changeScrollbar('hot');
  } else if (temp >= 20) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement2('good', temp2, place, weatherIconEl);
    changeScrollbarColor('good');
    changeScrollbarColor2('good');
    changeSearchButton('good');
    // changeScrollbar('good');
  } else if (temp >= 10) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement2('soso', temp2, place, weatherIconEl);
    changeScrollbarColor('soso');
    changeScrollbarColor2('soso');
    changeSearchButton('soso');
    // changeScrollbar('soso');
  } else if (temp >= 0) {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement2('cold', temp2, place, weatherIconEl);
    changeScrollbarColor('cold');
    changeScrollbarColor2('cold');
    changeSearchButton('cold');
    // changeScrollbar('cold');
  } else {
    hideElement('danger');
    hideElement('hot');
    hideElement('good');
    hideElement('soso');
    hideElement('cold');
    hideElement('cdanger');
    showElement2('cdanger', temp2, place, weatherIconEl);
    changeScrollbarColor('cdanger');
    changeScrollbarColor2('cdanger');
    changeSearchButton('cdanger');
    // changeScrollbar('cdanger');
  }
}

// 길찾기 경로를 만드는 함수
function findRoute(y, x) {
  const currentPosition = currentMarker.getPosition();
  const startlat = currentPosition.getLat(); // 위도
  const startlng = currentPosition.getLng(); // 경도
  const endlng = x;
  const endlat = y;

  // 카카오 모빌리티 API를 사용하여 경로 데이터 가져오기
  fetch(`https://apis-navi.kakaomobility.com/v1/directions?origin=${startlng},${startlat}&destination=${endlng},${endlat}&priority=DISTANCE&car_fuel=GASOLINE&car_hipass=false&alternatives=false&road_details=false`,
    {
      method: 'GET',
      headers: {
        'Authorization':'KakaoAK eb58542e3fee07934244a6db2621e6fa'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // 응답 데이터 확인
      drawKakaoRoute(data);
    })
    .catch(error => console.error('Error with Kakao Mobility API:', error));
}

// 지도에 길찾기 경로를 그리는 함수
function drawKakaoRoute(data) {
  const path = [];

  if (data && data.routes && data.routes[0] && data.routes[0].sections) {
    data.routes[0].sections.forEach(section => {
      section.roads.forEach(road => {
        road.vertexes.forEach((vertex, index) => {
          if (index % 2 === 0) {
            path.push(new kakao.maps.LatLng(road.vertexes[index + 1], vertex));
          }
        });
      });
    });
  }
  
  // 경로를 표시할 Polyline 생성
  polyline = new kakao.maps.Polyline({
    path: path,
    strokeWeight: 5,
    strokeColor: '#7164B4',
    strokeOpacity: 0.7,
    strokeStyle: 'solid'
  });

  polyline.setMap(map);
  
}

// 좌측 삼선 버튼과 도움말 아이콘에 대한 이벤트 추가
const open_btn = document.querySelector('.open-btn')
const close_btn = document.querySelector('.close-btn')
const nav = document.querySelectorAll('.nav')
const helpIcon = document.getElementById('help-icon');
const tooltip = document.getElementById('tooltip');

open_btn.addEventListener('click', () => {
    nav.forEach(nav_el => nav_el.classList.add('visible'))
})

close_btn.addEventListener('click', () => {
    nav.forEach(nav_el => nav_el.classList.remove('visible'))
})


// ESC 키 눌렀을 때 네비게이션 메뉴 여닫기
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
      nav.forEach(nav_el => {
          if (nav_el.classList.contains('visible')) {
              nav_el.classList.remove('visible');
          } else {
              nav_el.classList.add('visible');
          }
      });
  }
});

helpIcon.addEventListener('click', () => {
    tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
});
  
// ESC 키 눌렀을 때 툴팁 닫기
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      tooltip.style.display = 'none';
    }
});

const buttons = document.querySelectorAll('.ripple')

buttons.forEach(button => {
    button.addEventListener('click', function (e) {
        const rect = e.target.getBoundingClientRect();
        const xInside = e.clientX - rect.left;
        const yInside = e.clientY - rect.top;

        const circle = document.createElement('span');
        circle.classList.add('circle');
        circle.style.top = yInside + 'px';
        circle.style.left = xInside + 'px';

        this.appendChild(circle);

        setTimeout(() => circle.remove(), 500);
    });
});