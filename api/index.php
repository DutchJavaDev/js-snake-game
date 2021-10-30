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
        echo '<h2>Play some more games first to see your highscores</h2>';
    }
    else
    {
        $table = '
        <h3>Top 10 highscores</h3> 
        <table>
            <tr>
                Score
            <tr>';
    
        foreach($scoreArray as $row) {
            $table .= '<tr><td>' . $row['score'] . '</td></tr>';
        }
    
        $table .= '</table>';
    
        echo $table;
    }

    http_response_code(200);

} else if($request_method == 'POST') {

    // Bad request
    if(!isset($_POST['score']))
        return http_response_code(400);

    $db = new DbService($host, $db, $user, $password);

    $score = $_POST['score'];

    $db->addScore($score);

    http_response_code(201);

} else {
    // Method Not Allowed
    http_response_code(405);
}
?>