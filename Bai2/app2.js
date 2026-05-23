// ==================== DỮ LIỆU ====================

var danhSachCV = [];
var indexDangSua = -1;

function khoiTao() {
  var data = localStorage.getItem("danhSachCV");
  if (data) {
    danhSachCV = JSON.parse(data);
  }
  renderBang();
  capNhatThongKe();
}

// ==================== RENDER ====================

function renderBang() {
  var tbody = document.getElementById("bang-cv");
  tbody.innerHTML = "";

  if (danhSachCV.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#999">Chưa có công việc nào</td></tr>';
    return;
  }

  for (var i = 0; i < danhSachCV.length; i++) {
    var cv = danhSachCV[i];
    var laDaXong = cv.trangthai === "Đã xong";

    // Class màu ưu tiên
    var utClass = "";
    if (cv.uutien === "Cao") utClass = "ut-cao";
    else if (cv.uutien === "Trung bình") utClass = "ut-tb";
    else utClass = "ut-thap";

    var badgeClass = laDaXong ? "badge da-xong" : "badge chua-xong";
    var rowClass = laDaXong ? "da-xong" : "";
    var btnLabel = laDaXong ? "↩ Chưa xong" : "✔ Xong";

    var row =
      '<tr class="' +
      rowClass +
      '">' +
      "<td>" +
      cv.tieude +
      "</td>" +
      "<td>" +
      (cv.mota || "—") +
      "</td>" +
      "<td>" +
      cv.han +
      "</td>" +
      '<td class="' +
      utClass +
      '">' +
      cv.uutien +
      "</td>" +
      '<td><span class="' +
      badgeClass +
      '">' +
      cv.trangthai +
      "</span></td>" +
      "<td>" +
      '<button class="btn-toggle" onclick="doiTrangThai(' +
      i +
      ')">' +
      btnLabel +
      "</button>" +
      '<button class="btn-sua"    onclick="moForm(' +
      i +
      ')">Sửa</button>' +
      '<button class="btn-xoa"    onclick="xoaCongViec(' +
      i +
      ')">Xóa</button>' +
      "</td>" +
      "</tr>";
    tbody.innerHTML += row;
  }
}

function capNhatThongKe() {
  var tong = danhSachCV.length;
  var daXong = 0;
  for (var i = 0; i < danhSachCV.length; i++) {
    if (danhSachCV[i].trangthai === "Đã xong") daXong++;
  }
  document.getElementById("tong-so").textContent = tong;
  document.getElementById("da-xong").textContent = daXong;
  document.getElementById("chua-xong").textContent = tong - daXong;
}

// ==================== FORM ====================

function moForm(index) {
  xoaLoi();
  document.getElementById("overlay").style.display = "flex";

  if (index === null) {
    indexDangSua = -1;
    document.getElementById("tieu-de-form").textContent = "Thêm công việc";
    document.getElementById("btn-luu").textContent = "Thêm";
    resetForm();
  } else {
    indexDangSua = index;
    document.getElementById("tieu-de-form").textContent = "Sửa công việc";
    document.getElementById("btn-luu").textContent = "Cập nhật";
    var cv = danhSachCV[index];
    document.getElementById("tieude").value = cv.tieude;
    document.getElementById("mota").value = cv.mota;
    document.getElementById("han").value = cv.han;
    document.getElementById("uutien").value = cv.uutien;
    document.getElementById("trangthai").value = cv.trangthai;
  }
}

function dongForm() {
  document.getElementById("overlay").style.display = "none";
  resetForm();
  xoaLoi();
}

function resetForm() {
  document.getElementById("tieude").value = "";
  document.getElementById("mota").value = "";
  document.getElementById("han").value = "";
  document.getElementById("uutien").value = "";
  document.getElementById("trangthai").value = "Chưa xong";
}

// ==================== VALIDATION ====================

function xoaLoi() {
  var fields = ["tieude", "han", "uutien"];
  for (var i = 0; i < fields.length; i++) {
    document.getElementById("loi-" + fields[i]).textContent = "";
    document.getElementById(fields[i]).classList.remove("invalid");
  }
}

function hienLoi(id, msg) {
  document.getElementById("loi-" + id).textContent = msg;
  document.getElementById(id).classList.add("invalid");
}

function validate(tieude, han, uutien) {
  var hopLe = true;
  xoaLoi();

  if (tieude.trim() === "") {
    hienLoi("tieude", "Tiêu đề không được để trống");
    hopLe = false;
  }

  if (han === "") {
    hienLoi("han", "Hạn hoàn thành không được để trống");
    hopLe = false;
  }

  if (uutien === "") {
    hienLoi("uutien", "Vui lòng chọn mức ưu tiên");
    hopLe = false;
  }

  return hopLe;
}

// ==================== CRUD ====================

function luuCongViec() {
  var tieude = document.getElementById("tieude").value;
  var mota = document.getElementById("mota").value;
  var han = document.getElementById("han").value;
  var uutien = document.getElementById("uutien").value;
  var trangthai = document.getElementById("trangthai").value;

  if (!validate(tieude, han, uutien)) return;

  var cv = {
    tieude: tieude.trim(),
    mota: mota.trim(),
    han: han,
    uutien: uutien,
    trangthai: trangthai,
  };

  if (indexDangSua === -1) {
    danhSachCV.push(cv);
    hienThongBao("Thêm công việc thành công!");
  } else {
    danhSachCV[indexDangSua] = cv;
    hienThongBao("Cập nhật công việc thành công!");
  }

  luuLocalStorage();
  renderBang();
  capNhatThongKe();
  dongForm();
}

function xoaCongViec(index) {
  var cv = danhSachCV[index];
  var xacNhan = confirm('Bạn có chắc muốn xóa công việc "' + cv.tieude + '"?');
  if (!xacNhan) return;

  danhSachCV.splice(index, 1);
  luuLocalStorage();
  renderBang();
  capNhatThongKe();
  hienThongBao("Đã xóa công việc thành công!");
}

function doiTrangThai(index) {
  if (danhSachCV[index].trangthai === "Chưa xong") {
    danhSachCV[index].trangthai = "Đã xong";
  } else {
    danhSachCV[index].trangthai = "Chưa xong";
  }
  luuLocalStorage();
  renderBang();
  capNhatThongKe();
}

// ==================== TIỆN ÍCH ====================

function luuLocalStorage() {
  localStorage.setItem("danhSachCV", JSON.stringify(danhSachCV));
}

function hienThongBao(msg) {
  var el = document.getElementById("thong-bao");
  el.textContent = msg;
  el.className = "success";
  setTimeout(function () {
    el.className = "";
    el.textContent = "";
  }, 3000);
}

// ==================== KHỞI CHẠY ====================
khoiTao();
