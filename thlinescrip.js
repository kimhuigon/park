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

// 탭 키 눌렀을 때 네비게이션 메뉴 열기
document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        nav.forEach(nav_el => nav_el.classList.add('visible'));
    }
});

// ESC 키 눌렀을 때 네비게이션 메뉴 닫기
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        nav.forEach(nav_el => nav_el.classList.remove('visible'));
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