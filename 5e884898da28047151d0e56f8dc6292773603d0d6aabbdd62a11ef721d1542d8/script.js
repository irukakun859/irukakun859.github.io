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
        addFileToList(fileInfo);

        // ファイル入力をクリア
        fileInput.value = '';
    };

    reader.readAsDataURL(file); // ファイルをBase64形式で読み込む
});

// ファイルリストを読み込む関数
function loadFileList() {
    const fileList = JSON.parse(localStorage.getItem('fileList')) || [];
    fileList.forEach(file => {
        addFileToList(file);
    });
}

// ファイルをリストに追加する関数
function addFileToList(file) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${file.name}</span>
        <button class="downloadButton" data-file="${file.data}">ダウンロード</button>
        <button class="deleteButton">削除</button>
    `;
    document.getElementById('fileList').appendChild(li);

    // ダウンロードボタンのクリックイベントを設定
    li.querySelector('.downloadButton').addEventListener('click', function () {
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 削除ボタンのクリックイベントを設定
    li.querySelector('.deleteButton').addEventListener('click', function () {
        const fileList = JSON.parse(localStorage.getItem('fileList')) || [];
        const index = [...document.getElementById('fileList').children].indexOf(li);
        fileList.splice(index, 1); // ファイルをリストから削除
        localStorage.setItem('fileList', JSON.stringify(fileList)); // 更新
        li.remove(); // リストから削除
    });
}
