<?php 

	ob_start();

?>

<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	<img src="http://arsenalindustries.hol.es/uploads/<?php echo $_POST['picture-name'] ?>">
</body>
</html>

<?php

	
	$html = ob_get_contents();
// die($html);
	// include('../mailer/PHPMailerAutoload.php');
	include('../mailer/class.phpmailer.php');
	include('../mailer/class.smtp.php');

	$mail = new PHPMailer();

	$mail->isSMTP();                                      // Set mailer to use SMTP
	$mail->Host = 'ssl://smtp.gmail.com';  // Specify main and backup SMTP servers
	$mail->SMTPAuth = true;                               // Enable SMTP authentication
	$mail->Username = 'magicmediave@gmail.com';                 // SMTP username
	$mail->Password = 'robert18554560';                           // SMTP password
	$mail->SMTPSecure = 'TLS';                            // Enable TLS encryption, `ssl` also accepted
	$mail->Port = 587;                                    // TCP port to connect to

	$mail->From = 'magicmediave@gmail.com';
	$mail->FromName = 'Arsenal Industries';
	$mail->addAddress($_POST['email']);     // Add a recipient
	// $mail->addAddress('ellen@example.com');               // Name is optional
	$mail->addReplyTo('magicmediave@gmail.com', 'Arsenal Industries');
	// $mail->addCC('cc@example.com');
	// $mail->addBCC('bcc@example.com');

	// $mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
	$mail->addAttachment('../uploads/'.$_POST['picture-name'], 'new.jpg');    // Optional name
	$mail->isHTML(true);                                  // Set email format to HTML

	$mail->Subject = 'Mi chaleco en Arsenal Industries';
	$mail->Body    = $html;

	if(!$mail->send()) {
	    echo 'Message could not be sent.';
	    echo 'Mailer Error: ' . $mail->ErrorInfo;
	} else {
	    echo 'Message has been sent';
	}