// ... โค้ดส่วนบนเหมือนเดิม ...

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
        
        startBtn.innerHTML = "❚❚"; // เปลี่ยนเป็นปุ่มหยุด (Pause)
        startBtn.classList.add('running'); // เพิ่มคลาสเพื่อเปลี่ยนสี
        lapBtn.disabled = false;
        resetBtn.disabled = false; 
        running = true;
    } else {
        // หยุดการทำงานชั่วคราว
        clearInterval(tInterval);
        startBtn.innerHTML = "▶"; // เปลี่ยนเป็นปุ่มเริ่ม (Play)
        startBtn.classList.remove('running'); // ลบคลาสสีแดงออก
        running = false;
    }
}

// ... โค้ด getShowTime เหมือนเดิม ...

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
    startBtn.classList.remove('running'); // ตรวจสอบให้แน่ใจว่าลบคลาสออกเมื่อรีเซ็ต
    startBtn.style.backgroundColor = 'var(--primary-color)'; /* ตั้งค่าสีกลับไปเป็นสีเขียวเริ่มต้น */
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    
    // ล้างค่าในช่อง Input และ Lap Times
    document.getElementById('time1').value = '';
    document.getElementById('time2').value = '';
    document.getElementById('time3').value = '';
    lapTimesDiv.innerHTML = '<div class="lap-header"><div>#</div><div>เวลา Lap</div><div>รวม</div></div>'; // เพิ่ม header กลับเข้าไป
    
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
    
    const currentLapTotalTime = elapsedTime / 1000; // เวลารวมตั้งแต่เริ่ม
    let lapDuration = currentLapTotalTime; // เริ่มต้นให้ Lap duration เป็น total time

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
    
    // 4. รีเซ็ตนาฬิกาเพื่อเริ่มจับเวลาชิ้นงานถัดไปทันที (โดยไม่หยุดการทำงานของ TInterval)
    // แค่รีเซ็ตเวลาเริ่มต้นใหม่ (elapsedTime ยังคงนับต่อจาก startTime ใหม่)
    startTime = Date.now(); 
    elapsedTime = 0; // รีเซ็ต elapsedTime เพื่อให้ getShowTime นับจาก 0 ใหม่สำหรับ Lap ถัดไป
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

    // เพิ่ม Lap ใหม่ไว้ด้านบนสุดของรายการ (ใต้ header)
    const header = lapTimesDiv.querySelector('.lap-header');
    if (header) {
        lapTimesDiv.insertBefore(newRow, header.nextSibling);
    } else {
        lapTimesDiv.appendChild(newRow); // ถ้าไม่มี header ก็เพิ่มเข้าไปเลย
    }
}

// สร้าง header ของตาราง Lap Time เมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    lapTimesDiv.innerHTML = '<div class="lap-header"><div>#</div><div>เวลา Lap</div><div>รวม</div></div>';
});

// ... โค้ด calculateProductivity เหมือนเดิม ...
