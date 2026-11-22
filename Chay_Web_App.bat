@echo off
chcp 65001 >nul
title Cổng Đào Tạo & Sổ Liên Lạc Điện Tử HueIC - Phân Tách 4 Cổng Độc Lập
color 0b

:MENU
cls
echo ==============================================================================
echo       TRƯỜNG CAO ĐẲNG CÔNG NGHIỆP HUẾ (HueIC) - KHOA CÔNG NGHỆ THÔNG TIN
echo       HỆ THỐNG ĐÀO TẠO & SỔ LIÊN LẠC ĐIỆN TỬ - PHÂN TÁCH 4 CỔNG BẢO MẬT
echo ==============================================================================
echo.
echo   [1] Mở Trang Đăng Nhập & Chọn Cổng Tập Trung (index.html)
echo   [2] Mở Cổng Học Sinh Cá Nhân (hoc_sinh.html)
echo   [3] Mở Cổng Phụ Huynh & Sổ Liên Lạc Điện Tử (phu_huynh.html)
echo   [4] Mở Cổng Giảng Viên & Cố Vấn Học Tập (giao_vien.html)
echo   [5] Mở Cổng Hiệu Trưởng & Quản Trị Nhà Trường (quan_tri.html)
echo   [6] Mở Bản Thuyết Minh Đề Cương NCKH Chuẩn A4 In Ấn (PDF)
echo   [0] Thoát
echo.
echo   (*) Mẹo: Trên mỗi trang web đều có nút nổi "🎨 Tùy Chỉnh Giao Diện & Thông Số"
echo            ở góc dưới trái để bạn đổi màu sắc, sửa điểm, đổi tên, sửa chữ trực tiếp!
echo ==============================================================================
set /p opt="Vui lòng chọn cổng bạn muốn mở [1-6]: "

if "%opt%"=="1" (
    start "" "index.html"
    goto MENU
)
if "%opt%"=="2" (
    start "" "hoc_sinh.html"
    goto MENU
)
if "%opt%"=="3" (
    start "" "phu_huynh.html"
    goto MENU
)
if "%opt%"=="4" (
    start "" "giao_vien.html"
    goto MENU
)
if "%opt%"=="5" (
    start "" "quan_tri.html"
    goto MENU
)
if "%opt%"=="6" (
    start "" "BAN_THUYET_MINH_DE_CUONG_NCKH_SV_2025_HOAN_CHINH.html"
    goto MENU
)
if "%opt%"=="0" exit

echo Lựa chọn không hợp lệ!
timeout /t 2 >nul
goto MENU
