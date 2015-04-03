<?php 

	ob_start();

?>

<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	<img src="../uploads/<?php echo $_POST['picture-name'] ?>">
</body>
</html>

<?php

	$html = ob_get_contents();

	mail($_POST['email'], "Mi Chaleco con Arsenal Industries", $html);