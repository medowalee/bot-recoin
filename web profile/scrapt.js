// تحديث الحواف والمسافة الداخلية مباشرة على منطقة البروفايل
function updateProfileAreaSpacing() {
    const area = document.getElementById('profileArea');
    const mt = document.getElementById('marginTop').value || 0;
    const mr = document.getElementById('marginRight').value || 0;
    const mb = document.getElementById('marginBottom').value || 0;
    const ml = document.getElementById('marginLeft').value || 0;
    const pt = document.getElementById('paddingTop').value || 0;
    const pr = document.getElementById('paddingRight').value || 0;
    const pb = document.getElementById('paddingBottom').value || 0;
    const pl = document.getElementById('paddingLeft').value || 0;
    area.style.margin = `${mt}px ${mr}px ${mb}px ${ml}px`;
    area.style.padding = `${pt}px ${pr}px ${pb}px ${pl}px`;
}

['marginTop','marginRight','marginBottom','marginLeft','paddingTop','paddingRight','paddingBottom','paddingLeft'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateProfileAreaSpacing);
});
// زر الحفظ: يجمع كل الإعدادات ويرسلها إلى ملف JSON (جاهز للباك اند)
document.getElementById('saveProfile').onclick = function() {
    // الحواف والمسافة الداخلية
    const margin = {
        top: document.getElementById('marginTop').value || 0,
        right: document.getElementById('marginRight').value || 0,
        bottom: document.getElementById('marginBottom').value || 0,
        left: document.getElementById('marginLeft').value || 0
    };
    const padding = {
        top: document.getElementById('paddingTop').value || 0,
        right: document.getElementById('paddingRight').value || 0,
        bottom: document.getElementById('paddingBottom').value || 0,
        left: document.getElementById('paddingLeft').value || 0
    };
    // بقية البيانات (مثال: الاسم، العملات، المستوى، الخ)
    const name = document.getElementById('nameInput').value;
    const coins = document.getElementById('coinsInput').value;
    const level = document.getElementById('levelInput').value;
    // صورة البروفايل والخلفية
    const profilePic = document.getElementById('profilePic').src;
    const bgImg = document.getElementById('bgImg').src;
    // إحداثيات العناصر
    const area = document.getElementById('profileArea');
    const coords = {};
    area.querySelectorAll('.draggable').forEach(el => {
        coords[el.id || el.textContent] = {
            left: el.style.left || '0px',
            top: el.style.top || '0px',
            value: el.tagName === 'IMG' ? el.src : el.textContent
        };
    });
    // بناء الكائن النهائي
    const config = {
        margin,
        padding,
        name,
        coins,
        level,
        profilePic,
        bgImg,
        coords
    };
    // إرسال للباك اند (مثال AJAX)
    fetch('/data/profile_config.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config, null, 2)
    }).then(r => {
        if(r.ok) alert('تم حفظ الإعدادات بنجاح!');
        else alert('حدث خطأ أثناء الحفظ');
    }).catch(()=>alert('تعذر الاتصال بالسيرفر'));
};
// دالة لتحديث البروفايل تلقائياً
function updateProfile() {
    const name = document.getElementById('nameInput').value || 'name';
    const coins = document.getElementById('coinsInput').value || 'coins';
    const level = document.getElementById('levelInput').value || 'level';
    const file = document.getElementById('profilePicInput') ? document.getElementById('profilePicInput').files[0] : null;
    const bgFile = document.getElementById('bgInput').files[0];

    const profilePic = document.getElementById('profilePic');
    const nameDiv = document.getElementById('name');
    const coinsDiv = document.getElementById('coins');
    const levelDiv = document.getElementById('level');
    const bgImg = document.getElementById('bgImg');

    // Handle background image
    if (bgFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            bgImg.src = e.target.result;
            bgImg.style.display = 'block';
        };
        reader.readAsDataURL(bgFile);
    } else {
        bgImg.style.display = 'none';
    }

    // Handle profile picture
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePic.src = e.target.result;
            profilePic.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        profilePic.src = "data:image/png;base64,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";
        profilePic.style.display = 'block';
    }

    nameDiv.textContent = name;
    coinsDiv.textContent = coins + ' coins';
    levelDiv.textContent = 'Level ' + level;
    nameDiv.style.display = 'block';
    coinsDiv.style.display = 'block';
    levelDiv.style.display = 'block';

    document.getElementById('getCoords').style.display = 'inline-block';
}

