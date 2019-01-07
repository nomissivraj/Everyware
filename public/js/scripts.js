//Function to handle animation of menu throughout the site
function menuAnimation() {
    //get elements to manipulate
    var menu = document.getElementsByTagName('header')[0];
    var page = document.getElementsByTagName('main')[0];
    //Store computed style of the 'main' element container
    var pageStyles = page.currentStyle || window.getComputedStyle(page);
    //Get the current left margin of the 'main' element style
    var curLeftMargin = parseInt(pageStyles.marginLeft);
    
    //on mouseover add a class of header--open to the menu/header element
    menu.addEventListener('mouseover', () => {
        //add left margin to the 'main' container and a buffer of 117px to push content out of the way as the menu opens
        page.style.marginLeft = curLeftMargin + 117 + "px";
        //add class so CSS can assist with animation
        menu.classList.add('header--open');
    });
    //as mouse leaves the menu reduce the margin back to normal/initial value
    menu.addEventListener('mouseout', () => {
        page.style.marginLeft = curLeftMargin + "px";
        //Remove header--open class from menu so CSS can assist with animation
        menu.classList.remove('header--open');
    });
}
// initialise loop variable to store timeout so that it can be cleared/restarted 
var loop;
// Function to refresh page after resize event has finished happening and not during
// This is to get around the fact that the visualisation does not dynamically resize due to width/height being set on load based on the current window width/height
function refreshResize() {
    //Add listener for resize event
    window.addEventListener('resize', () => {
        //clear timeout every time resize event fires - i.e. when resizing is still happening
        clearTimeout(loop);
        //Initialise timeout and bind it to loop variable
        loop = setTimeout(() => {
            location.reload();// if resize event hasn't fired in the last quarter of a second (i.e. it has finishe resizing) then reload the page
        }, 250)
    });
}