// Глобальные переменные для полноэкранного слайдера
let currentFullscreenIndex = 0;
let fullscreenSlides = [];
let fullscreenDots = [];

// Функции для слайдеров в карточках
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдеров в карточках
    initCardSliders();
    
    // Обработчики для открытия полноэкранного просмотра
    document.querySelectorAll('.slider-container').forEach(container => {
        container.addEventListener('click', function(e) {
            // Если клик не по стрелке или точке
            if (!e.target.closest('.slider-arrow') && !e.target.closest('.dot')) {
                const card = this.closest('.product-card');
                openFullscreenSlider(card);
            }
        });
    });

    // Инициализация обработчиков для полноэкранных стрелок (один раз)
    initFullscreenArrows();
});

// Инициализация стрелок полноэкранного слайдера (вызывается один раз)
function initFullscreenArrows() {
    const fullscreenView = document.getElementById('fullscreenView');
    const prevBtn = fullscreenView.querySelector('.fullscreen-arrow.prev');
    const nextBtn = fullscreenView.querySelector('.fullscreen-arrow.next');

    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        let newIndex = currentFullscreenIndex - 1;
        if (newIndex < 0) newIndex = fullscreenSlides.length - 1;
        showFullscreenSlide(newIndex);
    });

    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        let newIndex = currentFullscreenIndex + 1;
        if (newIndex >= fullscreenSlides.length) newIndex = 0;
        showFullscreenSlide(newIndex);
    });
}

// Инициализация слайдеров в карточках
function initCardSliders() {
    document.querySelectorAll('.slider-container').forEach(container => {
        const track = container.querySelector('.slider-track');
        const slides = container.querySelectorAll('.slide');
        const dots = container.querySelectorAll('.dot');
        const prevBtn = container.querySelector('.slider-arrow.prev');
        const nextBtn = container.querySelector('.slider-arrow.next');
        
        let currentSlide = 0;
        
        // Функция для показа слайда
        function showSlide(index) {
            // Скрываем все слайды
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Показываем нужный слайд
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentSlide = index;
        }
        
        // Обработчики для стрелок
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                let newIndex = currentSlide - 1;
                if (newIndex < 0) newIndex = slides.length - 1;
                showSlide(newIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                let newIndex = currentSlide + 1;
                if (newIndex >= slides.length) newIndex = 0;
                showSlide(newIndex);
            });
        }
        
        // Обработчики для точек
        dots.forEach(dot => {
            dot.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                showSlide(index);
            });
        });
    });
}

// Функция для открытия полноэкранного слайдера
function openFullscreenSlider(card) {
    const fullscreenView = document.getElementById('fullscreenView');
    const fullscreenTrack = fullscreenView.querySelector('.fullscreen-track');
    const fullscreenDotsContainer = fullscreenView.querySelector('.fullscreen-dots');
    
    // Очищаем предыдущие слайды
    fullscreenTrack.innerHTML = '';
    fullscreenDotsContainer.innerHTML = '';
    
    // Получаем все изображения из карточки
    const slides = card.querySelectorAll('.slide');
    
    // Находим индекс активного слайда
    let activeIndex = 0;
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            activeIndex = index;
        }
    });
    
    currentFullscreenIndex = activeIndex;
    
    // Создаем слайды для полноэкранного просмотра
    fullscreenSlides = [];
    fullscreenDots = [];
    
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        
        if (img) {
            // Создаем слайд
            const fullscreenSlide = document.createElement('div');
            fullscreenSlide.className = 'fullscreen-slide';
            if (index === activeIndex) {
                fullscreenSlide.classList.add('active');
            }
            
            const fullscreenImg = document.createElement('img');
            fullscreenImg.src = img.src;
            fullscreenImg.alt = img.alt;
            
            fullscreenSlide.appendChild(fullscreenImg);
            fullscreenTrack.appendChild(fullscreenSlide);
            fullscreenSlides.push(fullscreenSlide);
            
            // Создаем точки для навигации
            const dot = document.createElement('span');
            dot.className = 'fullscreen-dot';
            if (index === activeIndex) {
                dot.classList.add('active');
            }
            dot.setAttribute('data-index', index);
            
            dot.addEventListener('click', function(e) {
                e.stopPropagation();
                showFullscreenSlide(parseInt(this.getAttribute('data-index')));
            });
            
            fullscreenDotsContainer.appendChild(dot);
            fullscreenDots.push(dot);
        }
    });
    
    // Показываем полноэкранный просмотр
    fullscreenView.style.display = 'block';
    
    // Добавляем обработчики для клавиатуры
    document.addEventListener('keydown', handleFullscreenKeyboard);
    
    // Останавливаем прокрутку страницы
    document.body.style.overflow = 'hidden';
}

// Функция для показа слайда в полноэкранном режиме
function showFullscreenSlide(index) {
    // Скрываем все слайды
    fullscreenSlides.forEach(slide => slide.classList.remove('active'));
    fullscreenDots.forEach(dot => dot.classList.remove('active'));
    
    // Показываем нужный слайд
    if (fullscreenSlides[index]) {
        fullscreenSlides[index].classList.add('active');
        fullscreenDots[index].classList.add('active');
        currentFullscreenIndex = index;
    }
}

// Обработка клавиатуры для полноэкранного слайдера
function handleFullscreenKeyboard(event) {
    switch(event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            let prevIndex = currentFullscreenIndex - 1;
            if (prevIndex < 0) prevIndex = fullscreenSlides.length - 1;
            showFullscreenSlide(prevIndex);
            break;
            
        case 'ArrowRight':
            event.preventDefault();
            let nextIndex = currentFullscreenIndex + 1;
            if (nextIndex >= fullscreenSlides.length) nextIndex = 0;
            showFullscreenSlide(nextIndex);
            break;
            
        case 'Escape':
            event.preventDefault();
            closeFullscreen();
            break;
    }
}

// Функция для закрытия полноэкранного режима
function closeFullscreen() {
    const fullscreenView = document.getElementById('fullscreenView');
    fullscreenView.style.display = 'none';
    
    // Убираем обработчики клавиатуры
    document.removeEventListener('keydown', handleFullscreenKeyboard);
    
    // Восстанавливаем прокрутку страницы
    document.body.style.overflow = '';
    
    // Очищаем глобальные переменные
    fullscreenSlides = [];
    fullscreenDots = [];
    currentFullscreenIndex = 0;
}