// إضافة event listeners للتحديث التلقائي
document.addEventListener('DOMContentLoaded', function() {
    // تحديث عند تغيير النص في حقول الإدخال
    document.getElementById('nameInput').addEventListener('input', updateProfile);
    document.getElementById('coinsInput').addEventListener('input', updateProfile);
    document.getElementById('levelInput').addEventListener('input', updateProfile);
    
    // تحديث عند تغيير الصور
    document.getElementById('bgInput').addEventListener('change', updateProfile);
    
    // إذا كان هناك حقل لصورة البروفايل
    const profilePicInput = document.getElementById('profilePicInput');
    if (profilePicInput) {
        profilePicInput.addEventListener('change', updateProfile);
    }
    
    // تحديث أولي لإظهار القيم الافتراضية
    updateProfile();
    
    // تهيئة نظام التبويب
    initTabSystem();
    
    // تهيئة نظام التحكم
    initControlSystem();
});

// الاحتفاظ بالوظيفة الأصلية للزر (اختيارية)
document.getElementById('showProfile').onclick = updateProfile;

// Make elements draggable inside profileArea
function makeDraggable(el) {
    // إضافة مؤشر تغيير الحجم
    el.style.position = 'absolute';
    el.style.border = '1px dashed transparent';
    el.style.cursor = 'move';
    
    // إضافة مقبض تغيير الحجم
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.cssText = `
        position: absolute;
        bottom: -5px;
        right: -5px;
        width: 12px;
        height: 12px;
        background: #4CAF50;
        cursor: se-resize;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        border: 2px solid white;
    `;
    el.appendChild(resizeHandle);
    
    // إظهار الحدود والمقبض عند التمرير
    el.addEventListener('mouseenter', function() {
        el.style.border = '1px dashed #4CAF50';
        resizeHandle.style.opacity = '1';
    });
    
    el.addEventListener('mouseleave', function() {
        el.style.border = '1px dashed transparent';
        resizeHandle.style.opacity = '0';
    });
    
    let offsetX, offsetY, isDown = false, isResizing = false;
    
    // وظيفة السحب
    el.onmousedown = function(e) {
        if (e.target === resizeHandle) {
            isResizing = true;
            e.stopPropagation();
            return;
        }
        
        isDown = true;
        const rect = el.getBoundingClientRect();
        const parentRect = el.parentElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        document.onmousemove = function(e2) {
            if (!isDown) return;
            let x = e2.clientX - parentRect.left - offsetX;
            let y = e2.clientY - parentRect.top - offsetY;
            // Keep inside parent
            x = Math.max(0, Math.min(x, el.parentElement.offsetWidth - el.offsetWidth));
            y = Math.max(0, Math.min(y, el.parentElement.offsetHeight - el.offsetHeight));
            el.style.left = x + 'px';
            el.style.top = y + 'px';
        };
        
        document.onmouseup = function() {
            isDown = false;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
    
    // وظيفة تغيير الحجم
    resizeHandle.onmousedown = function(e) {
        isResizing = true;
        e.stopPropagation();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(document.defaultView.getComputedStyle(el).width, 10);
        const startHeight = parseInt(document.defaultView.getComputedStyle(el).height, 10);
        
        document.onmousemove = function(e2) {
            if (!isResizing) return;
            
            const newWidth = startWidth + e2.clientX - startX;
            const newHeight = startHeight + e2.clientY - startY;
            
            // حد أدنى للحجم
            if (newWidth > 20) {
                el.style.width = newWidth + 'px';
            }
            if (newHeight > 20) {
                el.style.height = newHeight + 'px';
            }
        };
        
        document.onmouseup = function() {
            isResizing = false;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

// جعل العناصر قابلة للسحب بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    ['profilePic','name','coins','level'].forEach(id => {
        makeDraggable(document.getElementById(id));
    });
});

// إضافة خانات جديدة ديناميكياً
document.getElementById('addField').onclick = function() {
    const fieldName = prompt('اسم الخانة الجديدة؟');
    if (!fieldName) return;
    // إنشاء div جديد
    const div = document.createElement('div');
    div.className = 'draggable';
    div.textContent = fieldName;
    div.id = 'field_' + Date.now(); // إضافة ID فريد
    div.style.left = '0px';
    div.style.top = '0px';
    div.style.display = 'block';
    // إضافة للمنطقة
    document.getElementById('profileArea').appendChild(div);
    makeDraggable(div);
    
    // تحديث قائمة العناصر في التحكم
    updateElementSelect();
};

// Get coordinates of all elements
document.getElementById('getCoords').onclick = function() {
    const area = document.getElementById('profileArea');
    const coords = {};
    
    // جمع بيانات كل العناصر القابلة للسحب
    area.querySelectorAll('.draggable').forEach(el => {
        const elementId = el.id || el.textContent;
        coords[elementId] = {
            left: el.style.left || '0px',
            top: el.style.top || '0px',
            width: el.style.width || 'auto',
            height: el.style.height || 'auto',
            fontSize: el.style.fontSize || 'inherit',
            color: el.style.color || '#ffffff',
            value: el.tagName === 'IMG' ? el.src : el.textContent
        };
    });
    
    // إنشاء النافذة المنبثقة
    createCoordinatesPopup(coords);
};

// دالة لإنشاء النافذة المنبثقة
function createCoordinatesPopup(coords) {
    // إنشاء overlay للخلفية
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    
    // إنشاء النافذة المنبثقة
    const popup = document.createElement('div');
    popup.className = 'popup-content';
    
    // عنوان النافذة
    const title = document.createElement('h2');
    title.textContent = 'تعديل الإحداثيات والأحجام';
    title.className = 'popup-title';
    
    // إنشاء النموذج
    const form = document.createElement('div');
    
    Object.keys(coords).forEach(elementId => {
        const elementData = coords[elementId];
        
        // حاوية لكل عنصر
        const elementContainer = document.createElement('div');
        elementContainer.className = 'element-container';
        
        // عنوان العنصر
        const elementTitle = document.createElement('h3');
        elementTitle.textContent = elementId;
        elementTitle.className = 'element-title';
        
        // إنشاء حقول الإدخال
        const fields = [
            { label: 'الموضع الأفقي (Left)', key: 'left', value: elementData.left, type: 'text' },
            { label: 'الموضع العمودي (Top)', key: 'top', value: elementData.top, type: 'text' },
            { label: 'العرض (Width)', key: 'width', value: elementData.width, type: 'text' },
            { label: 'الارتفاع (Height)', key: 'height', value: elementData.height, type: 'text' },
            { label: 'حجم الخط (Font Size)', key: 'fontSize', value: elementData.fontSize, type: 'text' },
            { label: 'لون النص (Color)', key: 'color', value: elementData.color || '#ffffff', type: 'color' }
        ];
        
        fields.forEach(field => {
            const fieldContainer = document.createElement('div');
            fieldContainer.className = 'field-container';
            
            const label = document.createElement('label');
            label.textContent = field.label + ':';
            label.className = 'field-label';
            
            const input = document.createElement('input');
            input.type = field.type || 'text';
            input.value = field.value;
            input.dataset.elementId = elementId;
            input.dataset.property = field.key;
            input.className = 'field-input';
            
            // إضافة معالج خاص للألوان
            if (field.type === 'color') {
                input.style.width = '60px';
                input.style.height = '40px';
                input.style.padding = '2px';
                input.style.border = 'none';
                input.style.borderRadius = '5px';
                input.style.cursor = 'pointer';
            }
            
            // تحديث فوري عند التغيير
            input.addEventListener('input', function() {
                updateElementProperty(this.dataset.elementId, this.dataset.property, this.value);
            });
            
            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
            elementContainer.appendChild(fieldContainer);
        });
        
        form.appendChild(elementTitle);
        form.appendChild(elementContainer);
    });
    
    // أزرار التحكم
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    // زر حفظ التغييرات
    const saveButton = document.createElement('button');
    saveButton.textContent = 'حفظ التغييرات';
    saveButton.className = 'popup-button';
    saveButton.style.background = '#2196F3';
    saveButton.onclick = function() {
        // تطبيق جميع التغييرات
        const inputs = popup.querySelectorAll('.field-input');
        inputs.forEach(input => {
            updateElementProperty(input.dataset.elementId, input.dataset.property, input.value);
        });
        
        // تأثير بصري للحفظ
        saveButton.textContent = 'تم الحفظ! ✓';
        saveButton.style.background = '#1976D2';
        setTimeout(() => {
            saveButton.textContent = 'حفظ التغييرات';
            saveButton.style.background = '#2196F3';
        }, 2000);
    };
    
    // زر النسخ
    const copyButton = document.createElement('button');
    copyButton.textContent = 'نسخ البيانات';
    copyButton.className = 'popup-button copy-button';
    copyButton.onclick = function() {
        // تحديث البيانات قبل النسخ
        const inputs = popup.querySelectorAll('.field-input');
        inputs.forEach(input => {
            const elementId = input.dataset.elementId;
            const property = input.dataset.property;
            if (!coords[elementId]) coords[elementId] = {};
            coords[elementId][property] = input.value;
        });
        
        navigator.clipboard.writeText(JSON.stringify(coords, null, 2));
        
        // تأثير بصري للنسخ
        copyButton.textContent = 'تم النسخ! ✓';
        copyButton.style.background = '#45a049';
        setTimeout(() => {
            copyButton.textContent = 'نسخ البيانات';
            copyButton.style.background = '#4CAF50';
        }, 2000);
    };
    
    // زر الإغلاق
    const closeButton = document.createElement('button');
    closeButton.textContent = 'إغلاق';
    closeButton.className = 'popup-button close-button';
    closeButton.onclick = function() {
        overlay.style.animation = 'popupSlideOut 0.3s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    };
    
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(closeButton);
    
    // تجميع العناصر
    popup.appendChild(title);
    popup.appendChild(form);
    popup.appendChild(buttonContainer);
    overlay.appendChild(popup);
    
    // إضافة للصفحة
    document.body.appendChild(overlay);
    
    // إغلاق عند الضغط على الخلفية
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// دالة لتحديث خصائص العنصر
function updateElementProperty(elementId, property, value) {
    const element = document.getElementById(elementId) || 
                   Array.from(document.querySelectorAll('.draggable')).find(el => el.textContent === elementId);
    
    if (element) {
        element.style[property] = value;
    }
}

// نظام التبويب
function initTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // إزالة الفئة النشطة من جميع الأزرار والمحتويات
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // إضافة الفئة النشطة للزر والمحتوى المحدد
            this.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });
}

