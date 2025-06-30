document.addEventListener('DOMContentLoaded', function() {
    // 元素获取
    const moodImage = document.getElementById('mood-image');
    const textContent = document.getElementById('text-content');
    const acceptBtn = document.getElementById('accept-btn');
    const rejectBtn = document.getElementById('reject-btn');
    const bgMusic = document.getElementById('background-music');
    const menuContainer = document.getElementById('menu-container');
    const showMenuBtn = document.getElementById('show-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const shareBtn = document.getElementById('share-btn');
    const menuItems = document.querySelector('.menu-items');
    const bgAnimation = document.getElementById('bg-animation');
    const shareContainer = document.getElementById('share-container');
    const saveImageBtn = document.getElementById('save-image');
    const closeShareBtn = document.getElementById('close-share');
    const shareCanvas = document.getElementById('share-canvas');
    
    // 状态变量
    let rejectCount = 0;
    let gameOver = false;
    
    // 文案数组
    const rejectTexts = [
        "告诉老默，我想吃肯德基了！！！",
        "家人们听说了吗，最近KFC和vivo合作出了一款手机，叫肯德基疯狂星期四vivo50",
        "疯狂星期四想不想搞大我的肚子（doge）",
        "晚点我会在朋友圈里发一个50元的肯德基代付链接，大家注意抢",
        "星期四是这样的，群友只需要v我50就可以了，而我要考虑的事情就多了"
    ];
    
    const acceptText = "来财来";
    const finalRejectText = "林北，我再说一次这里是麦当劳！没有疯狂星期四！";
    
    // 菜单项
    const menuData = [
        { name: "香辣鸡腿堡", price: "¥11.4", color: "#ff9e80" },
        { name: "吮指原味鸡", price: "¥5.1", color: "#ffcc80" },
        { name: "波纹薯条", price: "¥4.1", color: "#ffe57f" },
        { name: "葡式蛋挞", price: "¥9.1", color: "#fff59d" },
        { name: "黄金鸡块", price: "¥9.8", color: "#dce775" },
        { name: "劲爆鸡米花", price: "¥1.0", color: "#aed581" }
    ];
    
    // 初始化按钮状态
    function initializeButtons() {
        const acceptBtn = document.getElementById('accept-btn');
        const rejectBtn = document.getElementById('reject-btn');
        
        // 确保按钮正确的初始文本
        acceptBtn.textContent = "v我50";
        rejectBtn.textContent = "拒绝";
        
        // 重置按钮样式到初始状态
        acceptBtn.style.cssText = '';
        rejectBtn.style.cssText = '';
        
        // 应用默认样式
        acceptBtn.style.backgroundColor = '#e4002b';
        acceptBtn.style.color = 'white';
        
        rejectBtn.style.backgroundColor = '#f8f8f8';
        rejectBtn.style.color = '#333';
        rejectBtn.style.border = '1px solid #ddd';
        
        console.log('按钮初始化完成');
    }
    
    // 初始化
    function init() {
        // 初始化按钮状态
        initializeButtons();
        
        // 添加音乐控制按钮
        addMusicControl();
        
        // 尝试自动播放音乐
        playBackgroundMusic();
        
        // 初始化菜单（但不显示）
        initMenu();
        
        // 创建动态背景
        createBackgroundParticles();
        
        // 绑定事件
        acceptBtn.addEventListener('click', handleAccept);
        rejectBtn.addEventListener('click', handleReject);
        showMenuBtn.addEventListener('click', showMenu);
        closeMenuBtn.addEventListener('click', hideMenu);
        shareBtn.addEventListener('click', showShareOptions);
        saveImageBtn.addEventListener('click', saveShareImage);
        closeShareBtn.addEventListener('click', hideShareOptions);
        
        // 确保菜单一开始是隐藏的
        menuContainer.classList.add('hidden');
        shareContainer.classList.add('hidden');
        
        // 添加拒绝按钮的鼠标悬停效果
        rejectBtn.addEventListener('mouseover', function() {
            if (rejectCount > 1 && !gameOver) {
                moveRejectButton();
            }
        });
    }
    
    // 添加音乐控制按钮
    function addMusicControl() {
        const musicBtn = document.createElement('button');
        musicBtn.id = 'music-control';
        musicBtn.className = 'music-button';
        musicBtn.innerHTML = '<span>🔊</span>'; // 默认显示为开启状态
        document.body.appendChild(musicBtn);
        
        // 添加点击事件
        musicBtn.addEventListener('click', toggleMusic);
    }
    
    // 尝试自动播放背景音乐
    function playBackgroundMusic() {
        // 设置音量并取消静音，尝试直接播放
        bgMusic.volume = 0.3;
        bgMusic.muted = false;
        
        // 尝试自动播放
        const playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // 自动播放成功
                console.log("自动播放成功，音乐已开启");
                
                // 更新音乐控制按钮状态
                const musicBtn = document.getElementById('music-control');
                if (musicBtn) {
                    musicBtn.innerHTML = '<span>🔊</span>';
                    musicBtn.classList.remove('muted');
                }
            }).catch(error => {
                console.log("自动播放被阻止，将在用户交互后自动开启");
                
                // 如果自动播放被阻止，先保持界面为开启状态
                // 在用户第一次交互时自动开启音乐
                const musicBtn = document.getElementById('music-control');
                if (musicBtn) {
                    musicBtn.innerHTML = '<span>🔊</span>';
                    musicBtn.classList.remove('muted');
                }
                
                // 监听用户的第一次交互，自动开启音乐
                const enableAudioOnInteraction = () => {
                    bgMusic.muted = false;
                    bgMusic.volume = 0.3;
                    bgMusic.play().then(() => {
                        console.log("用户交互后音乐自动开启");
                    }).catch(e => {
                        console.log("音乐播放失败:", e);
                        // 如果还是失败，则显示为静音状态
                        bgMusic.muted = true;
                        bgMusic.volume = 0;
                        if (musicBtn) {
                            musicBtn.innerHTML = '<span>🔇</span>';
                            musicBtn.classList.add('muted');
                        }
                    });
                    
                    // 移除事件监听器，只执行一次
                    document.removeEventListener('click', enableAudioOnInteraction);
                    document.removeEventListener('keydown', enableAudioOnInteraction);
                    document.removeEventListener('touchstart', enableAudioOnInteraction);
                };
                
                // 监听多种用户交互事件
                document.addEventListener('click', enableAudioOnInteraction, { once: true });
                document.addEventListener('keydown', enableAudioOnInteraction, { once: true });
                document.addEventListener('touchstart', enableAudioOnInteraction, { once: true });
            });
        }
    }
    
    // 切换音乐播放状态
    function toggleMusic() {
        const musicBtn = document.getElementById('music-control');
        
        if (bgMusic.paused || bgMusic.muted) {
            // 播放音乐
            bgMusic.muted = false;
            bgMusic.volume = 0.3;
            bgMusic.play().then(() => {
                musicBtn.innerHTML = '<span>🔊</span>';
                musicBtn.classList.remove('muted');
            }).catch(e => {
                console.log("播放失败:", e);
            });
        } else {
            // 暂停音乐
            bgMusic.muted = true;
            bgMusic.volume = 0;
            musicBtn.innerHTML = '<span>🔇</span>';
            musicBtn.classList.add('muted');
        }
    }
    
    // 创建背景粒子
    function createBackgroundParticles() {
        bgAnimation.innerHTML = '';
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'bg-particle';
            
            // 随机大小
            const size = Math.random() * 50 + 20;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // 随机位置
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // 随机动画延迟
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            
            bgAnimation.appendChild(particle);
        }
    }
    
    // 处理接受按钮点击
    function handleAccept() {
        if (gameOver) return;
        
        // 更新图片
        moodImage.src = "图片/感谢.jpg";
        
        // 更新文案
        textContent.textContent = acceptText;
        
        // 更新音乐
        changeBgMusic("音乐/开心.mp3");
        
        // 添加特效
        document.body.style.backgroundColor = "#ffecb3";
        document.body.classList.add('accept-bg');
        acceptBtn.style.transform = "scale(1.3)";
        acceptBtn.style.boxShadow = "0 5px 30px rgba(228, 0, 43, 0.7)";
        
        // 清理自动移动定时器
        if (window.autoMoveInterval) {
            clearInterval(window.autoMoveInterval);
            window.autoMoveInterval = null;
        }
        
        // 禁用按钮
        disableButtons();
        
        // 添加表情雨效果
        createEmojiRain();
        
        gameOver = true;
    }
    
    // 处理拒绝按钮点击
    function handleReject() {
        if (gameOver) return;
        
        rejectCount++;
        
        // 添加页面抖动效果
        document.querySelector('.container').classList.add('shake');
        setTimeout(() => {
            document.querySelector('.container').classList.remove('shake');
        }, 500);
        
        if (rejectCount <= 5) {
            // 更新图片
            moodImage.src = `图片/${rejectCount}.jpg`;
            
            // 更新文案
            textContent.textContent = rejectTexts[rejectCount - 1];
            
            // 根据拒绝次数修改按钮
            updateButtonsBasedOnRejectCount();
            
            // 在第五次点击拒绝按钮时显示弹窗
            if (rejectCount === 5) {
                setTimeout(() => {
                    alert("这个星期四真的真的不请我吃kfc吗QAQ\n\n💡 提示：你还可以再点击一次拒绝按钮哦！");
                }, 500);
            }
        } else {
            // 最终拒绝状态
            moodImage.src = "图片/这里没有疯狂星期四.jpg";
            textContent.textContent = finalRejectText;
            changeBgMusic("音乐/伤心.mp3");
            document.body.style.backgroundColor = "#e0e0e0";
            document.body.classList.add('reject-bg');
            
            // 清理自动移动定时器
            if (window.autoMoveInterval) {
                clearInterval(window.autoMoveInterval);
                window.autoMoveInterval = null;
            }
            
            // 清理随机运动定时器
            if (window.randomMotionInterval) {
                clearInterval(window.randomMotionInterval);
                window.randomMotionInterval = null;
            }
            
            // 重置拒绝按钮位置和样式
            const rejectBtn = document.getElementById('reject-btn');
            rejectBtn.style.position = 'relative';
            rejectBtn.style.left = 'auto';
            rejectBtn.style.top = 'auto';
            rejectBtn.style.transform = 'scale(1)';
            
            // 禁用按钮
            disableButtons();
            
            gameOver = true;
        }
    }
    
    // 根据拒绝次数更新按钮
    function updateButtonsBasedOnRejectCount() {
        const acceptBtn = document.getElementById('accept-btn');
        const rejectBtn = document.getElementById('reject-btn');
        
        // 清理之前可能存在的定时器
        if (rejectBtn._hideTimer) {
            clearTimeout(rejectBtn._hideTimer);
            rejectBtn._hideTimer = null;
        }
        
        // 清理随机运动定时器
        if (window.randomMotionInterval) {
            clearInterval(window.randomMotionInterval);
            window.randomMotionInterval = null;
        }
        
        // 确保按钮正确的文本内容
        acceptBtn.textContent = "v我50";
        
        // 确保接受按钮始终保持相对定位，不受任何影响
        acceptBtn.style.position = 'relative';
        acceptBtn.style.left = 'auto';
        acceptBtn.style.top = 'auto';
        
        // 强制确保拒绝按钮可见且样式正确
        rejectBtn.style.display = 'block';
        rejectBtn.style.visibility = 'visible';
        rejectBtn.style.pointerEvents = 'auto';
        
        // 重置拒绝按钮的基本样式
        rejectBtn.style.backgroundColor = '#f8f8f8';
        rejectBtn.style.color = '#333';
        rejectBtn.style.border = '1px solid #ddd';
        
        // 确保拒绝按钮有默认文本（如果没有的话）
        if (!rejectBtn.textContent || rejectBtn.textContent.trim() === '') {
            rejectBtn.textContent = '拒绝';
        }
        
        // 重置transform和透明度（确保按钮始终可见）
        rejectBtn.style.transform = 'scale(1)';
        rejectBtn.style.opacity = '1';
        rejectBtn.style.zIndex = '2';
        
        // 强制确保按钮可见性
        rejectBtn.style.display = 'block';
        rejectBtn.style.visibility = 'visible';
        rejectBtn.style.pointerEvents = 'auto';
        
        // 移除之前的高亮效果（第4次拒绝时保持当前状态）
        if (rejectCount !== 4) {
            acceptBtn.classList.remove('highlight-accept');
            // 重置同意按钮样式
            acceptBtn.style.transform = '';
            acceptBtn.style.boxShadow = '';
        }
        
        // 重置拒绝按钮位置为相对定位（第5次拒绝时会被覆盖）
        rejectBtn.style.position = 'relative';
        rejectBtn.style.left = 'auto';
        rejectBtn.style.top = 'auto';
        
        switch(rejectCount) {
            case 1:
                // 减小拒绝按钮
                rejectBtn.style.transform = "scale(0.9)";
                acceptBtn.style.transform = "scale(1.1)";
                acceptBtn.classList.add('highlight-accept');
                // 修改拒绝按钮文字
                rejectBtn.textContent = "真的不请吗？";
                break;
            case 2:
                // 降低拒绝按钮透明度
                rejectBtn.style.opacity = "0.7";
                acceptBtn.style.transform = "scale(1.15)";
                acceptBtn.style.boxShadow = "0 0 15px rgba(228, 0, 43, 0.5)";
                acceptBtn.classList.add('highlight-accept');
                // 修改拒绝按钮文字
                rejectBtn.textContent = "再考虑一下";
                // 交换按钮位置
                swapButtons();
                break;
            case 3:
                // 交换按钮位置
                swapButtons();
                acceptBtn.style.transform = "scale(1.2)";
                acceptBtn.style.boxShadow = "0 0 20px rgba(228, 0, 43, 0.6)";
                acceptBtn.classList.add('highlight-accept');
                // 修改拒绝按钮文字
                rejectBtn.textContent = "别点我";
                break;
            case 4:
                // 如果没有特殊处理，给拒绝按钮一个默认状态
                rejectBtn.textContent = "还是拒绝";
                break;
            case 5:
                // 确保接受按钮完全不受影响，保持之前的状态
                acceptBtn.style.transform = "scale(1.2)";
                acceptBtn.style.boxShadow = "0 0 20px rgba(228, 0, 43, 0.7)";
                acceptBtn.classList.add('highlight-accept');
                
                // 拒绝按钮样式设置
                rejectBtn.style.transform = "scale(1.0)";
                rejectBtn.style.opacity = "0.9";
                rejectBtn.textContent = "最后机会";
                rejectBtn.style.border = "3px solid #ff0000";
                rejectBtn.style.backgroundColor = "#ffebee";
                rejectBtn.style.color = "#d32f2f";
                rejectBtn.style.fontWeight = "bold";
                
                // 设置为绝对定位以便随机移动
                rejectBtn.style.position = 'absolute';
                rejectBtn.style.zIndex = '10';
                
                // 添加阴影效果提高可见性
                rejectBtn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
                
                // 启动局部随机运动
                startRandomMotion(rejectBtn);
                
                break;
        }
    }
    
    // 交换按钮位置
    function swapButtons() {
        const buttonsContainer = document.querySelector('.buttons-container');
        const acceptBtn = document.getElementById('accept-btn');
        const rejectBtn = document.getElementById('reject-btn');
        
        // 获取当前的 flex-direction
        const currentDirection = getComputedStyle(buttonsContainer).flexDirection;
        
        // 切换 flex-direction
        if (currentDirection === 'row' || currentDirection === '') {
            buttonsContainer.style.flexDirection = 'row-reverse';
        } else {
            buttonsContainer.style.flexDirection = 'row';
        }
        
        // 确保拒绝按钮可见
        rejectBtn.style.display = 'block';
        rejectBtn.style.visibility = 'visible';
    }
    
    // 简单的按钮移动效果（仅用于鼠标悬停时的轻微移动）
    function moveRejectButton() {
        const rejectBtn = document.getElementById('reject-btn');
        // 只在拒绝次数大于1且游戏未结束时触发轻微移动效果
        if (rejectCount > 1 && !gameOver) {
            // 添加轻微的抖动效果
            rejectBtn.style.transform = `${rejectBtn.style.transform || ''} translateX(${Math.random() * 4 - 2}px)`;
            
            // 0.2秒后恢复
            setTimeout(() => {
                if (rejectBtn.style.transform) {
                    rejectBtn.style.transform = rejectBtn.style.transform.replace(/translateX\([^)]*\)/g, '');
                }
            }, 200);
        }
    }
    
    // 启动按钮局部随机运动
    function startRandomMotion(button) {
        // 清理之前可能存在的运动定时器
        if (window.randomMotionInterval) {
            clearInterval(window.randomMotionInterval);
        }
        
        // 获取按钮容器
        const container = document.querySelector('.buttons-container');
        const acceptBtn = document.getElementById('accept-btn');
        
        // 确保接受按钮完全不受影响，保持相对定位
        acceptBtn.style.position = 'relative';
        acceptBtn.style.left = 'auto';
        acceptBtn.style.top = 'auto';
        
        // 不改变容器高度，使用现有空间
        container.style.position = 'relative';
        
        // 获取容器和按钮的位置信息
        const containerRect = container.getBoundingClientRect();
        
        // 定义拒绝按钮的运动区域（在其原始位置的右侧，避免与接受按钮重叠）
        const motionArea = {
            // 运动区域在容器右半部分
            centerX: containerRect.width * 0.75, // 在容器右侧75%位置
            centerY: 30, // 垂直居中
            width: 120,  // 运动区域宽度
            height: 60   // 运动区域高度
        };
        
        // 计算运动边界
        const bounds = {
            minX: motionArea.centerX - motionArea.width / 2,
            maxX: motionArea.centerX + motionArea.width / 2,
            minY: motionArea.centerY - motionArea.height / 2,
            maxY: motionArea.centerY + motionArea.height / 2
        };
        
        // 确保边界在容器内
        bounds.minX = Math.max(containerRect.width * 0.55, bounds.minX); // 不要太靠左
        bounds.maxX = Math.min(containerRect.width - 20, bounds.maxX);
        bounds.minY = Math.max(10, bounds.minY);
        bounds.maxY = Math.min(80, bounds.maxY);
        
        // 初始位置设置在运动区域中心
        let currentX = motionArea.centerX;
        let currentY = motionArea.centerY;
        
        // 设置按钮初始位置
        button.style.left = currentX - button.offsetWidth / 2 + 'px';
        button.style.top = currentY - button.offsetHeight / 2 + 'px';
        
        // 运动参数（适中的速度，让用户有机会点击）
        let velocityX = (Math.random() + 0.1) * 3; // 适中的初始速度
        let velocityY = (Math.random() + 0.1) * 3;
        const friction = 0.996; // 较小的阻力
        const minSpeed = 5;  // 最小速度
        const maxSpeed = 8;  // 最大速度（不要太快）
        
        // 开始随机运动
        window.randomMotionInterval = setInterval(() => {
            // 更新位置
            currentX += velocityX;
            currentY += velocityY;
            
            // 边界碰撞检测和反弹
            if (currentX <= bounds.minX || currentX >= bounds.maxX) {
                velocityX = -velocityX * 0.7; // 反弹
                currentX = Math.max(bounds.minX, Math.min(bounds.maxX, currentX));
                // 添加轻微随机性
                velocityY += (Math.random() - 0.5) * 1;
            }
            
            if (currentY <= bounds.minY || currentY >= bounds.maxY) {
                velocityY = -velocityY * 0.7; // 反弹
                currentY = Math.max(bounds.minY, Math.min(bounds.maxY, currentY));
                // 添加轻微随机性
                velocityX += (Math.random() - 0.5) * 1;
            }
            
            // 应用阻力
            velocityX *= friction;
            velocityY *= friction;
            
            // 如果速度太小，给它一个温和的推力
            const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            if (speed < minSpeed) {
                const angle = Math.random() * Math.PI * 2;
                const newSpeed = minSpeed + Math.random() * (maxSpeed - minSpeed);
                velocityX = Math.cos(angle) * newSpeed;
                velocityY = Math.sin(angle) * newSpeed;
            }
            
            // 限制最大速度
            if (speed > maxSpeed) {
                velocityX = (velocityX / speed) * maxSpeed;
                velocityY = (velocityY / speed) * maxSpeed;
            }
            
            // 偶尔添加轻微的随机扰动
            if (Math.random() < 0.06) {
                velocityX += (Math.random() - 0.5) * 1.5;
                velocityY += (Math.random() - 0.5) * 1.5;
            }
            
            // 更新按钮位置
            button.style.left = currentX - button.offsetWidth / 2 + 'px';
            button.style.top = currentY - button.offsetHeight / 2 + 'px';
            
        }, 30); // 30ms间隔，适中的帧率
        
        // 鼠标悬停时添加轻微扰动（不要太强烈）
        button.addEventListener('mouseenter', function addDisturbance() {
            velocityX += (Math.random() - 0.5) * 3;
            velocityY += (Math.random() - 0.5) * 3;
        });
    }
    
    // 更改背景音乐
    function changeBgMusic(src) {
        bgMusic.pause();
        bgMusic.src = src;
        bgMusic.play().catch(e => console.log("播放被阻止，需要用户交互"));
    }
    
    // 禁用按钮
    function disableButtons() {
        acceptBtn.disabled = true;
        rejectBtn.disabled = true;
        acceptBtn.style.cursor = "default";
        rejectBtn.style.cursor = "default";
    }
    
    // 创建表情雨效果
    function createEmojiRain() {
        const emojis = ['🍗', '🍔', '🍟', '🎉', '❤️', '😍', '👍'];
        const container = document.querySelector('.container');
        
        for (let i = 0; i < 50; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'emoji-rain';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * 100 + '%';
            emoji.style.animationDuration = Math.random() * 3 + 2 + 's';
            emoji.style.fontSize = Math.random() * 20 + 10 + 'px';
            
            container.appendChild(emoji);
            
            setTimeout(() => {
                emoji.remove();
            }, 5000);
        }
    }
    
    // 初始化菜单
    function initMenu() {
        menuItems.innerHTML = ''; // 清空菜单内容
        
        menuData.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.setAttribute('role', 'button');
            menuItem.setAttribute('tabindex', '0');
            
            // 使用实际图片替代SVG
            const imgSrc = `图片/${item.name}.png`;
            
            menuItem.innerHTML = `
                <div class="food-image">
                    <img src="${imgSrc}" alt="${item.name}" loading="lazy">
                </div>
                <h3>${item.name}</h3>
                <p>${item.price}</p>
                <span class="menu-item-hint">点击前往购买</span>
            `;
            
            // 添加点击事件
            menuItem.addEventListener('click', () => {
                window.open('https://order.kfc.com.cn/preorder-taro/home', '_blank');
            });
            
            // 添加键盘访问支持
            menuItem.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    window.open('https://order.kfc.com.cn/preorder-taro/home', '_blank');
                }
            });
            
            menuItems.appendChild(menuItem);
        });
    }
    
    // 显示菜单
    function showMenu() {
        menuContainer.classList.remove('hidden');
    }
    
    // 隐藏菜单
    function hideMenu() {
        menuContainer.classList.add('hidden');
    }
    
    // 检测是否在微信浏览器中
    function isWeixinBrowser() {
        const ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('micromessenger') !== -1;
    }
    
    // 显示分享选项
    function showShareOptions() {
        // 更新分享弹窗内容
        const shareContent = document.querySelector('.share-content');
        
        shareContent.innerHTML = `
            <h3>分享给好友</h3>
            <div class="share-methods">
                <div class="share-method" id="share-wechat">
                    <div class="share-icon">💬</div>
                    <div>微信好友</div>
                </div>
                <div class="share-method" id="share-timeline">
                    <div class="share-icon">👥</div>
                    <div>朋友圈</div>
                </div>
                <div class="share-method" id="share-copy">
                    <div class="share-icon">📋</div>
                    <div>复制链接</div>
                </div>
                <div class="share-method" id="share-image">
                    <div class="share-icon">🖼️</div>
                    <div>保存图片</div>
                </div>
            </div>
            <div class="qrcode-container" id="qrcode">
                <!-- 这里将通过JS生成二维码 -->
            </div>
            <p class="share-tip">扫描二维码或保存图片分享</p>
            <button id="close-share">关闭</button>
        `;
        
        // 显示分享弹窗
        shareContainer.classList.remove('hidden');
        
        // 生成二维码
        generateQRCode();
        
        // 绑定事件
        document.getElementById('share-wechat').addEventListener('click', () => {
            alert('请点击右上角按钮，选择"分享给朋友"');
        });
        
        document.getElementById('share-timeline').addEventListener('click', () => {
            alert('请点击右上角按钮，选择"分享到朋友圈"');
        });
        
        document.getElementById('share-copy').addEventListener('click', () => {
            copyToClipboard(window.location.href);
            alert('链接已复制，快去粘贴给好友吧！');
        });
        
        document.getElementById('share-image').addEventListener('click', () => {
            generateShareImage().then(() => {
                saveShareImage();
            });
        });
        
        document.getElementById('close-share').addEventListener('click', hideShareOptions);
    }
    
    // 复制到剪贴板
    function copyToClipboard(text) {
        const input = document.createElement('input');
        input.style.position = 'fixed';
        input.style.opacity = 0;
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }
    
    // 生成二维码
    function generateQRCode() {
        const qrcodeContainer = document.getElementById('qrcode');
        qrcodeContainer.innerHTML = '';
        
        // 使用QRCode.js生成二维码
        try {
            new QRCode(qrcodeContainer, {
                text: window.location.href,
                width: 150,
                height: 150,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (e) {
            // 如果QRCode.js未加载，显示提示
            qrcodeContainer.innerHTML = `
                <div style="background:#f0f0f0;width:150px;height:150px;margin:0 auto;display:flex;align-items:center;justify-content:center;">
                    <span style="font-size:12px;color:#666;">扫描二维码访问</span>
                </div>
            `;
        }
    }
    
    // 分享给朋友
    function shareToFriends() {
        // 检查是否在微信浏览器中
        if (isWeixinBrowser()) {
            // 提示用户点击右上角分享
            alert('请点击右上角的菜单按钮，然后选择"分享到朋友圈"或"分享给朋友"');
        } else if (navigator.share) {
            // 使用Web Share API (现代浏览器支持)
            navigator.share({
                title: '疯狂星期四',
                text: '今天星期四，兄dei，请我吃个肯德基呗~',
                url: window.location.href
            })
            .then(() => console.log('分享成功'))
            .catch((error) => console.log('分享失败:', error));
        } else {
            // 不支持直接分享时，显示分享弹窗
            showShareOptions();
        }
    }
    
    // 隐藏分享选项
    function hideShareOptions() {
        shareContainer.classList.add('hidden');
    }
    
    // 生成分享图片
    async function generateShareImage() {
        const ctx = shareCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, shareCanvas.width, shareCanvas.height);
        
        // 绘制标题
        ctx.fillStyle = '#e4002b';
        ctx.font = 'bold 24px Microsoft YaHei';
        ctx.textAlign = 'center';
        ctx.fillText('疯狂星期四', shareCanvas.width / 2, 40);
        
        // 绘制表情包
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        try {
            // 使用当前显示的图片
            const currentImage = document.getElementById('mood-image').src;
            img.src = currentImage;
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            
            // 计算图片绘制尺寸，保持宽高比
            const aspectRatio = img.width / img.height;
            let drawWidth = 250;
            let drawHeight = drawWidth / aspectRatio;
            
            // 居中绘制图片
            ctx.drawImage(
                img, 
                (shareCanvas.width - drawWidth) / 2, 
                60, 
                drawWidth, 
                drawHeight
            );
            
            // 绘制文案
            ctx.fillStyle = '#333333';
            ctx.font = '16px Microsoft YaHei';
            
            const currentText = document.getElementById('text-content').textContent;
            wrapText(ctx, currentText, shareCanvas.width / 2, 60 + drawHeight + 30, 250, 20);
            
            // 绘制底部信息
            ctx.fillStyle = '#666666';
            ctx.font = '14px Microsoft YaHei';
            ctx.fillText('长按扫码，一起过疯狂星期四', shareCanvas.width / 2, shareCanvas.height - 20);
            
        } catch (error) {
            console.error('生成分享图片失败:', error);
            
            // 如果加载图片失败，绘制一个简单的替代图像
            ctx.fillStyle = '#ffcc80';
            ctx.fillRect((shareCanvas.width - 200) / 2, 60, 200, 150);
            
            ctx.fillStyle = '#e4002b';
            ctx.font = 'bold 18px Microsoft YaHei';
            ctx.fillText('疯狂星期四', shareCanvas.width / 2, 140);
            
            // 绘制文案
            ctx.fillStyle = '#333333';
            ctx.font = '16px Microsoft YaHei';
            ctx.fillText('今天星期四，兄dei，请我吃个肯德基呗~', shareCanvas.width / 2, 240);
        }
    }
    
    // 文本自动换行函数
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split('');
        let line = '';
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i];
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && i > 0) {
                context.fillText(line, x, y);
                line = words[i];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        
        context.fillText(line, x, y);
    }
    
    // 保存分享图片
    function saveShareImage() {
        try {
            // 创建一个临时链接并触发下载
            const link = document.createElement('a');
            link.download = '疯狂星期四.png';
            link.href = shareCanvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            alert('图片已保存，请发送给微信好友或分享到朋友圈！');
        } catch (error) {
            console.error('保存图片失败:', error);
            alert('保存图片失败，请尝试长按图片手动保存。');
        }
    }
    

    
    // 初始化应用
    init();
    
    // 页面加载完成后再次检查按钮状态
    setTimeout(() => {
        const acceptBtn = document.getElementById('accept-btn');
        const rejectBtn = document.getElementById('reject-btn');
        
        if (acceptBtn.textContent !== "v我50") {
            acceptBtn.textContent = "v我50";
            console.log('修正了同意按钮文本');
        }
        
        if (rejectBtn.textContent !== "拒绝") {
            rejectBtn.textContent = "拒绝";
            console.log('修正了拒绝按钮文本');
        }
        
        // 确保拒绝按钮样式正确
        if (rejectBtn.style.backgroundColor === 'rgb(228, 0, 43)' || 
            rejectBtn.style.backgroundColor === '#e4002b') {
            rejectBtn.style.backgroundColor = '#f8f8f8';
            rejectBtn.style.color = '#333';
            rejectBtn.style.border = '1px solid #ddd';
            console.log('修正了拒绝按钮样式');
        }
    }, 100);
    
    // 添加定期检查机制，确保拒绝按钮始终可见
    setInterval(() => {
        if (!gameOver) {
            const rejectBtn = document.getElementById('reject-btn');
            if (rejectBtn) {
                const computedStyle = window.getComputedStyle(rejectBtn);
                
                // 如果按钮不可见，强制显示
                if (computedStyle.opacity < 0.3 || computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
                    rejectBtn.style.display = 'block';
                    rejectBtn.style.visibility = 'visible';
                    rejectBtn.style.opacity = '0.8';
                    rejectBtn.style.pointerEvents = 'auto';
                }
            }
        }
    }, 2000); // 每2秒检查一次，降低频率
}); 