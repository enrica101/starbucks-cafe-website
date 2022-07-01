<?php
spl_autoload_register(function ($class_name) {
    include $class_name . '.php';
});

class Order extends Consumables{
    private int $orderNo = 0;
    private int $quantity = 0;
    private float $subTotal = 0;
    private float $totalAmount = 0;
    private float $VAT = 0.12;

    // public function __constructor(int $itemNo, int $quantity, int $price, float $subtTotal, float $totalAmount){
    //     $this->$itemNo = $itemNo;
    //     $this->$quantity = $quantity;
    //     $this->$price = $price;
    //     $this->$subTotal = $subTotal;
    //     $this->$totalAmount = $totalAmount;
    //     return $this;
    // }

    public function setQuantity(int $quantity){
        $this->quantity = $quantity;
        return $this;
    }
    // public function setSubTotal(array $itemList): float{
    //     int $i = 1;
    //     float $sum = 0;
    //     for($i;$i<count($itemList); $i++){
    //         $sum=+$itemList[$i];
    //     }
    //     $this->subTotal = $sum;
    //     return $this;
    // }
    public function setTotalAmount(float $totalAmount){
        $calcVAT = $this->subTotal*$this->VAT;
        $this->totalAmount = $this->subTotal + $calcVAT;
        return $this;
    }

    public function getQuantity(): int{
        return $this->quantity;
    }
    public function getSubTotal(): float{

        return $this->subTotal;
    }
    public function getTotalAmount(): float{
        return $this->totalAmount;
    }

    public function getVAT(): float{
        return $this->VAT;
    }

//DARYLL'S IMPLEMENTATION
    
//function to connect to db
public function connect() {
    $db = new mysqli('localhost', 'root', '', 'menu');
    if ($db->connect_error) {
        die('Connect Error (' . $db->connect_errno . ') '
                . $db->connect_error);
    }
    return $db;
}


//function to get all orders
public function getAllOrders($orderNo) {
    $db = $this->connect();
    $sql = "SELECT * FROM orders WHERE orderNo ='$orderNo'";
    $result = $db->query($sql);
    $orders = array();
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    return $orders;
}


//make orders table in sql database
public function makeOrdersTable() {
    $db = $this->connect();
    $sql = "CREATE TABLE IF NOT EXISTS orders (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        price FLOAT(10,2) NOT NULL,
        quantity INT(6) NOT NULL,
        type VARCHAR(30) NOT NULL
    )";
    $db->query($sql);
}


//check existence of orders table
public function checkOrdersTable() {
    $db = $this->connect();
    $sql = "SHOW TABLES LIKE 'orders'";
    $result = $db->query($sql);
    if ($result->num_rows > 0) {
        return true;
    } else {
        return false;
    }
}


//function to get order by id
public function getOrderById($id) {
    $db = $this->connect();
    $sql = "SELECT * FROM orders WHERE id = '$id'";
    $result = $db->query($sql);
    $order = $result->fetch_assoc();
    return $order;

}

}