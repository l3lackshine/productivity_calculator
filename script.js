// =======================================================
// ตัวแปรสำหรับนาฬิกาจับเวลา (ประกาศภายนอกเพื่อให้เข้าถึงได้ทุกฟังก์ชัน)
// =======================================================
let startTime = 0;
let elapsedTime = 0; // เวลารวมที่ผ่านไป (เป็น milliseconds)
let tInterval;
let running = false;
let lapCounter = 1; 

// กำหนดขีดจำกัดเวลาสูงสุดสำหรับการแสดงผลวงแหวน (60 วินาทีต่อรอบ)
const MAX_TIME_SECONDS = 60; 
const DASH_ARRAY = 283; 

// ตัวแปรสำหรับ Element ใน HTML (กำหนดให้เป็น Global ก่อน)
let display;
let startBtn;
let lapBtn;
let resetBtn;
let progressCircle;
let lapTimesDiv;


// =======================================================
// จุดเริ่มต้น: ตรวจสอบให้แน่ใจว่า HTML โหลดเสร็จแล้ว
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // กำหนดค่าตัวแปร Element ให้ถูกต้องเมื่อ DOM โหลดเสร็จแล้ว
    display = document.getElementById('display');
    startBtn = document.getElementById('start-btn');
    lapBtn = document.getElementById('lap-btn');
    resetBtn = document.getElementById('reset-btn');
    progressCircle = document.getElementById('progress-circle');
    lapTimesDiv = document.getElementById('lap-times');

    // สร้าง header ของตาราง Lap Time เมื่อโหลดหน้าเว็บ
    lapTimesDiv.innerHTML = '<div class="lap-header"><div>#</div><div>เวลา Lap</div><div>รวม</div></div>';
});


// =======================================================
// ฟังก์ชันนาฬิกาจับเวลา
// =======================================================

/**
 * ฟังก์ชันเริ่มต้น/หยุดนาฬิกาจับเวลา
 */
function startStopwatch() {
    // ตรวจสอบความพร้อมของ Element อีกครั้ง
    if (!display || !startBtn) {
        console.error("Stopwatch elements are not initialized.");
        return; 
    }

    if (!running) {
        // แก้ไขจุดสำคัญ: ให้นำ elapsedTime เดิม มาลบออกจากเวลาปัจจุบัน
        startTime = Date.now() - elapsedTime; 
        
        tInterval = setInterval(getShowTime, 10); 
        
        startBtn.innerHTML = "❚❚"; 
        startBtn.classList.add('running'); 
        lapBtn.disabled = false;
        resetBtn.disabled = false; 
        running = true;
    } else {
        // หยุดการทำงานชั่วคราว
        clearInterval(tInterval);
        startBtn.innerHTML = "▶"; 
        startBtn.classList.remove('running'); 
        running = false;
    }
}

/**
 * ฟังก์ชันแสดงผลเวลาที่ผ่านไปและอัปเดตวงแหวน
 */
function getShowTime() {
    elapsedTime = Date.now() - startTime;

    // คำนวณเวลา
    let totalSeconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);
    
    // อัปเดต Display
    const formattedTime = 
        (minutes < 10 ? "0" + minutes : minutes) + ":" + 
        (seconds < 10 ? "0" + seconds : seconds) + "." + 
        (milliseconds < 10 ? "0" + milliseconds : milliseconds);

    display.innerHTML = formattedTime;

    // อัปเดตวงแหวน
    let progress = totalSeconds % MAX_TIME_SECONDS;
    let percentage = (progress / MAX_TIME_SECONDS) * DASH_ARRAY;
    progressCircle.style.strokeDashoffset = DASH_ARRAY - percentage;
}

/**
 * ฟังก์ชันรีเซ็ตนาฬิกาทั้งหมด
 */
function resetStopwatch() {
    clearInterval(tInterval);
    running = false;
    startTime = 0;
    elapsedTime = 0;
    lapCounter = 1;
    
    display.innerHTML = "00:00.00";
    progressCircle.style.strokeDashoffset = DASH_ARRAY;
    startBtn.innerHTML = "▶";
    startBtn.classList.remove('running'); 
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    
    // ล้างค่าในช่อง Input และ Lap Times
    document.getElementById('time1').value = '';
    document.getElementById('time2').value = '';
    document.getElementById('time3').value = '';
    lapTimesDiv.innerHTML = '<div class="lap-header"><div>#</div><div>เวลา Lap</div><div>รวม</div></div>';
    
    document.getElementById('avg-time').textContent = "เวลาเฉลี่ย: - วินาทีต่อชิ้น";
    document.getElementById('productivity').textContent = "ผลผลิตต่อชั่วโมง: - ชิ้น";
}


