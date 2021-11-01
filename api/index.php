<?php 
require_once("database.php");

// Requests
$request_method = $_SERVER['REQUEST_METHOD'];
$host = 'db';
$db = 'snakedb';
$user = 'root';
$password = '';


if($request_method == 'GET') {
    handleGetRequest($host, $db, $user, $password);
} else if($request_method == 'POST') {
    handlePostRequest($host, $db, $user, $password, $request_url, $check_username_param);
} else {
    // Method Not Allowed
    http_response_code(405);
}

function handleGetRequest($host, $db, $user, $password) {
    
    $databaseService = new DbService($host, $db, $user, $password);

    $scoreArray = $databaseService->getTopScores();

    if(count($scoreArray) == 0) {
        echo json_encode(array());
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
}

function handlePostRequest($host, $db, $user, $password, $request_url, $check_username_param) {
    $databaseService = new DbService($host, $db, $user, $password);

    $parameters = parse_url($request_url, PHP_URL_QUERY);

    // http://localhost/api?checkusername=[username to check]
    if(str_contains($parameters, $check_username_param))
    {
        if($databaseService->nameExists(str_split($parameters, strlen($check_username_param))[1])) {
            echo 'name has been taken, please try another';
            http_response_code(400);
            return;
        }

        http_response_code(200);
        return;
    }
    else
    {
        // Bad request
        if(!isset($_POST['score']) || !isset($_POST['name']))
            return http_response_code(400);

        $name = $_POST['name'];
        $score = $_POST['score'];

        if($databaseService->nameExists($name))
        {
            $databaseService->updateScore($name, $score);
            echo $name;
        }
        else
        {
            $databaseService->addScore($name,$score);
        }
        
        http_response_code(201);
        return;
    }
}
?>