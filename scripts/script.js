const buttonClick = new Audio('sounds/button-click.mp3');
    const searchBox = document.getElementById('search-box');
    const searchInput = searchBox.querySelector("input[type=search]");
    searchInput.addEventListener('focus', ()=>{toggleEl(searchBox)});
    searchInput.addEventListener('blur', ()=>{toggleEl(searchBox)});
    searchBox.addEventListener('click', ()=>{
        searchInput.focus();
    });
    const menuBar = document.getElementById('menu-bar');
    const menu = document.getElementById('menu');
    const hscrollElements = document.getElementsByClassName("hscroll");
    const sliderElements = document.getElementsByClassName("slider");
    
    var rtime;
    var timeout = false;
    var delta = 100;

    window.addEventListener('resize', ()=>{
        clearTrans();
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
        }
    });

    function resizeend() {
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            timeout = false;
            resetTrans();
        }               
    }
    
    for(const hscroll of hscrollElements){
        const hscrollContent = hscroll.querySelector('div');
        hscrollContent.style.setProperty('margin-left', '0px');
        setScroll(0, hscroll, hscrollContent);
        let offset, posOffset;
        hscroll.addEventListener('wheel', (e)=>{      
            e.preventDefault();            
            let scroll = hscrollContent.style.getPropertyValue('margin-left');
            let pos = -e.deltaX + parseFloat(scroll);
            setScroll(pos, hscroll, hscrollContent);
        });
        let isMouseScroll = false;
        hscroll.addEventListener('mousedown', (e)=>{
            offset = { x:e.clientX, y:e.clientY };
            posOffset = parseInt(hscrollContent.style.getPropertyValue('margin-left'));
            isMouseScroll = true;
        });
        document.addEventListener('mousemove', (e) => {
            if (isMouseScroll) {                                        
                if (Math.abs(Math.atan((e.clientY - offset.y) / (e.clientX - offset.x))) < Math.PI / 4) {
                    e.preventDefault();
                    setScroll(posOffset + e.clientX - offset.x, hscroll, hscrollContent);
                }
            }
        });
        document.addEventListener('mouseup', (e) => { isMouseScroll = false; });
        hscroll.addEventListener('touchstart', (e)=>{
            offset = { x:e.touches[0].clientX, y:e.touches[0].clientY };
            posOffset = parseInt(hscrollContent.style.getPropertyValue('margin-left'));
        });
        hscroll.addEventListener('touchmove', (e) => {                        
            if (Math.abs(Math.atan((e.touches[0].clientY - offset.y) / (e.touches[0].clientX - offset.x))) < Math.PI / 4) {
                e.preventDefault();
                setScroll(posOffset + e.touches[0].clientX - offset.x, hscroll, hscrollContent);
            }
        });
        window.addEventListener('resize', ()=>{
            setScroll(parseFloat(hscrollContent.style.getPropertyValue('margin-left')), hscroll, hscrollContent);
        });
    }

    function setScroll(pos, scrollEl, contentEl){
        const maxScroll = (-contentEl.offsetWidth) + scrollEl.offsetWidth;
        pos = Math.max(pos, maxScroll);
        pos = Math.min(pos, 0);
        if(pos < 0){
            scrollEl.classList.add('left-shadow');
        }else {
            scrollEl.classList.remove('left-shadow');
        }

        if(pos > maxScroll){
            scrollEl.classList.add('right-shadow');
        }else {
            scrollEl.classList.remove('right-shadow');
        }
        contentEl.style.setProperty('margin-left',pos+"px");
    }
    
    for (const slider of sliderElements) {
        const content = slider.querySelector(".content");
        const numSlides = content.children.length;
        const leftArrow = slider.querySelector(".left-arrow");
        const rightArrow = slider.querySelector(".right-arrow");
        const dots = slider.querySelector(".dots");
        let curr = 0;

        content.style.width = numSlides + "00%";
        content.style.left = "-" + curr + "00%";
        leftArrow.style.display = "none";
        
        for (let i = 0; i < numSlides; i++){
            dots.appendChild(document.createElement("div"));
        }
        
        dots.children.item(curr).classList.add("curr-dot");

        leftArrow.onclick = function () {
            dots.children.item(curr).classList.remove("curr-dot");
            curr--;
            dots.children.item(curr).classList.add("curr-dot");
            if (curr === 0) {
                leftArrow.style.display = "none";
            }
            rightArrow.style.removeProperty('display');
            content.style.left = "-" + curr + "00%";
        }
        
        rightArrow.onclick = function () {
            dots.children.item(curr).classList.remove("curr-dot");
            curr++;
            dots.children.item(curr).classList.add("curr-dot");
            if (curr === numSlides - 1) {
                rightArrow.style.display = "none";
            }
            leftArrow.style.removeProperty('display');
            content.style.left = "-" + curr + "00%";
        }
    }

    let removeMenuTimeout, duration;
    function openMenu(bar){        
        if(menu.classList.contains('opened')){
            menu.classList.remove('opened');
            bar.classList.remove('opened');
            removeMenuTimeout = setTimeout(()=>{menu.style.setProperty('display','none')},Math.min(300, new Date() - duration + 50));
        }else {
            clearTimeout(removeMenuTimeout);
            duration = new Date();
            menu.style.removeProperty('display');
            menu.offsetHeight;
            menu.classList.add('opened');
            bar.classList.add('opened');
        }
    }

    function toggleEl(el){
        el.classList.toggle('opened');
    }
    
    function openEl(el) {
        el.classList.add('opened');    
    }

    function closeEl(el) {
        el.classList.remove('opened');    
    }

    function changeTheme(el, animation) {
        if(animation){
            el.classList.add('switching');
            setTimeout(()=>{
                el.classList.remove('switching');
            },100);
        }

        buttonClick.play();
        clearTrans();

        if(document.body.getAttribute('theme') == 'dark'){   
            document.body.setAttribute('theme', 'light');
        }
        else {    
            document.body.setAttribute('theme', 'dark');
        }
        
        resetTrans();
    }

    function clearTrans(){
        document.body.style.setProperty("--main-trans", "0ms");
    }

    function resetTrans(){
        document.body.offsetHeight;
        document.body.style.removeProperty('--main-trans');
    }