/**
 * ฟังก์ชันบันทึกเวลา (Lap) และเริ่มจับเวลาชิ้นงานถัดไป
 */
function lapTime() {
    if (!running) {
        alert("กรุณา 'เริ่ม' หรือ 'ทำงานต่อ' นาฬิกาจับเวลาก่อน");
        return;
    }
    
    const currentLapTotalTime = elapsedTime / 1000;
    let lapDuration = currentLapTotalTime; 

    // หากมีการบันทึก Lap ก่อนหน้านี้, คำนวณ Lap Duration จริง
    if (lapCounter > 1) {
        const prevInputId = 'time' + (lapCounter - 1);
        const prevLapTotalTime = parseFloat(document.getElementById(prevInputId).value || 0);
        lapDuration = currentLapTotalTime - prevLapTotalTime;
    }

    // 1. บันทึกค่าลงใน Input (สำหรับการคำนวณผลผลิต)
    const inputId = 'time' + lapCounter;
    if (document.getElementById(inputId)) {
        document.getElementById(inputId).value = currentLapTotalTime.toFixed(2);
    }
    
    // 2. แสดงผลในตาราง Lap Times
    addLapTimeToDisplay(lapCounter, lapDuration, currentLapTotalTime);

    
    // 3. จัดการ Lap Counter และการรีเซ็ต
    if (lapCounter >= 3) {
        // ครบ 3 ครั้ง ให้หยุดนาฬิกาและคำนวณอัตโนมัติ
        startStopwatch(); 
        lapBtn.disabled = true;
        calculateProductivity();
        return;
    }
    
    lapCounter++;
    
    // 4. รีเซ็ตเวลาเริ่มต้นใหม่ เพื่อให้ Lap ถัดไปนับจาก 0
    // กำหนดจุดเริ่มต้นใหม่ โดยหัก Lap Time ออก
    startTime = Date.now(); 
    elapsedTime = 0; // ตั้งค่า elapsedTime เป็น 0 เพื่อให้ Lap ใหม่นับจากศูนย์
}

/**
 * สร้างและแสดงแถว Lap Time
 */
function addLapTimeToDisplay(index, lapDuration, totalTime) {
    const formatTime = (seconds) => {
        const totalMs = Math.round(seconds * 100);
        const minutes = Math.floor(totalMs / 6000);
        const secs = Math.floor((totalMs % 6000) / 100);
        const ms = totalMs % 100;
        return (minutes < 10 ? "0" + minutes : minutes) + ":" + 
               (secs < 10 ? "0" + secs : secs) + "." + 
               (ms < 10 ? "0" + ms : ms);
    };

    const newRow = document.createElement('div');
    newRow.className = 'lap-row';
    newRow.innerHTML = `
        <div class="lap-index">${index}</div>
        <div class="lap-duration">${formatTime(lapDuration)}</div>
        <div class="total-time">${formatTime(totalTime)}</div>
    `;

    const header = lapTimesDiv.querySelector('.lap-header');
    if (header) {
        lapTimesDiv.insertBefore(newRow, header.nextSibling);
    } else {
        lapTimesDiv.appendChild(newRow);
    }
}


// =======================================================
// ฟังก์ชันคำนวณผลผลิต
// =======================================================
function calculateProductivity() {
    const time1 = parseFloat(document.getElementById('time1').value);
    const time2 = parseFloat(document.getElementById('time2').value);
    const time3 = parseFloat(document.getElementById('time3').value);

    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (isNaN(time1) || isNaN(time2) || isNaN(time3) || time1 <= 0 || time2 <= 0 || time3 <= 0) {
        if (lapCounter <= 3) { // ใช้ lapCounter เพื่อตรวจสอบว่าการคำนวณนี้เกิดจากการกดปุ่มด้วยมือหรือไม่
            // alert("กรุณาบันทึกเวลาที่ถูกต้องครบทั้ง 3 ครั้ง ก่อนคำนวณ"); 
            // ลบ alert เพื่อไม่ให้รบกวนการทำงาน
        }
        document.getElementById('avg-time').textContent = "เวลาเฉลี่ย: - วินาทีต่อชิ้น";
        document.getElementById('productivity').textContent = "ผลผลิตต่อชั่วโมง: - ชิ้น";
        return;
    }

    const averageTime = (time1 + time2 + time3) / 3;
    const SECONDS_PER_HOUR = 3600;
    const productivityPerHour = SECONDS_PER_HOUR / averageTime;

    document.getElementById('avg-time').textContent = `เวลาเฉลี่ย: ${averageTime.toFixed(2)} วินาทีต่อชิ้น`;
    document.getElementById('productivity').textContent = `ผลผลิตต่อชั่วโมง: ${productivityPerHour.toFixed(2)} ชิ้น`;
}
        startBtn.innerHTML = "❚❚"; 
        startBtn.classList.add('running'); 
        lapBtn.disabled = false;
        resetBtn.disabled = false; 
        running = true;
    } else {
        // หยุดการทำงานชั่วคราว
        clearInterval(tInterval);
        startBtn.innerHTML = "▶"; 
        startBtn.classList.remove('running'); 
        running = false;
    }
}