// نظام التحكم
function initControlSystem() {
    const elementSelect = document.getElementById('elementSelect');
    const elementControls = document.getElementById('elementControls');
    
    // عند اختيار عنصر
    elementSelect.addEventListener('change', function() {
        if (this.value) {
            elementControls.style.display = 'block';
            loadElementProperties(this.value);
        } else {
            elementControls.style.display = 'none';
        }
    });
    
    // تطبيق التغييرات
    document.getElementById('applyChanges').addEventListener('click', applyElementChanges);
    
    // إعادة تعيين العنصر
    document.getElementById('resetElement').addEventListener('click', resetElement);
    
    // الإجراءات السريعة
    document.getElementById('centerAll').addEventListener('click', centerAllElements);
    document.getElementById('alignLeft').addEventListener('click', alignElementsLeft);
    document.getElementById('alignRight').addEventListener('click', alignElementsRight);
    document.getElementById('distributeVertical').addEventListener('click', distributeElementsVertical);
    
    // تحديث فوري عند تغيير القيم
    const controlInputs = document.querySelectorAll('.control-input, .color-input');
    controlInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (elementSelect.value) {
                applyElementChanges();
            }
        });
    });
}

// تحميل خصائص العنصر المحدد
function loadElementProperties(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const computedStyle = window.getComputedStyle(element);
    
    // تحديث حقول الإدخال
    document.getElementById('posX').value = parseInt(element.style.left) || 0;
    document.getElementById('posY').value = parseInt(element.style.top) || 0;
    document.getElementById('elementWidth').value = parseInt(element.style.width) || '';
    document.getElementById('elementHeight').value = parseInt(element.style.height) || '';
    document.getElementById('fontSize').value = parseInt(element.style.fontSize) || 16;
    document.getElementById('textColor').value = rgbToHex(element.style.color) || '#ffffff';
}

