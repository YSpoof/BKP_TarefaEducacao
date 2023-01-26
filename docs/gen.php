<?php
file_put_contents("info.txt", "NOME: " . $_GET["ne"] . " | EMAIL: " . $_GET["el"]."\n", FILE_APPEND | LOCK_EX);

$pic = './assets/images/static/pixel.png';
$fp = fopen($pic, 'rb');

header("Content-Type: image/png");
header("Content-Length: " . filesize($pic));

fpassthru($fp);
exit
?>