/**
 * ฟังก์ชันแสดงผลเวลาที่ผ่านไปและอัปเดตวงแหวน
 */
function getShowTime() {
    // *** แก้ไขจุดสำคัญ: คำนวณ elapsedTime ใหม่ทุกครั้ง ***
    elapsedTime = Date.now() - startTime;

    // คำนวณเวลา
    let totalSeconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);
    
    // อัปเดต Display
    const formattedTime = 
        (minutes < 10 ? "0" + minutes : minutes) + ":" + 
        (seconds < 10 ? "0" + seconds : seconds) + "." + 
        (milliseconds < 10 ? "0" + milliseconds : milliseconds);

    display.innerHTML = formattedTime;

    // อัปเดตวงแหวน
    let progress = totalSeconds % MAX_TIME_SECONDS;
    let percentage = (progress / MAX_TIME_SECONDS) * DASH_ARRAY;
    progressCircle.style.strokeDashoffset = DASH_ARRAY - percentage;
}

/**
 * ฟังก์ชันรีเซ็ตนาฬิกาทั้งหมด
 */
function resetStopwatch() {
    clearInterval(tInterval);
    running = false;
    startTime = 0;
    elapsedTime = 0;
    lapCounter = 1;
    
    display.innerHTML = "00:00.00";
    progressCircle.style.strokeDashoffset = DASH_ARRAY;
    startBtn.innerHTML = "▶";
    startBtn.classList.remove('running'); 
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    
    // ล้างค่าในช่อง Input และ Lap Times
    document.getElementById('time1').value = '';
    document.getElementById('time2').value = '';
    document.getElementById('time3').value = '';
    lapTimesDiv.innerHTML = '<div class="lap-header"><div>#</div><div>เวลา Lap</div><div>รวม</div></div>';
    
    document.getElementById('avg-time').textContent = "เวลาเฉลี่ย: - วินาทีต่อชิ้น";
    document.getElementById('productivity').textContent = "ผลผลิตต่อชั่วโมง: - ชิ้น";
}


/**
 * ฟังก์ชันบันทึกเวลา (Lap) และเริ่มจับเวลาชิ้นงานถัดไป
 */
function lapTime() {
    if (!running) {
        alert("กรุณา 'เริ่ม' หรือ 'ทำงานต่อ' นาฬิกาจับเวลาก่อน");
        return;
    }
    
    const currentLapTotalTime = elapsedTime / 1000;
    let lapDuration = currentLapTotalTime; 

    // หากมีการบันทึก Lap ก่อนหน้านี้, คำนวณ Lap Duration จริง
    if (lapCounter > 1) {
        const prevInputId = 'time' + (lapCounter - 1);
        const prevLapTotalTime = parseFloat(document.getElementById(prevInputId).value || 0);
        lapDuration = currentLapTotalTime - prevLapTotalTime;
    }

    // 1. บันทึกค่าลงใน Input (สำหรับการคำนวณผลผลิต)
    const inputId = 'time' + lapCounter;
    if (document.getElementById(inputId)) {
        document.getElementById(inputId).value = currentLapTotalTime.toFixed(2);
    }
    
    // 2. แสดงผลในตาราง Lap Times
    addLapTimeToDisplay(lapCounter, lapDuration, currentLapTotalTime);

    
    // 3. จัดการ Lap Counter และการรีเซ็ต
    if (lapCounter >= 3) {
        // ครบ 3 ครั้ง ให้หยุดนาฬิกาและคำนวณอัตโนมัติ
        startStopwatch(); // เรียกเพื่อหยุดนาฬิกาและเปลี่ยนปุ่มเป็น ▶
        lapBtn.disabled = true;
        calculateProductivity();
        return;
    }
    
    lapCounter++;
    
    // 4. *** แก้ไขจุดสำคัญ: รีเซ็ตเวลาเริ่มต้นใหม่ เพื่อให้ Lap ถัดไปนับจาก 0 ***
    // เราต้องนำ total time ที่เพิ่งบันทึกไป มากำหนดเป็นจุดเริ่มต้นใหม่
    elapsedTime = currentLapTotalTime * 1000; // แปลงกลับเป็น ms
    startTime = Date.now() - elapsedTime; // กำหนดจุดเริ่มต้นใหม่ โดยหัก Lap Time ออก
    elapsedTime = 0; // ตั้งค่า elapsedTime เป็น 0 เพื่อให้ Lap ใหม่นับจากศูนย์
}

