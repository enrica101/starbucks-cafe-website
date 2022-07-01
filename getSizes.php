<?php 
spl_autoload_register(function ($class_name) {
    include $class_name . '.php';
});
$conn = mysqli_connect('localhost', 'root', '', 'menu');

if(!$conn){
    die("Conneciton failed: " . mysqli_connect_error());
}
// $itemName = $_GET['itemName'];
$type = 'size';
// echo $_GET['itemName'];

$sqlQuery = "SELECT * FROM extras WHERE type = '$type'";
$result = mysqli_query($conn, $sqlQuery);
$sizes = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($sizes);