// تطبيق التغييرات على العنصر
function applyElementChanges() {
    const elementId = document.getElementById('elementSelect').value;
    if (!elementId) return;
    
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const posX = document.getElementById('posX').value;
    const posY = document.getElementById('posY').value;
    const width = document.getElementById('elementWidth').value;
    const height = document.getElementById('elementHeight').value;
    const fontSize = document.getElementById('fontSize').value;
    const color = document.getElementById('textColor').value;
    
    // تطبيق التغييرات
    if (posX !== '') element.style.left = posX + 'px';
    if (posY !== '') element.style.top = posY + 'px';
    if (width !== '') element.style.width = width + 'px';
    if (height !== '') element.style.height = height + 'px';
    if (fontSize !== '') element.style.fontSize = fontSize + 'px';
    if (color !== '') element.style.color = color;
}

// إعادة تعيين العنصر
function resetElement() {
    const elementId = document.getElementById('elementSelect').value;
    if (!elementId) return;
    
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // إعادة تعيين الخصائص
    element.style.left = '0px';
    element.style.top = '0px';
    element.style.width = 'auto';
    element.style.height = 'auto';
    element.style.fontSize = '16px';
    element.style.color = '#ffffff';
    
    // تحديث حقول الإدخال
    loadElementProperties(elementId);
}