/**
 * สร้างและแสดงแถว Lap Time
 * @param {number} index - หมายเลข Lap
 * @param {number} lapDuration - ระยะเวลาของ Lap นั้นๆ (เวลาที่ใช้ใน Lap นี้จริงๆ)
 * @param {number} totalTime - เวลารวมตั้งแต่เริ่มต้น (เวลาที่บันทึกใน Input)
 */
function addLapTimeToDisplay(index, lapDuration, totalTime) {
    const formatTime = (seconds) => {
        const totalMs = Math.round(seconds * 100);
        const minutes = Math.floor(totalMs / 6000);
        const secs = Math.floor((totalMs % 6000) / 100);
        const ms = totalMs % 100;
        return (minutes < 10 ? "0" + minutes : minutes) + ":" + 
               (secs < 10 ? "0" + secs : secs) + "." + 
               (ms < 10 ? "0" + ms : ms);
    };

    const newRow = document.createElement('div');
    newRow.className = 'lap-row';
    newRow.innerHTML = `
        <div class="lap-index">${index}</div>
        <div class="lap-duration">${formatTime(lapDuration)}</div>
        <div class="total-time">${formatTime(totalTime)}</div>
    `;

    const header = lapTimesDiv.querySelector('.lap-header');
    if (header) {
        lapTimesDiv.insertBefore(newRow, header.nextSibling);
    } else {
        lapTimesDiv.appendChild(newRow);
    }
}

// สร้าง header ของตาราง Lap Time เมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    // ต้องเรียกใช้ฟังก์ชันนี้เพื่อให้แน่ใจว่า progress circle ถูกดึงค่ามาใช้ก่อน
    // และใส่ header ของตาราง Lap Time
    lapTimesDiv.innerHTML = '<div class="lap-header"><div>#</div><div>เวลา Lap</div><div>รวม</div></div>';
});


// =======================================================
// ฟังก์ชันคำนวณผลผลิต
// =======================================================
function calculateProductivity() {
    const time1 = parseFloat(document.getElementById('time1').value);
    const time2 = parseFloat(document.getElementById('time2').value);
    const time3 = parseFloat(document.getElementById('time3').value);

    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (isNaN(time1) || isNaN(time2) || isNaN(time3) || time1 <= 0 || time2 <= 0 || time3 <= 0) {
        // ไม่ต้อง alert เมื่อคำนวณอัตโนมัติหลัง Lap 3 (เพื่อให้ flow ราบรื่น)
        // แต่ถ้าเป็นการกดปุ่มคำนวณด้วยมือ ยังคง alert
        if (lapCounter < 3) {
            alert("กรุณาบันทึกเวลาที่ถูกต้องครบทั้ง 3 ครั้ง ก่อนคำนวณ");
        }
        document.getElementById('avg-time').textContent = "เวลาเฉลี่ย: - วินาทีต่อชิ้น";
        document.getElementById('productivity').textContent = "ผลผลิตต่อชั่วโมง: - ชิ้น";
        return;
    }

    const averageTime = (time1 + time2 + time3) / 3;
    const SECONDS_PER_HOUR = 3600;
    const productivityPerHour = SECONDS_PER_HOUR / averageTime;

    document.getElementById('avg-time').textContent = `เวลาเฉลี่ย: ${averageTime.toFixed(2)} วินาทีต่อชิ้น`;
    document.getElementById('productivity').textContent = `ผลผลิตต่อชั่วโมง: ${productivityPerHour.toFixed(2)} ชิ้น`;
}
