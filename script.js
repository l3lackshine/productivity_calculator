// =======================================================
// ตัวแปรสำหรับนาฬิกาจับเวลา (Global)
// =======================================================
let startTime = 0;
let elapsedTime = 0; 
let tInterval;
let running = false;
let lapCounter = 1; 

const MAX_TIME_SECONDS = 60; 
const DASH_ARRAY = 283; 

// ตัวแปรสำหรับ Element ใน HTML (กำหนดให้เป็น Global)
let display;
let startBtn;
let lapBtn;
let resetBtn;
let progressCircle;
let lapTimesDiv;
let calculateBtn;


// =======================================================
// จุดเริ่มต้น: ตรวจสอบให้แน่ใจว่า HTML โหลดเสร็จแล้ว
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. กำหนดค่าตัวแปร Element
    display = document.getElementById('display');
    startBtn = document.getElementById('start-btn');
    lapBtn = document.getElementById('lap-btn');
    resetBtn = document.getElementById('reset-btn');
    progressCircle = document.getElementById('progress-circle');
    lapTimesDiv = document.getElementById('lap-times');
    calculateBtn = document.getElementById('calculate-btn');

    // ตรวจสอบความพร้อมของ Element ที่สำคัญที่สุด
    if (!startBtn) {
        console.error("Critical: Start button not found. Initialization failed.");
        return; 
    }

    // 2. ผูก Event Listeners เข้ากับปุ่ม (วิธีที่น่าเชื่อถือที่สุด)
    startBtn.addEventListener('click', startStopwatch);
    lapBtn.addEventListener('click', lapTime);
    resetBtn.addEventListener('click', resetStopwatch);
    calculateBtn.addEventListener('click', calculateProductivity);

    // 3. เตรียมโครงสร้าง Lap Time
    lapTimesDiv.innerHTML = '<div class="lap-header"><div>#</div><div>เวลา Lap</div><div>รวม</div></div>';
});


// =======================================================
// ฟังก์ชันนาฬิกาจับเวลา
// =======================================================

/**
 * ฟังก์ชันเริ่มต้น/หยุดนาฬิกาจับเวลา
 */
function startStopwatch() {
    if (!running) {
        // เริ่มการทำงาน
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

    // คำนวณเวลาและแสดงผล (ส่วนนี้ควรทำงานได้แล้ว)
    let totalSeconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);
    
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
    
    // ล้างค่าและตาราง
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

    if (lapCounter > 1) {
        const prevInputId = 'time' + (lapCounter - 1);
        const prevLapTotalTime = parseFloat(document.getElementById(prevInputId).value || 0);
        lapDuration = currentLapTotalTime - prevLapTotalTime;
    }

    const inputId = 'time' + lapCounter;
    if (document.getElementById(inputId)) {
        document.getElementById(inputId).value = currentLapTotalTime.toFixed(2);
    }
    
    addLapTimeToDisplay(lapCounter, lapDuration, currentLapTotalTime);

    
    if (lapCounter >= 3) {
        startStopwatch(); 
        lapBtn.disabled = true;
        calculateProductivity();
        return;
    }
    
    lapCounter++;
    
    // รีเซ็ตเวลาเริ่มต้นใหม่ เพื่อให้ Lap ถัดไปนับจาก 0
    startTime = Date.now(); 
    elapsedTime = 0;
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

    if (isNaN(time1) || isNaN(time2) || isNaN(time3) || time1 <= 0 || time2 <= 0 || time3 <= 0) {
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
