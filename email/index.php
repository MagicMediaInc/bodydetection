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

	$conn = mysqli_connect('localhost','root','', 'arsenal');
	// $conn = mysqli_connect('SERVER','USER','PASSWORD', 'DATABASE');
	if($conn):
		if(isset($_POST['email'])):
			$data = $_POST;
			$conn->query("INSERT INTO `arsenal`.`email` (`id`, `email`) VALUES (NULL, '".$data['email']."');")	;
			#echo true;
		else:
			echo false;
		endif;
	else:
		die('No se pudo conectar : ' . mysql_error());
	endif;

	include('../mailer/PHPMailerAutoload.php');

	$mail = new PHPMailer();

	$mail->isSMTP();                                      // Set mailer to use SMTP
	$mail->Host = 'mx1.hostinger.co';  // Specify main and backup SMTP servers
	$mail->SMTPAuth = true;                               // Enable SMTP authentication
	$mail->Username = 'prueba@programingphp.hol.es';                 // SMTP username
	$mail->Password = 'TheFourElemelons';                           // SMTP password
	// $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
	$mail->Port = 2525;                                    // TCP port to connect to

	$mail->From = 'prueba@programingphp.hol.es';
	$mail->FromName = 'Arsenal Industries';
	$mail->addAddress($_POST['email']);     // Add a recipient
	// $mail->addAddress('ellen@example.com');               // Name is optional
	$mail->addReplyTo('info@example.com', 'Information');
	// $mail->addCC('cc@example.com');
	// $mail->addBCC('bcc@example.com');

	// $mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
	$mail->addAttachment('../uploads/'.$_POST['picture-name'], 'Mi Chaleco.jpg');    // Optional name
	$mail->isHTML(true);                                  // Set email format to HTML

	$mail->Subject = 'Mi chaleco en Arsenal Industries';
	$mail->Body    = $html;

	if(!$mail->send()) {
	    echo 'Message could not be sent.';
	    echo 'Mailer Error: ' . $mail->ErrorInfo;
	} else {
	    echo 'Message has been sent';
	}