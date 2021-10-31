<?php 
require_once("database.php");

$request_method = $_SERVER['REQUEST_METHOD'];
$host = 'localhost';
$db = 'snake_db';
$user = 'root';
$password = '';


if($request_method == 'GET') {

    $db = new DbService($host, $db, $user, $password);

    $scoreArray = $db->getTopScores();

    if(count($scoreArray) == 0) {
        echo 'empty';
    }
    else
    {
        $topScores = array();

        foreach($scoreArray as $row) {
            $record = new stdClass();
            $record->name = $row['name'];
            $record->score = $row['score'];
            array_push($topScores, $record);
        }

        echo json_encode($topScores);
    }

    http_response_code(200);

} else if($request_method == 'POST') {

    // Bad request
    if(!isset($_POST['score']) || !isset($_POST['name']))
        return http_response_code(400);

    $db = new DbService($host, $db, $user, $password);

    $name = $_POST['name'];
    $score = $_POST['score'];

    if($db->nameExists($name)) {
        echo 'name has been taken ';
        http_response_code(400);
        return;
    }

    $db->addScore($name,$score);

    http_response_code(201);

} else {
    // Method Not Allowed
    http_response_code(405);
}
?>