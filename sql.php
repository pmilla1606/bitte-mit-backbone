<?php
$username = "pmargaritoff";
$password = "bitte_test";
$hostname = "test.bitte.io"; 

//connection to the database
$dbhandle = mysql_connect($hostname, $username, $password) 
  or die("Unable to connect to MySQL");



$selected = mysql_select_db("bitte_test",$dbhandle) 
  or die("Could not select examples");
  
  


//execute the SQL query and return records
// $result = mysql_query("SELECT * FROM testing");
//fetch tha data from the database
// while ($row = mysql_fetch_array($result)) {
   // echo "order:".$row{'sort_order'}."<br /> track name:".$row{'track_name'}."<br /> ".$row{'track_uri'}."<br>";
//}



?>