<?php
class Config {

    private static $instance = null;
    private $dbServerName = "localhost";
    private $dbPort = "3307";
    private $dbUsername = "root";
    private $dbPassword = "root";
    private $dbName = "final";

    private function __construct() {

        $configFile = file_exists('.env.local') ? '.env.local' : '.env';
        $config = file_get_contents($configFile);
        if(!$config){
            trigger_error('Unable to load config. Default config will be used', E_USER_WARNING);
            return;
        }
        $tokens = explode(PHP_EOL, $config);
        foreach ($tokens as $token){
            $keyValue = explode('=', $token);
            if(count($keyValue) != 2){
                throw new RuntimeException('Invalid config format. Each line must have a key and a value separated by a single "="');
            }
            $key = $keyValue[0];
            $value = $keyValue[1];
            // God I love PHP (no I don't)
            $this->$key = $value;
        }

    }

    public static function getInstance(): Config
    {

        if(self::$instance == null){
            self::$instance = new Config();
        }

        return self::$instance;

    }

    /**
     * @return string
     */
    public function getDBServerName(): string
    {
        return $this->dbservername;
    }

    /**
     * @return string
     */
    public function getDBPort(): string
    {
        return $this->dbport;
    }

    /**
     * @return string
     */
    public function getDBUsername(): string
    {
        return $this->dbusername;
    }

    /**
     * @return string
     */
    public function getDBPassword(): string
    {
        return $this->dbpassword;
    }

    /**
     * @return string
     */
    public function getDBName(): string
    {
        return $this->dbName;
    }

    public function getXAMPPPath() {
        return 'C:\xampp'; // replace with the correct path to your XAMPP installation
    }

}