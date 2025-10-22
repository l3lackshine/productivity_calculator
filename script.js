/**
 * ฟังก์ชันสำหรับคำนวณผลผลิตต่อชั่วโมง
 * หลักการ:
 * 1. รับค่าเวลา 3 ตัว
 * 2. ตรวจสอบความถูกต้องของข้อมูล
 * 3. คำนวณเวลาเฉลี่ย (วินาที/ชิ้น)
 * 4. คำนวณผลผลิตต่อชั่วโมง: (3600 วินาที/ชั่วโมง) / (เวลาเฉลี่ย วินาที/ชิ้น)
 * 5. แสดงผลลัพธ์
 */
function calculateProductivity() {
    // 1. รับค่าเวลา 3 ตัว
    const time1 = parseFloat(document.getElementById('time1').value);
    const time2 = parseFloat(document.getElementById('time2').value);
    const time3 = parseFloat(document.getElementById('time3').value);

    // 2. ตรวจสอบความถูกต้องของข้อมูล
    if (isNaN(time1) || isNaN(time2) || isNaN(time3) || time1 <= 0 || time2 <= 0 || time3 <= 0) {
        alert("กรุณาป้อนเวลาที่เป็นตัวเลขบวกที่ถูกต้องครบทั้ง 3 ช่อง");
        document.getElementById('avg-time').textContent = "เวลาเฉลี่ย: - วินาทีต่อชิ้น";
        document.getElementById('productivity').textContent = "ผลผลิตต่อชั่วโมง: - ชิ้น";
        return;
    }

    // 3. คำนวณเวลาเฉลี่ย (วินาที/ชิ้น)
    const averageTime = (time1 + time2 + time3) / 3;

    // 4. คำนวณผลผลิตต่อชั่วโมง
    // 1 ชั่วโมง มี 3600 วินาที
    const SECONDS_PER_HOUR = 3600;
    const productivityPerHour = SECONDS_PER_HOUR / averageTime;

    // 5. แสดงผลลัพธ์
    document.getElementById('avg-time').textContent = `เวลาเฉลี่ย: ${averageTime.toFixed(2)} วินาทีต่อชิ้น`;
    document.getElementById('productivity').textContent = `ผลผลิตต่อชั่วโมง: ${productivityPerHour.toFixed(2)} ชิ้น`;
}
