<?php
if (isset($_FILES['Filedata'])) {
    // Example:
    move_uploaded_file($_FILES['Filedata']['tmp_name'], "uploads/" . $_FILES['Filedata']['name']);
    echo '{"succ":true,"code":0,"data":{"name":"'.$_FILES['Filedata']['name'].'","path":"/imgupload/uploads/'.$_FILES['Filedata']['name'].'","fullpath":"/fullpath/imgupload/uploads/'.$_FILES['Filedata']['name'].'"}}';
    exit;
}
?>