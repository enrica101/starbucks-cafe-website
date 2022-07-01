<?php 
session_start();
spl_autoload_register(function ($class_name) {
    include $class_name . '.php';
});

$conn = mysqli_connect('localhost', 'root', '', 'menu');
if(!$conn){
    die("Conneciton failed: " . mysqli_connect_error());
}

$order = new Order();
$triggerValue = $_GET['trigger']; 


switch($triggerValue){
    case 'addCustomer':

        $fname = $_GET['firstName'];
        $lname = $_GET['lastName'];

        $query = "INSERT INTO customers (firstName, lastName) VALUES ('$fname', '$lname')";
        mysqli_query($conn, $query);
        echo $fname;

        $query = "SELECT MAX(customerNo) FROM customers";
        $result = mysqli_query($conn, $query);
        $customerInfo = mysqli_fetch_all($result, MYSQLI_ASSOC);

        //$customerInfo returns an object array from the result of the query hence the need for the foreach loop
        foreach ($customerInfo as $key => $value) {
            $customerNo = (int)$value['MAX(customerNo)'];
            $_SESSION['orderNo'] = $customerNo;
        }

        break;
    case 'getCustomer':
        if(isset($_SESSION['orderNo'])){
            $orderNo = $_SESSION['orderNo'];
        
            $query = "SELECT firstName FROM customers WHERE orderNo = '$orderNo'";
            $result = mysqli_query($conn, $query);
            $customerInfo = mysqli_fetch_all($result, MYSQLI_ASSOC);

            foreach ($customerInfo as $key => $value) {
                $customerName = $value['firstName'];
            }

                echo json_encode($customerName);
            }
        break;

     //DESCRIPTION: if purpose of the get request is to INSERT or ADD orders into the DB then trigger return value is false.
    case 'insertItem':
       
        //DESCRIPTION: checks if customer has entered complete name else system does nothing.
        if(isset($_SESSION['orderNo'])){
            $itemNo = $_GET['itemNo'];
            $orderNo = $_SESSION['orderNo'];
            $itemName = $_GET['itemName'];
            $itemSize = $_GET['itemSize'];
            $itemPrice = $_GET['itemPrice'];
            $itemImg = $_GET['itemImg'];

           
            //DESCRIPTION: IF the customer has not yet added even a single item into the cart
            // THEN: update customers table to set column orderNo = orderNo from inside session to associate that orderNo -
            //to the one inside orders table. 
            if(count($order->getAllOrders($orderNo)) == 0){

                $query = "UPDATE customers SET orderNo ='$orderNo'  WHERE customerNo='$orderNo'";
                mysqli_query($conn, $query);

                $query = "INSERT INTO orders (orderNo, itemNo, itemName, quantity, price, images) VALUES ('$orderNo', '$itemNo', '$itemName', 1, '$itemPrice', '$itemImg')";
                mysqli_query($conn, $query);
            }else{
                $query = "INSERT INTO orders (orderNo, itemNo, itemName, quantity, price, images) VALUES ('$orderNo', '$itemNo', '$itemName', 1, '$itemPrice', '$itemImg')";
                mysqli_query($conn, $query);
            }
                
            
        }
        break;

        case 'displayOrdersToCart':
            echo json_encode($order->getAllOrders($_SESSION['orderNo']));
            break;
        
        case 'deleteItem':
            $itemNo = $_GET['itemNo'];
    
            $query = "DELETE FROM orders WHERE itemNo = '$itemNo'";
            mysqli_query($conn, $query);

            echo json_encode($order->getAllOrders($_SESSION['orderNo']));
            break;

        case 'displayOrdersToCheckout':
                echo json_encode($order->getAllOrders($_SESSION['orderNo']));
            break;

        case 'destroySession':
            session_destroy();
            echo $_SESSION['orderNo'];
            break;


}
