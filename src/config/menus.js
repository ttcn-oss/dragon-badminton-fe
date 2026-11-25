const STAFF_MENU = [
  "Lịch sân tổng",
  "Đơn chờ xác nhận",
  "Cần xử lý",
  "Đặt tại quầy",
  "Check-in",
  "Hóa đơn",
  "Bán dịch vụ",
  "Kho",
  "Cho thuê dụng cụ",
];

export const AREAS = {
  customer: {
    title: "Khách hàng",
    menu: [
      "Lịch sân trống",
      "Đặt sân",
      "Thanh toán QR",
      "Đơn của tôi",
      "Đặt cố định",
      "Đánh giá",
      "Hồ sơ",
      "Thông báo",
    ],
  },
  staff: {
    title: "Nhân viên",
    menu: STAFF_MENU,
  },
  admin: {
    title: "Admin",
    menu: [
      ...STAFF_MENU,
      "Quản lý sân",
      "Bảng giá",
      "Ngày lễ",
      "Cài đặt",
      "Nhân viên",
      "Báo cáo",
      "Tài khoản chủ sân",
      "Cấu hình hệ thống",
      "Nhật ký thao tác",
    ],
  },
};