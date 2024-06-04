document.addEventListener("DOMContentLoaded", function() {
    // console.log("loading.html has loaded."); 확인용
    // 로딩 화면을 표시합니다.
    setTimeout(function() {
        // console.log("Navigating to restpark.html"); 확인용
        // 로컬 스토리지에 플래그를 설정하여 restpark.html이 로드될 때 이를 확인하도록 함
        localStorage.setItem('loadingComplete', 'true');
        // restpark.html로 이동
        window.location.href = 'restpark.html';
    }, 2000); // 2초 동안 로딩 화면을 표시합니다.
});