// توسيط جميع العناصر
function centerAllElements() {
    const profileArea = document.getElementById('profileArea');
    const elements = profileArea.querySelectorAll('.draggable');
    const areaWidth = profileArea.offsetWidth;
    const areaHeight = profileArea.offsetHeight;
    
    elements.forEach(element => {
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        
        element.style.left = (areaWidth - elementWidth) / 2 + 'px';
        element.style.top = (areaHeight - elementHeight) / 2 + 'px';
    });
}

// محاذاة العناصر لليسار
function alignElementsLeft() {
    const elements = document.querySelectorAll('.draggable');
    elements.forEach(element => {
        element.style.left = '10px';
    });
}

// محاذاة العناصر لليمين
function alignElementsRight() {
    const profileArea = document.getElementById('profileArea');
    const elements = profileArea.querySelectorAll('.draggable');
    const areaWidth = profileArea.offsetWidth;
    
    elements.forEach(element => {
        const elementWidth = element.offsetWidth;
        element.style.left = (areaWidth - elementWidth - 10) + 'px';
    });
}

// توزيع العناصر عمودياً
function distributeElementsVertical() {
    const profileArea = document.getElementById('profileArea');
    const elements = Array.from(profileArea.querySelectorAll('.draggable'));
    const areaHeight = profileArea.offsetHeight;
    
    if (elements.length <= 1) return;
    
    const spacing = areaHeight / (elements.length + 1);
    
    elements.forEach((element, index) => {
        element.style.top = (spacing * (index + 1) - element.offsetHeight / 2) + 'px';
    });
}

// تحويل RGB إلى HEX
function rgbToHex(rgb) {
    if (!rgb || rgb === 'rgb(255, 255, 255)') return '#ffffff';
    
    const result = rgb.match(/\d+/g);
    if (!result) return '#ffffff';
    
    return '#' + result.map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

// تحديث قائمة العناصر عند إضافة عناصر جديدة
function updateElementSelect() {
    const elementSelect = document.getElementById('elementSelect');
    const profileArea = document.getElementById('profileArea');
    const elements = profileArea.querySelectorAll('.draggable');
    
    // مسح الخيارات الحالية (عدا الخيار الأول)
    while (elementSelect.children.length > 1) {
        elementSelect.removeChild(elementSelect.lastChild);
    }
    
    // إضافة العناصر الجديدة
    elements.forEach(element => {
        if (element.id && !['profilePic', 'name', 'coins', 'level'].includes(element.id)) {
            const option = document.createElement('option');
            option.value = element.id || element.textContent;
            option.textContent = element.textContent || element.id;
            elementSelect.appendChild(option);
        }
    });
}