<?php
if (isset($_FILES['myFile'])) {
    // Example:
    move_uploaded_file($_FILES['myFile']['tmp_name'], "uploads/" . $_FILES['myFile']['name']);
    echo '{"succ":true,"code":0,"data":{"name":"'.$_FILES['myFile']['name'].'","path":"/imgupload/uploads/'.$_FILES['myFile']['name'].'","fullpath":"2@/in/2015/05/13/444547FB-9152-C27D-0B88-5804ADFC9CDD.jpg"}}';
    exit;
}
?>