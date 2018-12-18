function menuAnimation() {
    var menu = document.getElementsByTagName('header')[0];
    var page = document.getElementsByTagName('main')[0];
    var pageStyles = page.currentStyle || window.getComputedStyle(page);
    var curLeftMargin = parseInt(pageStyles.marginLeft);
    console.log(curLeftMargin);
    
    menu.addEventListener('mouseover', () => {
        page.style.marginLeft = curLeftMargin + 117 + "px";
        menu.classList.add('header--open');
    });
    menu.addEventListener('mouseout', () => {
        page.style.marginLeft = curLeftMargin + "px";
        menu.classList.remove('header--open');
    });
}