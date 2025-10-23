// =======================================================
// ตัวแปรสำหรับนาฬิกาจับเวลา
// =======================================================
let startTime = 0;
let elapsedTime = 0;
let tInterval;
let running = false;
let lapCounter = 1; 

// กำหนดขีดจำกัดเวลาสูงสุดสำหรับการแสดงผลวงแหวน (เช่น 60 วินาทีต่อรอบ)
const MAX_TIME_SECONDS = 60; 
const DASH_ARRAY = 283; // ค่า stroke-dasharray (จาก CSS)

// เชื่อมโยงตัวแปรกับ Element ใน HTML
const display = document.getElementById('display');
const startBtn = document.getElementById('start-btn');
const lapBtn = document.getElementById('lap-btn');
const resetBtn = document.getElementById('reset-btn');
const progressCircle = document.getElementById('progress-circle');
const lapTimesDiv = document.getElementById('lap-times');

// =======================================================
// ฟังก์ชันนาฬิกาจับเวลา
// =======================================================

/**
 * ฟังก์ชันเริ่มต้น/หยุดนาฬิกาจับเวลา
 */
function startStopwatch() {
    if (!running) {
        // เริ่มต้นการทำงาน (โดยรักษาค่า elapsedTime ไว้)
        startTime = Date.now() - elapsedTime;
        tInterval = setInterval(getShowTime, 10); 
        
        startBtn.innerHTML = "⏸"; // เปลี่ยนเป็นปุ่มหยุด
        startBtn.style.backgroundColor = '#d9534f'; // สีแดง
        lapBtn.disabled = false;
        resetBtn.disabled = false; 
        running = true;
    } else {
        // หยุดการทำงานชั่วคราว
        clearInterval(tInterval);
        startBtn.innerHTML = "▶"; // เปลี่ยนเป็นปุ่มเริ่ม
        startBtn.style.backgroundColor = '#007bff'; 
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
    // เรากำหนดให้ 60 วินาทีคือ 1 รอบเต็ม
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
    startBtn.style.backgroundColor = '#007bff'; 
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    
    // ล้างค่าในช่อง Input และ Lap Times
    document.getElementById('time1').value = '';
    document.getElementById('time2').value = '';
    document.getElementById('time3').value = '';
    lapTimesDiv.innerHTML = '';
    
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
    
    // เวลาที่จับได้ (เป็นวินาทีที่มีทศนิยม)
    const lapTimeSeconds = elapsedTime / 1000;

    // การคำนวณ Lap Time ที่แม่นยำ (เวลา Lap คือเวลาที่ผ่านไปตั้งแต่กด Lap ครั้งก่อน)
    let previousLapTime = 0;
    if (lapCounter > 1) {
        // หาเวลาของ Lap ก่อนหน้าเพื่อคำนวณ Lap Time ปัจจุบัน
        const prevInputId = 'time' + (lapCounter - 1);
        previousLapTime = parseFloat(document.getElementById(prevInputId).value);
    }
    const currentLapTime = lapTimeSeconds - previousLapTime;


    // 1. บันทึกค่าลงใน Input (สำหรับการคำนวณผลผลิต)
    const inputId = 'time' + lapCounter;
    if (document.getElementById(inputId)) {
        document.getElementById(inputId).value = lapTimeSeconds.toFixed(2);
    }
    
    // 2. แสดงผลในตาราง Lap Times
    addLapTimeToDisplay(lapCounter, currentLapTime, lapTimeSeconds);

    
    // 3. จัดการ Lap Counter และการรีเซ็ต
    if (lapCounter >= 3) {
        // ครบ 3 ครั้ง ให้หยุดนาฬิกาและคำนวณอัตโนมัติ
        startStopwatch(); // หยุดนาฬิกา
        lapBtn.disabled = true;
        calculateProductivity();
        return;
    }
    
    lapCounter++;
    
    // 4. รีเซ็ตนาฬิกาเพื่อเริ่มจับเวลาชิ้นงานถัดไปทันที (โดยไม่หยุดการทำงานของ TInterval)
    startTime = Date.now();
    elapsedTime = 0;
}

/**
 * สร้างและแสดงแถว Lap Time
 * @param {number} index - หมายเลข Lap
 * @param {number} lapDuration - ระยะเวลาของ Lap นั้นๆ
 * @param {number} totalTime - เวลารวมตั้งแต่เริ่มต้น
 */
function addLapTimeToDisplay(index, lapDuration, totalTime) {
    // แปลงเวลาให้เป็นรูปแบบ MM:SS.ms
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
        <div class="lap-value lap-duration">${formatTime(lapDuration)}</div>
        <div class="lap-value total-time">${formatTime(totalTime)}</div>
    `;

    // เพิ่ม Lap ใหม่ไว้ด้านบนสุดของรายการ
    if (lapTimesDiv.firstChild) {
        lapTimesDiv.insertBefore(newRow, lapTimesDiv.firstChild);
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
        alert("กรุณาบันทึกเวลาที่ถูกต้องครบทั้ง 3 ครั้ง ก่อนคำนวณ");
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
