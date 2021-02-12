
// Tham chiếu đến các đối tượng HTML thông qua id
var nameInp = document.getElementById("name_schedule");
var timeInp = document.getElementById("time_input");
var button = document.getElementById("button");
var table = document.getElementById("todoList");

// ý tưởng tạo nếu tến kiểm soát lỗi nếu không nhập j vào thì sẽ thêm class vào để cho hiển thị lỗi lên
var errorInputNameLabel = document.getElementById('err-input-name');
var errorInputTimeLabel = document.getElementById('err-input-time');

var todoList = [];

// Sự kiện click cho button ADD Schedule 
button.addEventListener('click',function(){
    var nameInput = nameInp.value;
    var timeInput = new Date(timeInp.value);

    var schedule = {};
    
    var checkError = getError(nameInput, timeInp.value);
    if (!checkError) {
        schedule.nameInput = nameInput;
        schedule.timeInputFormat = timeFormat(timeInput);
        schedule.timeInputNotFormat = timeInp.value;

        todoList.push(schedule);
        reload();

        // Sau khi thêm dữ liệu cần clear lại input 
        nameInp.value = '';
        timeInp.value = '';
    }
});


// Hàm có chức năng chuẩn hóa số. Ví du: 1 -> 01, 12 -> 12, 6 -> 06
function convertLast2Letter(item){
    return ('0' + item).slice(-2);
}

// Hàm chuẩn hóa thời gian theo chuẩn format thời gian của việt nam dd/MM/yyyy hh:mm:ss
function timeFormat(time){
    var dateStr = convertLast2Letter(time.getDate());
    var monthStr = convertLast2Letter(time.getMonth() + 1);
    var yearStr = String(time.getFullYear());

    var hourStr = convertLast2Letter(time.getHours());
    var minuteStr = convertLast2Letter(time.getMinutes());
    var secondStr = convertLast2Letter(time.getSeconds());

    var vietnameseFormatTime = `${dateStr}/${monthStr}/${yearStr} ${hourStr}:${minuteStr}:${secondStr}`;

    return vietnameseFormatTime;
}


// Hàm thực hiện chức năng trả ra lỗi khi không nhập đẩy dủ thông tin 
// Nếu nhập đầy đủ -> true 
// Nếu nhập không đẩy đủ -> false
function getError(inputName, inputTime) {
    // TH 1:
    // TH input name bị rỗng -> bị lỗi 
    // TH input time không bị rỗng -> không bị lỗi
    if (inputName == '' && inputTime != '') {
        errorInputNameLabel.classList.add('display-block');
        nameInp.classList.add('margin-bottom-5px');

        errorInputTimeLabel.classList.remove('display-block');
        return true;
    } 

    // TH 2:
    // TH input name không bị rỗng -> không có lỗi
    // Trường hợp input time bị rỗng -> có lỗi
    if (inputName != '' && inputTime == '') {
        errorInputNameLabel.classList.remove('display-block');
        nameInp.classList.remove('margin-bottom-5px');

        errorInputTimeLabel.classList.add('display-block');
        return true;
    }

    // TH 3: 
    // TH input Name bị rỗng -> có lỗi
    // TH input Time cũng bị rỗng -> có lỗi
    if (inputName == '' && inputTime == '') {
        errorInputNameLabel.classList.add('display-block');
        nameInp.classList.add('margin-bottom-5px');

        errorInputTimeLabel.classList.add('display-block');
        return true;
    }

    // TH 4:
    // Trường hợp không có lỗi 
    // Input Name và Input Time có nhập
    errorInputNameLabel.classList.remove('display-block');
    nameInp.classList.remove('margin-botom-5px');

    errorInputTimeLabel.classList.remove('display-block');
    return false;
}


