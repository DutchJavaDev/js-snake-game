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
                exit('Something weird happened');
            }
        }

        public function addScore(int $score) {
            $insertQuery = 'INSERT INTO `score_table`(`score`) VALUES (?)';
            $stmt = $this->connection->prepare($insertQuery);
            $stmt->execute([$score]);
        }

        public function getTopScores() {
            $setlectQuery = 'SELECT * FROM `score_table` ORDER BY score DESC LIMIT 10';
            $stmt = $this->connection->prepare($setlectQuery);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

    }
?>