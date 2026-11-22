window.INITIAL_DB = {
  users: [
    {
      id: 1,
      code: 'ADMIN',
      role: 'ADMIN',
      full_name: 'TS. Phạm Văn Quân',
      title: 'Hiệu trưởng HueIC',
      phone: '0901000001',
      email: 'quan.pv@hueic.edu.vn'
    },
    {
      id: 2,
      code: 'GV01',
      role: 'TEACHER',
      full_name: 'Thầy Nguyễn Văn An',
      department: 'Khoa Công nghệ Thông tin',
      title: 'Giảng viên chính',
      class_id: 1,
      class_name: 'CĐ CNTT K48A',
      subject: 'Lập trình Web & Mobile',
      phone: '0902000001',
      email: 'an.nv@hueic.edu.vn',
      status: 'Đang giảng dạy'
    },
    {
      id: 3,
      code: 'PH01',
      role: 'PARENT',
      full_name: 'Nguyễn Văn Bình',
      phone: '0903000001',
      student_id: 1
    },
    {
      id: 4,
      code: 'GV02',
      role: 'TEACHER',
      full_name: 'Thầy Hoàng Chí Dũng',
      department: 'Khoa Công nghệ Thông tin',
      title: 'Trưởng bộ môn Phần mềm',
      class_id: 2,
      class_name: 'CĐ CNTT K48B',
      phone: '0902000002',
      email: 'dung.hc@hueic.edu.vn',
      status: 'Đang giảng dạy'
    },
    {
      id: 5,
      code: 'GV03',
      role: 'TEACHER',
      full_name: 'Cô Trần Thị Bình',
      department: 'Khoa Điện – Điện tử',
      title: 'Phó Trưởng khoa',
      class_id: 3,
      class_name: 'CĐ Điện CN K48A',
      phone: '0902000003',
      email: 'binh.tt@hueic.edu.vn',
      status: 'Đang giảng dạy'
    },
    {
      id: 6,
      code: 'GV04',
      role: 'TEACHER',
      full_name: 'Thầy Lê Văn Hùng',
      department: 'Khoa Cơ khí Chế tạo',
      title: 'GVCN',
      class_id: 4,
      class_name: 'CĐ Cơ khí Ô tô K48A',
      phone: '0902000004',
      email: 'hung.lv@hueic.edu.vn',
      status: 'Đang giảng dạy'
    },
    {
      id: 7,
      code: 'GV05',
      role: 'TEACHER',
      full_name: 'Cô Phan Thị Mai',
      department: 'Khoa Mỹ thuật & Thiết kế',
      title: 'GVCN',
      class_id: 5,
      class_name: 'CĐ Thiết kế Đồ họa K48A',
      phone: '0902000005',
      email: 'mai.pt@hueic.edu.vn',
      status: 'Đang giảng dạy'
    }
  ],
  students: [
    { id: 1, student_code: 'HUEIC2601', full_name: 'Nguyễn Hoàng Long', class_id: 1, class_name: 'CĐ CNTT K48A', gender: 'Nam', major: 'Công nghệ Thông tin', phone: '0904000001', parent_name: 'Nguyễn Văn Bình', parent_phone: '0903000001' },
    { id: 2, student_code: 'HUEIC2602', full_name: 'Trần Nam Khánh', class_id: 1, class_name: 'CĐ CNTT K48A', gender: 'Nam', major: 'Công nghệ Thông tin', phone: '0904000002', parent_name: 'Trần Văn Hải', parent_phone: '0914221304' },
    { id: 3, student_code: 'HUEIC2603', full_name: 'Đoàn Anh Khoa', class_id: 1, class_name: 'CĐ CNTT K48A', gender: 'Nam', major: 'Công nghệ Thông tin', phone: '0904000003', parent_name: 'Đoàn Thị Mai', parent_phone: '0935482119' },
    { id: 4, student_code: 'HUEIC2604', full_name: 'Lê Thị Thu Thảo', class_id: 1, class_name: 'CĐ CNTT K48A', gender: 'Nữ', major: 'Công nghệ Thông tin', phone: '0904000004', parent_name: 'Lê Minh Tuấn', parent_phone: '0982610775' },
    { id: 5, student_code: 'HUEIC2605', full_name: 'Phạm Minh Quân', class_id: 1, class_name: 'CĐ CNTT K48A', gender: 'Nam', major: 'Công nghệ Thông tin', phone: '0904000005', parent_name: 'Phạm Thị Lan', parent_phone: '0905774290' }
  ],
  grades: [
    { id: 101, student_id: 1, subject: 'Lập trình Web & Mobile', oral: 8.5, quiz: 8.0, midterm: 8.5, final: 9.0 },
    { id: 102, student_id: 1, subject: 'Cơ sở dữ liệu MySQL', oral: 8.0, quiz: 8.5, midterm: 8.0, final: 8.5 },
    { id: 103, student_id: 1, subject: 'Kỹ thuật Mạng máy tính', oral: 8.0, quiz: 7.5, midterm: 8.0, final: 8.5 },
    { id: 104, student_id: 1, subject: 'Lập trình Python', oral: 9.0, quiz: 8.5, midterm: 9.0, final: 9.5 },
    { id: 105, student_id: 1, subject: 'Tiếng Anh chuyên ngành', oral: 8.0, quiz: 8.0, midterm: 8.5, final: 8.0 },
    { id: 106, student_id: 2, subject: 'Lập trình Web & Mobile', oral: 7.5, quiz: 7.0, midterm: 7.5, final: 8.0 },
    { id: 107, student_id: 3, subject: 'Lập trình Web & Mobile', oral: 6.5, quiz: 6.0, midterm: 6.5, final: 6.0 },
    { id: 108, student_id: 4, subject: 'Lập trình Web & Mobile', oral: 9.0, quiz: 9.0, midterm: 8.5, final: 9.5 },
    { id: 109, student_id: 5, subject: 'Lập trình Web & Mobile', oral: 5.5, quiz: 5.0, midterm: 4.5, final: 5.0 }
  ],
  attendance: [
    { id: 201, student_id: 1, date: '2026-11-20', status: 'PRESENT', subject: 'Lập trình Web & Mobile' },
    { id: 202, student_id: 1, date: '2026-11-19', status: 'PRESENT', subject: 'Cơ sở dữ liệu MySQL' },
    { id: 203, student_id: 1, date: '2026-11-18', status: 'PRESENT', subject: 'Kỹ thuật Mạng máy tính' },
    { id: 204, student_id: 1, date: '2026-11-17', status: 'EXCUSED', subject: 'Lập trình Python', note: 'Có đơn xin phép' },
    { id: 205, student_id: 1, date: '2026-11-16', status: 'LATE', subject: 'Tiếng Anh chuyên ngành' }
  ],
  leaves: [],
  announcements: [
    {
      id: 1,
      title: 'Lịch thi kết thúc học phần Học kỳ I (Năm học 2026 – 2027)',
      tag: 'HỌC VỤ',
      created_at: '2026-11-19',
      author_name: 'Phòng Đào tạo HueIC',
      content: 'Nhà trường thông báo lịch thi kết thúc học phần các lớp Cao đẳng K48. Đề nghị quý phụ huynh nhắc nhở sinh viên ôn tập và có mặt đúng giờ quy định.',
      read_by: []
    },
    {
      id: 2,
      title: 'Hướng dẫn nộp học phí Học kỳ I qua mã VietQR tự động',
      tag: 'TÀI CHÍNH',
      created_at: '2026-11-15',
      author_name: 'Phòng Tài chính – Kế toán',
      content: 'Nhà trường đã triển khai thu học phí qua mã VietQR gắn sẵn mã sinh viên. Phụ huynh có thể quét mã trực tiếp trong mục Học phí để hệ thống đối soát tự động.',
      read_by: [3]
    }
  ],
  tuition: { amount: 2850000, semester: 'Học kỳ I (2026 – 2027)' },
  audits: []
};