// Hàm chức năng load lại giao diện hiển thị lên web
function reload(){
    var index = 1;
    table.innerHTML = '<thead> <tr> <th>STT</th> <th>Tên lịch trình</th> <th>Thời gian</th> <th>Xóa</th> </tr> </thead>';
    var tbody = document.createElement('tbody');
    for (var item of todoList) {
        var tr = document.createElement('tr');

        // Thực hiện tiến hành tạo từng td một
        // Tạo td cột STT 
        var tdSTT = document.createElement('td');
        tdSTT.innerHTML = `<p> ${index} </p>`;
        tr.appendChild(tdSTT);

        // Tạo td cột tên lịch trình
        var tdTenLichTrinh = document.createElement('td');
        var pTenLichTrinh = document.createElement('p');
        pTenLichTrinh.innerHTML = item.nameInput;
        var inputTenLichTrinh = document.createElement('input');
        inputTenLichTrinh.setAttribute("type", "text");
        inputTenLichTrinh.setAttribute("value", item.nameInput);

        // Thêm sự kiện double click cho thẻ pTenLichTrinh 
        pTenLichTrinh.addEventListener('dblclick', function() {
            this.classList.add('display-none');
            this.parentNode.children[1].classList.add('display-block');
        });
        // thêm sự kiện nhấn phím enter và esc cho thẻ inputTenLichTrinh 
        inputTenLichTrinh.addEventListener('keyup', function(event) {
            // bắt phím esc     
            if (event.keyCode == 27) {
                this.classList.remove('display-block');
                this.parentNode.children[0].classList.remove('display-none');
            }
            // bắt phím enter - Nếu nhấn phím enter thì update lại dữ liệu
            else if (event.keyCode == 13) {
                this.classList.remove('display-block');
                this.parentNode.children[0].classList.remove('display-none');

                // Cập nhập lại giá trị trong danh sách
                var ind = parseInt(this.parentNode.parentNode.children[0].textContent);
                todoList[ind - 1].nameInput = this.value;
                
                reload(); 
            }
        });
        tdTenLichTrinh.appendChild(pTenLichTrinh);
        tdTenLichTrinh.appendChild(inputTenLichTrinh);
        tr.appendChild(tdTenLichTrinh);

        // Tạo td cột thời gian
        var tdThoiGian = document.createElement('td');
        var pThoiGian = document.createElement('p');
        pThoiGian.innerHTML = item.timeInputFormat;
        var inputThoiGian = document.createElement('input');
        inputThoiGian.setAttribute("type", "datetime-local");
        inputThoiGian.setAttribute("value", item.timeInputNotFormat);
        // Thêm sự kiện dbclick cho pThoiGian 
        pThoiGian.addEventListener('dblclick', function(){
            this.classList.add('display-none');
            this.parentNode.children[1].classList.add('display-block');
        });
        // thêm sự kiện nhấn phím enter và esc cho thẻ inputThoiGian 
        inputThoiGian.addEventListener('keyup', function(event){
            // bắt phím enter - Thì update lại dữ liệu 
            if (event.keyCode == 13) {
                this.classList.remove('display-block');
                this.parentNode.children[0].classList.remove('display-none');

                // Cập nhập lại giá trị trong danh sách
                var ind = parseInt(this.parentNode.parentNode.children[0].textContent);
                todoList[ind - 1].timeInputNotFormat = this.value;
                todoList[ind - 1].timeInputFormat = timeFormat(new Date(this.value));

                reload();
            }
            // bắt phím ese
            else if (event.keyCode == 27) {
                this.classList.remove('display-block');
                this.parentNode.children[0].classList.remove('display-none');
            }
        });
        tdThoiGian.appendChild(pThoiGian);
        tdThoiGian.appendChild(inputThoiGian);
        tr.appendChild(tdThoiGian);
        
        // Tạo cột chứa button Delete xóa đối tượng
        var tdButtonDelete = document.createElement('td');
        // Tạo button xóa 
        var buttonDelete = document.createElement('button');
        buttonDelete.innerHTML = 'Delete';
        buttonDelete.className = 'btn-delete';
        buttonDelete.addEventListener('click', function() {
            // Lấy vị trí của phần tử cần xóa 
            var indexDelete = parseInt(this.parentNode.parentNode.children[0].textContent) - 1;
            todoList = todoList.slice(0, indexDelete)
                        .concat(todoList.slice(indexDelete + 1));
                        
            // Sau khi xóa được cập nhập lại giao diện
            reload();
        });
        tdButtonDelete.appendChild(buttonDelete);
        tr.appendChild(tdButtonDelete);
        
        // Tăng chỉ số cột lên
        index++;
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}