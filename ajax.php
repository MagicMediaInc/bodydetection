<?php

	$conn = mysqli_connect('localhost','root','', 'arsenal');
	if($conn):
		if(isset($_POST['name'])):
			$data = $_POST;
			$conn->query("INSERT INTO `arsenal`.`email` (`id`, `name`, `email`) VALUES (NULL, '".$data['name']."', '".$data['email']."');")	;
			echo true;
		else:
			echo false;
		endif;
	else:
		die('No se pudo conectar : ' . mysql_error());
	endif;