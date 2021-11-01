<?php 
    class DbService {

        private $port = "3306";
        private $charset = 'utf8mb4';
        private $connection;

        // https://websitebeaver.com/php-pdo-prepared-statements-to-prevent-sql-injection
        private $options = [
            \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
            \PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        function __construct($host, $db, $user, $password){
            try{
                $dsn = "mysql:host=$host;dbname=$db;charset=$this->charset;port=$this->port";
                
                $this->connection = new PDO($dsn, $user, $password, $this->options);
            }
            catch(\PDOException $e) {
                exit($e);
            }
        }
        
        public function nameExists($name) {
            $setlectQuery = 'SELECT `name` from `snake_table` where `name` = ?';
            $stmt = $this->connection->prepare($setlectQuery);
            $stmt->execute([$name]);
            return count($stmt->fetchAll(PDO::FETCH_ASSOC));
        }

        public function addScore($name,$score) {
            $insertQuery = 'INSERT INTO `snake_table`(`name`,`score`) VALUES (?,?)';
            $stmt = $this->connection->prepare($insertQuery);
            $stmt->execute([$name,$score]);
        }

        public function updateScore($name,$score){
            $insertQuery = 'UPDATE `score_table` SET `score`=? WHERE `name` =?';
            $stmt = $this->connection->prepare($insertQuery);
            $stmt->execute([$score,$name]);
        }

        public function getTopScores() {
            $setlectQuery = 'SELECT * FROM `snake_table` ORDER BY score DESC LIMIT 10';
            $stmt = $this->connection->prepare($setlectQuery);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

    }
?>