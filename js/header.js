const header = document.getElementsByClassName('site-header')[0];

window.addEventListener('scroll', function(){
    const rect = header.getBoundingClientRect();

    if(rect.top <= 0){
        header.style.backgroundColor = 'var(--color-3)';
    } else {
      header.style.backgroundColor = 'Transparent';
    }
});