<?php
include_once('sql.php');

$partyName = isset($_POST['party_name']) ? json_decode($_POST['party_name']) : null;
$trackName = isset($_POST['track_name']) ? json_decode($_POST['track_name']) : null;
$trackArtist = isset($_POST['track_artist']) ? json_decode($_POST['track_artist']) : null;
$trackUri = isset($_POST['uri']) ? json_decode($_POST['uri']) : null;
$playlistUri = isset($_POST['playlist_uri']) ? json_decode($_POST['playlist_uri']) : null;

// $blob = json_decode($blobJSON);
// $columns = implode(", ",array_keys($blob));

// $escaped_values = array_map('mysql_real_escape_string', array_values($blob));
// $values  = implode(", ", $escaped_values);

echo $partyName;

$truncate = "TRUNCATE tracks";
mysql_query($truncate);


$spotifyUser = 'pmilla1606';
for ($i=0; $i < count($trackName); $i++ ) {
  $partyNames = mysql_real_escape_string($partyName[$i]);	
  $trackNames = mysql_real_escape_string($trackName[$i]);
  $trackArtists = mysql_real_escape_string($trackArtist[$i]);
  $trackUris = mysql_real_escape_string($trackUri[$i]);
  $playlistUris = mysql_real_escape_string($playlistUri);  

echo $playlistUris;
$sql = "INSERT INTO `tracks`(track_name, track_artist, track_uri, party_name, playlist_uri) VALUES ('".$trackNames."','".$trackArtists."','".$trackUris."','".$partyNames."','".$playlistUris."')";





 $write = mysql_query($sql, $dbhandle);
 if(! $write){
 	die('Could not connect' . mysql_error());
 }
}


// var_dump(json_decode($blob, true));




?>