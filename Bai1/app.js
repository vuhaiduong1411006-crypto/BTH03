// ==================== DỮ LIỆU ====================

var danhSachSV = [];
var indexDangSua = -1; // -1 = đang thêm mới, >= 0 = đang sửa

// Đọc dữ liệu từ localStorage khi tải trang
function khoiTao() {
  var data = localStorage.getItem("danhSachSV");
  if (data) {
    danhSachSV = JSON.parse(data);
  }
  renderBang();
  capNhatThongKe();
}

// ==================== RENDER ====================

function renderBang() {
  var tbody = document.getElementById("bang-sv");
  tbody.innerHTML = "";

  if (danhSachSV.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#999">Chưa có dữ liệu</td></tr>';
    return;
  }

  for (var i = 0; i < danhSachSV.length; i++) {
    var sv = danhSachSV[i];
    var row =
      "<tr>" +
      "<td>" +
      sv.masv +
      "</td>" +
      "<td>" +
      sv.hoten +
      "</td>" +
      "<td>" +
      sv.ngaysinh +
      "</td>" +
      "<td>" +
      sv.lop +
      "</td>" +
      "<td>" +
      sv.diem +
      "</td>" +
      "<td>" +
      sv.email +
      "</td>" +
      "<td>" +
      '<button class="btn-sua" onclick="moForm(' +
      i +
      ')">Sửa</button>' +
      '<button class="btn-xoa" onclick="xoaSinhVien(' +
      i +
      ')">Xóa</button>' +
      "</td>" +
      "</tr>";
    tbody.innerHTML += row;
  }
}

function capNhatThongKe() {
  document.getElementById("tong-so").textContent = danhSachSV.length;

  if (danhSachSV.length === 0) {
    document.getElementById("diem-tb").textContent = "0.00";
    return;
  }

  var tong = 0;
  for (var i = 0; i < danhSachSV.length; i++) {
    tong += parseFloat(danhSachSV[i].diem);
  }
  var tb = tong / danhSachSV.length;
  document.getElementById("diem-tb").textContent = tb.toFixed(2);
}

// ==================== FORM ====================

function moForm(index) {
  xoaLoi();
  document.getElementById("overlay").style.display = "flex";

  if (index === null) {
    // Thêm mới
    indexDangSua = -1;
    document.getElementById("tieu-de-form").textContent = "Thêm sinh viên";
    document.getElementById("btn-luu").textContent = "Thêm";
    resetForm();
  } else {
    // Sửa
    indexDangSua = index;
    document.getElementById("tieu-de-form").textContent = "Sửa sinh viên";
    document.getElementById("btn-luu").textContent = "Cập nhật";
    var sv = danhSachSV[index];
    document.getElementById("masv").value = sv.masv;
    document.getElementById("hoten").value = sv.hoten;
    document.getElementById("ngaysinh").value = sv.ngaysinh;
    document.getElementById("lop").value = sv.lop;
    document.getElementById("diem").value = sv.diem;
    document.getElementById("email").value = sv.email;
  }
}

function dongForm() {
  document.getElementById("overlay").style.display = "none";
  resetForm();
  xoaLoi();
}

function resetForm() {
  document.getElementById("masv").value = "";
  document.getElementById("hoten").value = "";
  document.getElementById("ngaysinh").value = "";
  document.getElementById("lop").value = "";
  document.getElementById("diem").value = "";
  document.getElementById("email").value = "";
}

// ==================== VALIDATION ====================

function xoaLoi() {
  var fields = ["masv", "hoten", "ngaysinh", "lop", "diem", "email"];
  for (var i = 0; i < fields.length; i++) {
    document.getElementById("loi-" + fields[i]).textContent = "";
    document.getElementById(fields[i]).classList.remove("invalid");
  }
}

function hienLoi(id, msg) {
  document.getElementById("loi-" + id).textContent = msg;
  document.getElementById(id).classList.add("invalid");
}

function validate(masv, hoten, ngaysinh, lop, diem, email) {
  var hopLe = true;
  xoaLoi();

  if (masv.trim() === "") {
    hienLoi("masv", "Mã SV không được để trống");
    hopLe = false;
  }

  if (hoten.trim() === "") {
    hienLoi("hoten", "Họ tên không được để trống");
    hopLe = false;
  }

  if (ngaysinh === "") {
    hienLoi("ngaysinh", "Ngày sinh không được để trống");
    hopLe = false;
  }

  if (lop.trim() === "") {
    hienLoi("lop", "Lớp không được để trống");
    hopLe = false;
  }

  if (diem === "") {
    hienLoi("diem", "Điểm không được để trống");
    hopLe = false;
  } else if (isNaN(diem) || parseFloat(diem) < 0 || parseFloat(diem) > 10) {
    hienLoi("diem", "Điểm phải là số từ 0 đến 10");
    hopLe = false;
  }

  if (email.trim() === "") {
    hienLoi("email", "Email không được để trống");
    hopLe = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    hienLoi("email", "Email không đúng định dạng");
    hopLe = false;
  }

  return hopLe;
}

// ==================== CRUD ====================

function luuSinhVien() {
  var masv = document.getElementById("masv").value;
  var hoten = document.getElementById("hoten").value;
  var ngaysinh = document.getElementById("ngaysinh").value;
  var lop = document.getElementById("lop").value;
  var diem = document.getElementById("diem").value;
  var email = document.getElementById("email").value;

  if (!validate(masv, hoten, ngaysinh, lop, diem, email)) return;

  var sv = {
    masv: masv.trim(),
    hoten: hoten.trim(),
    ngaysinh: ngaysinh,
    lop: lop.trim(),
    diem: parseFloat(diem).toFixed(1),
    email: email.trim(),
  };

  if (indexDangSua === -1) {
    danhSachSV.push(sv);
    hienThongBao("Thêm sinh viên thành công!", "success");
  } else {
    danhSachSV[indexDangSua] = sv;
    hienThongBao("Cập nhật sinh viên thành công!", "success");
  }

  luuLocalStorage();
  renderBang();
  capNhatThongKe();
  dongForm();
}

function xoaSinhVien(index) {
  var sv = danhSachSV[index];
  var xacNhan = confirm('Bạn có chắc muốn xóa sinh viên "' + sv.hoten + '"?');
  if (!xacNhan) return;

  danhSachSV.splice(index, 1);
  luuLocalStorage();
  renderBang();
  capNhatThongKe();
  hienThongBao("Đã xóa sinh viên thành công!", "success");
}

// ==================== TIỆN ÍCH ====================

function luuLocalStorage() {
  localStorage.setItem("danhSachSV", JSON.stringify(danhSachSV));
}

function hienThongBao(msg, loai) {
  var el = document.getElementById("thong-bao");
  el.textContent = msg;
  el.className = loai;
  setTimeout(function () {
    el.className = "";
    el.textContent = "";
  }, 3000);
}

// ==================== KHỞI CHẠY ====================
khoiTao();
