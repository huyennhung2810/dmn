/**
 * Hàm load component dùng chung
 */
async function loadComponent(selector, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Lỗi tải: ${componentPath}`);
        
        const html = await response.text();
        const element = document.querySelector(selector);
        
        if (element) {
            element.innerHTML = html;
            return true;
        }
    } catch (error) {
        console.error('Lỗi component:', error);
        return false;
    }
}

/**
 * Hàm xử lý Active Menu Navigation
 */
function handleActiveMenu() {
    const currentPath = window.location.pathname;
    // Tìm tất cả link trong nav sau khi đã được load
    const navLinks = document.querySelectorAll('#nav a');
    navLinks.forEach(link => {
        // Kiểm tra nếu href của link khớp với đường dẫn hiện tại
        if (link.getAttribute('href') === currentPath || 
           (currentPath === '/' && link.getAttribute('href').includes('index.html'))) {
            link.classList.add('active');
        }
    });
}

/**
 * Khởi tạo toàn bộ trang
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Tải các thành phần cơ bản song song
    await Promise.all([
        loadComponent('#header', '/components/header.html'),
        loadComponent('#nav', '/components/nav.html'),
        loadComponent('#footer', '/components/footer.html')
    ]);

    // 2. Sau khi Nav load xong, xử lý bôi đậm menu
    handleActiveMenu();

    // 3. Tải Banner (nếu có) và khởi tạo Carousel
    const bannerContainer = document.querySelector('#banner');
    if (bannerContainer) {
        await loadComponent('#banner', '/components/banner.html');
    }

    // Luôn gọi initCarousel cuối cùng để đảm bảo tất cả item đã có mặt trong DOM
    if (typeof initCarousel === 'function') {
        initCarousel();
    }
});

/**
 * Logic điều khiển Carousel (Drag & Buttons)
 */
function initCarousel() {
    const carousels = document.querySelectorAll(".carousel-items");
    if (carousels.length === 0) return;

    carousels.forEach((slider) => {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Kéo chuột
        slider.addEventListener("mousedown", (e) => {
            isDown = true;
            slider.classList.add("dragging");
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            slider.style.scrollBehavior = "auto";
        });

        const stopDragging = () => {
            isDown = false;
            slider.classList.remove("dragging");
            slider.style.scrollBehavior = "smooth";
        };

        slider.addEventListener("mouseleave", stopDragging);
        slider.addEventListener("mouseup", stopDragging);

        slider.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; 
            slider.scrollLeft = scrollLeft - walk;
        });

        // Chặn click khi đang dragging
        slider.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", (e) => {
                if (slider.classList.contains("dragging")) e.preventDefault();
            });
        });
    });

    // Nút bấm Next/Prev
    const scrollAmount = 350; 
    
    document.querySelectorAll(".carousel-next").forEach((btn) => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute("data-category");
            const carousel = document.querySelector(`.category-carousel[data-category="${category}"] .carousel-items`);
            if (carousel) carousel.scrollLeft += scrollAmount;
        });
    });

    document.querySelectorAll(".carousel-prev").forEach((btn) => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute("data-category");
            const carousel = document.querySelector(`.category-carousel[data-category="${category}"] .carousel-items`);
            if (carousel) carousel.scrollLeft -= scrollAmount;
        });
    });
}