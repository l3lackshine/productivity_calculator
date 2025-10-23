// ตัวแปรสำหรับนาฬิกาจับเวลา
let startTime;
let updatedTime;
let tInterval;
let running = false;
let lapCounter = 1; // นับรอบที่ 1, 2, 3

const display = document.getElementById('display');
const startBtn = document.getElementById('start-btn');
const lapBtn = document.getElementById('lap-btn');

/**
 * ฟังก์ชันเริ่มต้น/หยุดนาฬิกาจับเวลา
 */
function startStopwatch() {
    if (!running) {
        // เริ่มต้นการทำงาน
        startTime = new Date().getTime();
        tInterval = setInterval(getShowTime, 10); // อัปเดตทุก 10 มิลลิวินาที
        
        startBtn.innerHTML = "หยุด";
        startBtn.style.backgroundColor = '#d9534f'; // สีแดง
        lapBtn.disabled = false;
        running = true;
    } else {
        // หยุดการทำงานชั่วคราว
        clearInterval(tInterval);
        startBtn.innerHTML = "ทำงานต่อ";
        startBtn.style.backgroundColor = '#0275d8'; // สีฟ้า
        running = false;
    }
}

/**
 * ฟังก์ชันแสดงผลเวลาที่ผ่านไป
 */
function getShowTime() {
    updatedTime = new Date().getTime();
    let difference = updatedTime - startTime;

    // คำนวณเวลา (เฉพาะวินาทีและมิลลิวินาที)
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((difference % 1000) / 10);

    display.innerHTML = 
        (seconds < 10 ? "0" + seconds : seconds) + "." + 
        (milliseconds < 10 ? "0" + milliseconds : milliseconds);
}

/**
 * ฟังก์ชันบันทึกเวลาและรีเซ็ตนาฬิกา
 */
function lapTime() {
    if (!running) {
        alert("กรุณา 'เริ่ม' หรือ 'ทำงานต่อ' นาฬิกาจับเวลาก่อน");
        return;
    }
    
    // เวลาที่จับได้ (เป็นวินาทีที่มีทศนิยม)
    const lapTimeSeconds = (updatedTime - startTime) / 1000;

    if (lapCounter === 1) {
        // บันทึกเวลาที่ 1 โดยไม่มี alert
        document.getElementById('time1').value = lapTimeSeconds.toFixed(2);
        lapCounter++;
        
        // รีเซ็ตนาฬิกาเพื่อเริ่มจับเวลาชิ้นงานถัดไป
        clearInterval(tInterval);
        startTime = new Date().getTime(); // ตั้งค่าเวลาเริ่มต้นใหม่ทันที
        tInterval = setInterval(getShowTime, 10);
        
    } else if (lapCounter === 2) {
        // บันทึกเวลาที่ 2 โดยไม่มี alert
        document.getElementById('time2').value = lapTimeSeconds.toFixed(2);
        lapCounter++;
        
        // รีเซ็ตนาฬิกาเพื่อเริ่มจับเวลาชิ้นงานถัดไป
        clearInterval(tInterval);
        startTime = new Date().getTime(); // ตั้งค่าเวลาเริ่มต้นใหม่ทันที
        tInterval = setInterval(getShowTime, 10);
        
    } else if (lapCounter === 3) {
        // บันทึกเวลาที่ 3
        document.getElementById('time3').value = lapTimeSeconds.toFixed(2);
        
        // หยุดนาฬิกาและรีเซ็ตทั้งหมดเมื่อครบ 3 ครั้ง
        clearInterval(tInterval);
        running = false;
        startBtn.innerHTML = "เริ่มใหม่";
        startBtn.style.backgroundColor = '#5cb85c'; // สีเขียว
        lapBtn.disabled = true;
        display.innerHTML = "0.00";
        lapCounter = 1; // รีเซ็ตตัวนับ
        
        // คำนวณผลผลิตอัตโนมัติ
        calculate
function getShowTime() {
    updatedTime = new Date().getTime();
    let difference = updatedTime - startTime;

    // คำนวณเวลา (เฉพาะวินาทีและมิลลิวินาที)
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((difference % 1000) / 10);

    display.innerHTML = 
        (seconds < 10 ? "0" + seconds : seconds) + "." + 
        (milliseconds < 10 ? "0" + milliseconds : milliseconds);
}

/**
 * ฟังก์ชันบันทึกเวลาและรีเซ็ตนาฬิกา
 */
function lapTime() {
    if (!running) {
        alert("กรุณา 'เริ่ม' หรือ 'ทำงานต่อ' นาฬิกาจับเวลาก่อน");
        return;
    }
    
    // เวลาที่จับได้ (เป็นวินาทีที่มีทศนิยม)
    const lapTimeSeconds = (updatedTime - startTime) / 1000;

    if (lapCounter === 1) {
        document.getElementById('time1').value = lapTimeSeconds.toFixed(2);
        lapCounter++;
        alert(`บันทึกเวลาที่ 1: ${lapTimeSeconds.toFixed(2)} วินาที`);
    } else if (lapCounter === 2) {
        document.getElementById('time2').value = lapTimeSeconds.toFixed(2);
        lapCounter++;
        alert(`บันทึกเวลาที่ 2: ${lapTimeSeconds.toFixed(2)} วินาที`);
    } else if (lapCounter === 3) {
        document.getElementById('time3').value = lapTimeSeconds.toFixed(2);
        
        // หยุดนาฬิกาและรีเซ็ตทั้งหมดเมื่อครบ 3 ครั้ง
        clearInterval(tInterval);
        running = false;
        startBtn.innerHTML = "เริ่มใหม่";
        startBtn.style.backgroundColor = '#5cb85c'; // สีเขียว
        lapBtn.disabled = true;
        display.innerHTML = "0.00";
        lapCounter = 1; // รีเซ็ตตัวนับ
        
        // แจ้งเตือนและคำนวณผลผลิตอัตโนมัติ
        alert(`บันทึกเวลาที่ 3: ${lapTimeSeconds.toFixed(2)} วินาที ครบ 3 ครั้งแล้ว!`);
        calculateProductivity();
        
        return;
    }
    
    // รีเซ็ตนาฬิกาเพื่อเริ่มจับเวลาชิ้นงานถัดไป
    clearInterval(tInterval);
    startTime = new Date().getTime(); // ตั้งค่าเวลาเริ่มต้นใหม่ทันที
    tInterval = setInterval(getShowTime, 10);
}


// ** ฟังก์ชันคำนวณผลผลิต (จากโค้ดเดิม) **
function calculateProductivity() {
    const time1 = parseFloat(document.getElementById('time1').value);
    const time2 = parseFloat(document.getElementById('time2').value);
    const time3 = parseFloat(document.getElementById('time3').value);

    if (isNaN(time1) || isNaN(time2) || isNaN(time3) || time1 <= 0 || time2 <= 0 || time3 <= 0) {
        alert("กรุณาป้อนเวลาที่เป็นตัวเลขบวกที่ถูกต้องครบทั้ง 3 ช่อง ก่อนคำนวณ");
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
