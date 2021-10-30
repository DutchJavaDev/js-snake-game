<?php 
if($_SERVER['REQUEST_METHOD'] == 'GET') {
    

} else if($_SERVER['REQUEST_METHOD'] == 'POST') {

    if(!isset($_POST['score']))
        return;

    $score = $_POST['score'];

    echo $score;
}
?>