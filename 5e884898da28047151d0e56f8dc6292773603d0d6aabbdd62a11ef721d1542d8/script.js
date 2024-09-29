// ページが読み込まれたときにファイルリストを表示
document.addEventListener('DOMContentLoaded', () => {
    loadFileList();
});

// アップロードボタンのクリックイベント
document.getElementById('uploadButton').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput');

    // ファイルが選択されているか確認
    if (fileInput.files.length === 0) {
        alert('ファイルを選択してください。');
        return;
    }

    // 選択されたファイルを取得
    const file = fileInput.files[0];

    // FileReaderを使ってファイルをBase64形式に変換
    const reader = new FileReader();
    reader.onload = function (event) {
        const fileInfo = {
            name: file.name,
            data: event.target.result // Base64データを取得
        };

        // ローカルストレージから既存のファイルリストを取得
        const fileList = JSON.parse(localStorage.getItem('fileList')) || [];
        fileList.push(fileInfo);

        // ローカルストレージに保存
        localStorage.setItem('fileList', JSON.stringify(fileList));

        // リストにファイルを追加
        addFileToList(fileInfo, fileList.length - 1); // インデックスを指定してファイルを追加

        // ファイル入力をクリア
        fileInput.value = '';
    };
    
    reader.readAsDataURL(file); // ファイルをBase64形式で読み込む
});

// ファイルリストを読み込む関数
function loadFileList() {
    const fileList = JSON.parse(localStorage.getItem('fileList')) || [];
    fileList.forEach((file, index) => {
        addFileToList(file, index);
    });
}

// ファイルをリストに追加する関数
function addFileToList(file, index) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${file.name}</span>
        <button class="downloadButton" data-index="${index}">ダウンロード</button>
        <button class="deleteButton" data-index="${index}">削除</button>
    `;
    document.getElementById('fileList').appendChild(li);

    // ダウンロードボタンのクリックイベントを設定
    li.querySelector('.downloadButton').addEventListener('click', downloadFile);
    
    // 削除ボタンのクリックイベントを設定
    li.querySelector('.deleteButton').addEventListener('click', deleteFile);
}

// パスワードを変数として設定
const correctPassword = 'sakuzyo'; // パスワードをここで設定

// ファイルダウンロードの関数
function downloadFile(event) {
    const index = event.target.getAttribute('data-index');
    const password = prompt('ファイルをダウンロードするにはパスワードを入力してください:');

    // 正しいパスワードを確認
    if (password === correctPassword) {
        const fileList = JSON.parse(localStorage.getItem('fileList')) || [];
        const fileData = fileList[index].data; // Base64データを取得

        // ダウンロードリンクを作成
        const link = document.createElement('a');
        link.href = fileData;
        link.download = fileList[index].name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('パスワードが間違っています。');
    }
}

// ファイル削除の関数
function deleteFile(event) {
    const index = event.target.getAttribute('data-index');
    const password = prompt('ファイルを削除するにはパスワードを入力してください:');

    // 正しいパスワードを確認
    if (password === correctPassword) {
        let fileList = JSON.parse(localStorage.getItem('fileList')) || [];
        fileList.splice(index, 1); // ファイルをリストから削除

        // 更新されたファイルリストをローカルストレージに保存
        localStorage.setItem('fileList', JSON.stringify(fileList));

        // ページを再読み込みしてファイルリストを更新
        location.reload();
    } else {
        alert('パスワードが間違っています。');
    }
}
